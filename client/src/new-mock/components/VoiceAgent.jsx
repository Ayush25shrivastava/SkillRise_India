import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, PhoneOff, Loader2, Volume2, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "../utils/helpers";
import { interviewAPI } from "../api";
import { useToast } from "./ui/Toast";
import Button from "./ui/Button";

const CALL_STATUS = {
  IDLE: "idle",
  CONNECTING: "connecting",
  ACTIVE: "active",
  ENDING: "ending",
  FINISHED: "finished",
};

// Polyfill for Cross Browser
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceAgent({ interview, onFinished }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [status, setStatus] = useState(CALL_STATUS.IDLE);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const timerRef = useRef(null);
  const transcriptRef = useRef([]);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Multilingual Support -> Default hi-IN as requested
      const chosenLang = interview.language === "Hindi" ? "hi-IN" : "en-IN";
      recognition.lang = chosenLang;

      recognition.onstart = () => {
        setIsListening(true);
        clearTimeout(silenceTimerRef.current);
        // 10s silence timeout handling
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
          toast({ title: "Silence detected", description: "Mic paused. Please use text input or unmute to talk.", type: "info" });
        }, 10000);
      };

      recognition.onresult = (event) => {
        clearTimeout(silenceTimerRef.current);
        const speechResult = event.results[0][0].transcript;
        if (speechResult.trim()) {
           handleUserAnswer(speechResult.trim());
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "network") {
           setIsListening(false);
           toast({ 
             title: "Voice API Blocked", 
             description: "Browser network blocked speech recognition. Continuing with Text Input mode.", 
             type: "warning" 
           });
        } else if (event.error !== "no-speech" && event.error !== "aborted") {
          toast({ title: "Mic Error", description: event.error, type: "error" });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      toast({ title: "Browser Unsupported", description: "Voice API not supported here. Use text fallback.", type: "warning" });
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      clearTimeout(silenceTimerRef.current);
    };
  }, [toast, interview.language]);

  // Timer Logic
  useEffect(() => {
    if (status === CALL_STATUS.ACTIVE) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Reusable TTS
  const speak = useCallback((text, onEndCallback = null) => {
    if (!window.speechSynthesis) return;
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const chosenLang = interview.language === "Hindi" ? "hi-IN" : "en-IN";
    utterance.lang = chosenLang;
    utterance.rate = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEndCallback && typeof onEndCallback === "function") {
        onEndCallback();
      }
    };
    
    window.speechSynthesis.speak(utterance);
  }, [interview.language]);

  const handleEndInterview = useCallback(async (finalTranscript) => {
    setStatus(CALL_STATUS.ENDING);
    clearInterval(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    window.speechSynthesis.cancel();

    try {
      await interviewAPI.update(interview._id, {
        transcript: finalTranscript,
        duration: timer,
        status: "completed",
      });

      toast({ title: "Analyzing…", description: "Generating your feedback card.", type: "info" });
      await interviewAPI.generateFeedback(interview._id);

      setStatus(CALL_STATUS.FINISHED);
      toast({ title: "Interview complete", type: "success" });

      if (onFinished) onFinished();
      else navigate(`/interviews/${interview._id}/feedback`);
    } catch (err) {
      console.error(err);
      toast({ title: "Error saving session", description: err.message, type: "error" });
      setStatus(CALL_STATUS.ACTIVE);
    }
  }, [interview?._id, timer, navigate, onFinished, toast]);

  const stopInterview = useCallback(() => {
    handleEndInterview(transcriptRef.current);
  }, [handleEndInterview]);

  const fetchNextQuestion = useCallback(async (currentTranscript) => {
    setIsProcessing(true);

    try {
      // Send standard array (compatible implicitly with backend logic) natively preserving routes
      const { data } = await interviewAPI.generateNextQuestion(interview._id, currentTranscript);
      const nextQ = data.nextQuestion || data.question;

      if (nextQ === "END_INTERVIEW" || (currentTranscript.filter(m => m.role === "assistant").length > interview.questions.length)) {
        speak("This concludes our interview. Thank you and have a great day!", () => {
           setTimeout(() => stopInterview(), 1000);
        });
        return;
      }

      const assistantEntry = { role: "assistant", content: nextQ };
      transcriptRef.current = [...transcriptRef.current, assistantEntry];
      setTranscript([...transcriptRef.current]);
      
      // Speak cleanly -> trigger listening natively
      speak(nextQ, () => {
        if (!isMuted && recognitionRef.current) {
          try {
             recognitionRef.current.start();
          } catch(e) { /* swallow DOM Exception if already started */ }
        }
      });
      
    } catch (err) {
      console.error("AI Logic Failure:", err);
      toast({ title: "AI Error", description: "Failed to generate next question.", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  }, [interview._id, interview.questions.length, isMuted, speak, stopInterview, toast]);

  const handleUserAnswer = useCallback((answerText) => {
    if (!answerText.trim() || isProcessing) return;
    
    if (recognitionRef.current) {
       recognitionRef.current.stop(); // Lock listening
    }
    
    const entry = { role: "user", content: answerText.trim() };
    transcriptRef.current = [...transcriptRef.current, entry];
    setTranscript([...transcriptRef.current]);
    
    fetchNextQuestion(transcriptRef.current);
  }, [isProcessing, fetchNextQuestion]);

  const handleManualInputSubmit = () => {
    if (!manualInput.trim()) return;
    const val = manualInput.trim();
    setManualInput("");
    handleUserAnswer(val);
  };

  const startInterview = useCallback(() => {
    setStatus(CALL_STATUS.ACTIVE);
    
    const firstMessage = `Hello. Let's start the ${interview.role} interview. First topic: ${interview.questions[0] || "Introduction"}`;
    const firstEntry = { role: "assistant", content: firstMessage };
    transcriptRef.current = [firstEntry];
    setTranscript([firstEntry]);
    
    // Core loop: speak -> end -> listen
    speak(firstMessage, () => {
      if (recognitionRef.current && !isMuted && !isProcessing) {
        try {
          recognitionRef.current.start();
        } catch(e) { /* DOM exception bypass */ }
      }
    });
  }, [interview, speak, isMuted, isProcessing]);

  // Restart Mic tracking dynamically
  const toggleMuted = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute && isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    } else if (!nextMute && !isSpeaking && !isProcessing && recognitionRef.current) {
       try {
         recognitionRef.current.start();
       } catch {}
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Identity Badges */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          Native Browser Voice
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest">
          <Cpu className="w-3 h-3" />
          Powered by LLM
        </div>
      </div>

      {/* Pulsing Core */}
      <div className="relative flex items-center justify-center">
        <div className={cn(
          "absolute w-64 h-64 rounded-full transition-all duration-1000 blur-3xl",
          isSpeaking ? "bg-primary/20 scale-125" : (isListening ? "bg-emerald-500/20 scale-110" : "bg-transparent scale-100")
        )} />
        
        <div className={cn(
          "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 border-2 shadow-2xl z-10",
          status === CALL_STATUS.ACTIVE && (isSpeaking ? "bg-primary border-primary scale-110 glow-primary" : (isListening ? "bg-emerald-500/80 border-emerald-400 scale-105" : "bg-secondary border-border"))
        )}>
          {status === CALL_STATUS.IDLE && <Mic className="w-12 h-12 text-muted-foreground" />}
          {status === CALL_STATUS.CONNECTING && <Loader2 className="w-12 h-12 text-primary animate-spin" />}
          {status === CALL_STATUS.ACTIVE && (isSpeaking ? <Volume2 className="w-12 h-12 text-white" /> : <Mic className={cn("w-12 h-12", isMuted ? "text-destructive" : (isListening ? "text-emerald-100 animate-pulse" : "text-foreground"))} />)}
        </div>
      </div>
      
      {/* Dynamic Status Text */}
      <div className="h-6 text-sm font-bold tracking-widest uppercase">
         {isSpeaking && <span className="text-primary animate-pulse">AI is Speaking...</span>}
         {isListening && !isSpeaking && !isProcessing && !isMuted && <span className="text-emerald-400 animate-pulse">Listening... (Speak now)</span>}
         {isProcessing && <span className="text-amber-400 animate-pulse">Processing response...</span>}
         {isMuted && status === CALL_STATUS.ACTIVE && <span className="text-destructive">Microphone Muted</span>}
      </div>

      {/* Start/Stop Controls */}
      <div className="text-center w-full max-w-md">
        {status === CALL_STATUS.IDLE && (
          <Button size="lg" onClick={startInterview} className="px-10 py-8 rounded-full glow-primary hover:scale-105 active:scale-95 transition-all w-full">
            Begin Interview Session
          </Button>
        )}
        
        {status === CALL_STATUS.ACTIVE && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6">
              <button onClick={toggleMuted} className={cn("w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all", isMuted ? "bg-destructive/10 border-destructive text-destructive" : "bg-secondary border-border")}>
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button onClick={stopInterview} className="w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-all">
                <PhoneOff className="w-8 h-8" />
              </button>
            </div>
            <p className="font-mono text-muted-foreground">{formatTimer(timer)}</p>
          </div>
        )}
      </div>

      {/* Interview Feed */}
      {transcript.length > 0 && (
        <div className="w-full max-h-96 overflow-y-auto space-y-4 glass-dark rounded-[2.5rem] p-8 border border-white/5 scrollbar-hide">
          <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em] mb-4 text-center">Live Transcription</p>
          {transcript.map((entry, i) => (
             <div key={i} className={cn("flex", entry.role === "user" ? "justify-end" : "justify-start")}>
               <div className={cn("max-w-[85%] rounded-[1.5rem] px-6 py-4 text-sm transiton-all duration-300", entry.role === "user" ? "bg-primary/20 text-foreground border border-primary/30 rounded-br-none" : "bg-white/5 text-foreground border border-white/10 rounded-tl-none")}>
                 <p className="text-[10px] font-bold mb-2 opacity-50 uppercase tracking-widest text-primary">
                   {entry.role === "user" ? "Candidate" : "Interviewer (LLM)"}
                 </p>
                 <p className="leading-relaxed">{entry.content}</p>
               </div>
             </div>
          ))}
          
          {/* Manual Input Fallback */}
          {status === CALL_STATUS.ACTIVE && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full border-t border-white/10 mt-6">
               <input
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary disabled:opacity-50"
                  placeholder="Or type your response here..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleManualInputSubmit(); }}
                  disabled={isProcessing || isSpeaking}
               />
               <Button 
                 variant="outline" 
                 size="sm" 
                 className="w-full sm:w-auto px-6 whitespace-nowrap" 
                 onClick={handleManualInputSubmit}
                 disabled={isProcessing || isSpeaking || !manualInput.trim()}
                 loading={isProcessing}
               >
                 Send Response
               </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
