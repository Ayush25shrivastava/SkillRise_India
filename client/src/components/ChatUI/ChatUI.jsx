import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Paperclip, X, Copy, Check, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatUI = () => {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() && !selectedFile) return;

    const userMessage = input || "Uploaded my resume";

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);

    setInput("");
    setLoading(true);
    setLoadingText("Thinking...");

    try {
      const formData = new FormData();

      if (input.trim()) formData.append("message", input.trim());
      if (threadId) formData.append("threadId", threadId);
      formData.append("userId", "local-test-user");

      if (selectedFile) {
        formData.append("resume", selectedFile);
      }

      removeFile();

      const response = await fetch("http://localhost:5002/api/chatbot/message", {
        method: "POST",
        body: formData
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let assistantText = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";

        for (const chunk of chunks) {
          const trimmedChunk = chunk.trim();
          if (trimmedChunk.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmedChunk.replace("data: ", ""));

              if (data.type === "progress") {
                setLoadingText(data.message);
              }

              if (data.type === "complete") {
                assistantText += data.reply;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated.push({
                    role: "assistant",
                    content: assistantText,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  });
                  return updated;
                });

                if (data.threadId) setThreadId(data.threadId);
              }
            } catch (parseError) {
              console.error("Error parsing JSON chunk from backend:", parseError, trimmedChunk);
            }
          }
        }
      }

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to AI server",
          isError: true
        }
      ]);

    }

    setLoading(false);
  };

  const CodeBlock = ({ node, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");

    const copyCode = () => {
      navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (match) {
      return (
        <div className="relative my-4">
          <button
            onClick={copyCode}
            className="absolute top-2 right-2 text-xs bg-[#0c0c14] border border-white/10 px-2 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-white/10 transition-colors text-white/70"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy code"}
          </button>

          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{ borderRadius: '0.8rem', padding: '1.5rem', backgroundColor: '#06060a' }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
        {children}
      </code>
    );
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-135px)] bg-[#12121a]/40 border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">

        {/* HEADER */}
        <div className="flex items-center gap-4 px-8 py-4 border-b border-white/5 bg-[#12121a]/50 backdrop-blur-md z-10">
          <div className="w-10 h-10 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight text-xl">Agentic Career Assistant</h2>
            <p className="text-xs font-medium text-white/40 tracking-widest uppercase mt-0.5">AI powered guidance</p>
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center animate-pulse"><Bot size={32} className="text-indigo-400"/></div>
              <p className="max-w-md text-center font-medium bg-white/5 px-6 py-3 rounded-full text-sm border border-white/5">
                Ask about skills, careers, or upload your resume to start.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-2 duration-300"}`}>
              {msg.role === "assistant" && (
                <div className="w-10 h-10 shrink-0 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-indigo-400 mr-4 mt-1"><Sparkles size={18}/></div>
              )}

              <div className={`max-w-[75%] p-5 rounded-3xl ${
                msg.role === "user"
                  ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                  : "bg-[#12121a] border border-white/5 text-white/90 rounded-tl-sm shadow-xl"
              }`}>

                <div className="prose prose-invert prose-p:leading-relaxed prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                <div className={`text-[10px] uppercase font-black tracking-widest mt-3 ${msg.role === "user" ? "text-white/50" : "text-white/20"}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-10 h-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-white/70 ml-4 mt-1"><User size={18}/></div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-4 text-white/40 font-medium text-sm animate-pulse bg-[#12121a] border border-white/5 w-fit px-6 py-3 rounded-full">
              <Loader2 className="animate-spin text-indigo-400" size={16}/>
              {loadingText || "Synthesizing response..."}
            </div>
          )}

          <div ref={messagesEndRef}/>

        </div>

        {/* INPUT */}
        <div className="border-t border-white/5 p-4 bg-[#0a0a0f]/90 backdrop-blur-xl shrink-0">
          {selectedFile && (
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg mb-3 w-fit border border-white/10 animate-in slide-in-from-bottom-2">
              <Paperclip size={14} className="text-indigo-400"/>
              <span className="text-xs font-medium text-white/90">{selectedFile.name}</span>
              <button onClick={removeFile} className="text-white/30 hover:text-rose-400 transition-colors ml-1">
                <X size={14}/>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-3 w-full relative">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-11 h-11 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl transition-all flex-shrink-0 text-white/50 hover:text-white"
            >
              <Paperclip size={18}/>
            </button>

            <div className="flex-1 bg-[#12121a] border border-white/10 hover:border-white/20 focus-within:border-indigo-500/40 rounded-xl transition-all focus-within:shadow-[0_0_15px_rgba(99,102,241,0.05)] flex overflow-hidden min-h-[44px]">
               <textarea
                 ref={textareaRef}
                 value={input}
                 rows={1}
                 onChange={(e) => {
                   setInput(e.target.value);
                   autoResizeTextarea();
                 }}
                 placeholder="Type your message..."
                 className="w-full resize-none bg-transparent border-none px-4 py-[10px] text-white placeholder:text-white/20 focus:outline-none focus:ring-0 max-h-32 overflow-y-auto scrollbar-hide text-sm font-medium leading-relaxed self-center"
               />
            </div>

            <button
              type="submit"
              disabled={loading || (!input.trim() && !selectedFile)}
              className="w-11 h-11 bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-white/5 disabled:text-white/20 rounded-xl transition-all flex-shrink-0 flex items-center justify-center group active:scale-95"
            >
              <Send size={16} className={!loading && (input.trim() || selectedFile) ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" : ""} />
            </button>
          </form>
        </div>
      </div>

  );
};

export default ChatUI;