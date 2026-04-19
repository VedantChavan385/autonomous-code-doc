import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Code2, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  History,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { useChatStore } from '../stores/chatStore';
import { useProjectStore } from '../stores/projectStore';
import { useSocket } from '../hooks/useSocket';
import { cn } from '../utils/cn';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const { messages, isLoading, error, sendMessage, fetchHistory, clearChat } = useChatStore();
  const { selectedProject, fetchProject } = useProjectStore();

  // Initialize live updates
  useSocket();

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchHistory(id);
    }
    return () => clearChat();
  }, [id, fetchProject, fetchHistory, clearChat]);

  // Handle auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text) => {
    try {
      await sendMessage(id, text);
    } catch (err) {
      toast.error('Failed to get an answer. Is the AI server running?');
    }
  };

  if (!selectedProject && isLoading && messages.length === 0) {
    return (
      <div className="h-screen bg-[#0a0a14] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a14] flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/5 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4 overflow-hidden">
          <Link 
            to={`/projects/${id}`} 
            className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="h-6 w-[1px] bg-white/5" />
          <div className="flex flex-col min-w-0">
            <h1 className="text-white font-bold truncate text-sm sm:text-base">
              {selectedProject?.name || 'Loading project...'}
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-black">
              <Code2 className="h-3 w-3 text-accent-end" />
              <span>Context Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex text-slate-400 font-bold text-[11px] uppercase tracking-tighter">
            <History className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <div className="h-8 w-8 rounded-full bg-accent-start/20 flex items-center justify-center border border-accent-start/30">
            <Sparkles className="h-4 w-4 text-accent-start" />
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent-start/10 to-accent-end/10 flex items-center justify-center mb-8 border border-white/5">
                <MessageSquare className="h-8 w-8 text-accent-end" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-4">Chat with your codebase</h2>
              <p className="text-slate-500 text-lg max-w-md leading-relaxed mb-10">
                Ask specific questions about logic, data flow, or implementation details.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                {[
                  "How does the authentication flow work?",
                  "Where is the user profile managed?",
                  "Explain the database schema.",
                  "Which components handle project creation?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left text-sm text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all group"
                  >
                    {q}
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
              ))}
              
              {/* Special message for errors */}
              {error && (
                <div className="flex justify-center my-8">
                  <div className="px-6 py-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error">
                    <Info className="h-5 w-5" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-12" />
            </div>
          )}
        </div>
      </main>

      {/* Chat Input Area */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
