import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2, Paperclip, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [threadId, setThreadId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const userMessage = input || "I have uploaded my resume.";
    const fileToUpload = selectedFile;
    
    setInput('');
    removeFile();
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: fileToUpload ? `${userMessage}\n\n[Attached File: ${fileToUpload.name}]` : userMessage 
    }]);
    setLoading(true);
    setLoadingText('Connecting...');

    try {
      const formData = new FormData();
      if (input.trim()) formData.append('message', input.trim());
      formData.append('userId', 'local-test-user');
      if (threadId) formData.append('threadId', threadId);
      if (fileToUpload) formData.append('resume', fileToUpload);

      const response = await fetch('http://localhost:5002/api/chatbot/message', {
        method: 'POST',
        // Browser automatically sets Content-Type to multipart/form-data with boundary when body is FormData
        body: formData
      });
      
      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
             const dataStr = line.substring(6).trim();
             if (!dataStr) continue;
             try {
               const data = JSON.parse(dataStr);
               if (data.type === 'progress') {
                 setLoadingText(data.message);
               } else if (data.type === 'complete') {
                 if (data.threadId) setThreadId(data.threadId);
                 setMessages(prev => [...prev, {
                   role: 'assistant',
                   content: data.reply,
                   agentData: data.agentData
                 }]);
               }
             } catch (e) {
               console.error("Error parsing stream chunk:", e);
             }
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error connecting to the AI system. Please ensure the backend is running.',
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-5xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="text-blue-400" />
          Agentic Career Assistant
        </h2>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Bot size={48} className="mb-4 text-gray-600" />
            <p className="text-lg text-center max-w-md">
              Hello! I'm your Career AI Assistant. I can analyze skills, suggest courses, and build learning roadmaps.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Avatar Assistant */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mt-1 border border-blue-800 shrink-0">
                  <Bot size={16} className="text-blue-400" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`
                max-w-[80%] rounded-2xl p-4
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : msg.isError 
                    ? 'bg-red-900/50 text-red-200 border border-red-800 rounded-tl-sm' 
                    : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-sm'}
              `}>
                {msg.role === 'assistant' && !msg.isError ? (
                  <div className="markdown-body leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-5 mb-3 text-white border-b border-gray-600 pb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-2 text-blue-300" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-1 text-blue-200" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-base font-semibold mt-3 mb-1 text-gray-200" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-3 text-gray-200 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 mb-3 space-y-1 text-gray-200" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 mb-3 space-y-1 text-gray-200" {...props} />,
                        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                        em: ({ node, ...props }) => <em className="italic text-gray-300" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        code: ({ node, inline, ...props }) => inline
                          ? <code className="bg-gray-700 text-green-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                          : <code className="block bg-gray-900 border border-gray-700 text-green-300 p-4 rounded-lg text-sm font-mono overflow-x-auto my-3" {...props} />,
                        pre: ({ node, ...props }) => <pre className="bg-gray-900 border border-gray-700 rounded-lg overflow-x-auto my-3" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 my-3 italic text-gray-400" {...props} />,
                        hr: ({ node, ...props }) => <hr className="border-gray-700 my-4" {...props} />,
                        table: ({ node, ...props }) => <div className="overflow-x-auto my-3"><table className="w-full text-sm border-collapse border border-gray-700" {...props} /></div>,
                        thead: ({ node, ...props }) => <thead className="bg-gray-700" {...props} />,
                        th: ({ node, ...props }) => <th className="border border-gray-600 px-3 py-2 text-left font-semibold text-white" {...props} />,
                        td: ({ node, ...props }) => <td className="border border-gray-600 px-3 py-2 text-gray-300" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                )}
                
                {/* Agent Debug Data Display (Optional but helps see what agents did) */}
                {msg.agentData && Object.keys(msg.agentData).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50 text-xs">
                    <p className="text-gray-400 mb-2 font-semibold">Agent Discoveries:</p>
                    <pre className="bg-gray-950 p-3 rounded-lg overflow-x-auto text-gray-300">
                      {JSON.stringify(msg.agentData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Avatar User */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mt-1 border border-gray-600 shrink-0">
                  <User size={16} className="text-gray-300" />
                </div>
              )}
            </div>
          ))
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-800">
              <Bot size={16} className="text-blue-400" />
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-gray-400 text-sm">{loadingText || "Agents are analyzing..."}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        {selectedFile && (
          <div className="mb-3 flex items-center gap-2 bg-gray-800 p-2 rounded-lg border border-gray-700 w-max">
            <Paperclip size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300 truncate max-w-[200px]">{selectedFile.name}</span>
            <button 
              type="button" 
              onClick={removeFile}
              className="text-gray-500 hover:text-red-400 ml-2"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl px-4 flex items-center justify-center transition-colors border border-gray-700 disabled:opacity-50"
            title="Upload Resume"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="E.g., I know React and Node. What courses should I take?"
            className="flex-1 bg-gray-800 text-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || (!input.trim() && !selectedFile)}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;
