import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import { ExternalLink, Terminal, FileCode } from 'lucide-react';
import { cn } from '../../utils/cn';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex w-full mb-8",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] sm:max-w-[75%] rounded-2xl overflow-hidden",
        isUser 
          ? "bg-accent-start border-2 border-[#1a1a1a] text-[#1a1a1a] rounded-tr-none shadow-[4px_4px_0_#1a1a1a]" 
          : "bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] rounded-tl-none shadow-[4px_4px_0_#1a1a1a]"
      )}>
        {!isUser && (
          <div className="bg-slate-50 px-6 py-3 border-b-2 border-[#1a1a1a] flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-[#1a1a1a] bg-accent-start animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">AI Assistant</span>
          </div>
        )}

        <div className={cn(
          "prose prose-slate prose-sm max-w-none px-6 py-4 pb-2",
          isUser && "prose-h1:text-[#1a1a1a] prose-h2:text-[#1a1a1a] prose-h3:text-[#1a1a1a] prose-p:text-[#1a1a1a] prose-strong:text-[#1a1a1a]"
        )}>
          <ReactMarkdown
            children={message.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group my-4 rounded-xl overflow-hidden border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]">
                    <div className="bg-accent-cool px-4 py-2 border-b-2 border-[#1a1a1a] flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-[#1a1a1a]" />
                        <span className="text-[10px] font-black tracking-widest text-[#1a1a1a] uppercase">{match[1]}</span>
                      </div>
                    </div>
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: '1.25rem',
                        background: 'transparent',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                ) : (
                  <code className={cn("bg-slate-100 border border-slate-200 text-slate-800 rounded px-1.5 py-0.5 font-semibold", className)} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          />
        </div>

        {/* Source References Section */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="px-6 pb-6 pt-2">
            <div className="h-[2px] w-full bg-slate-100 mb-4" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FileCode className="h-3 w-3" />
              Source Context
            </h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, i) => (
                <div 
                  key={i}
                  className="group flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border-[1.5px] border-[#1a1a1a] rounded-lg px-3 py-2 transition-all cursor-pointer shadow-[1px_1px_0_#1a1a1a]"
                  title={source.snippet || source.code_snippet}
                >
                  <span className="text-xs font-bold text-[#1a1a1a] max-w-[150px] truncate">
                    {(source.file || `Snippet-${i+1}`).split('/').pop()}
                  </span>
                  {source.line !== undefined && (
                    <span className="text-[10px] font-bold text-slate-500">L{source.line}</span>
                  )}
                  <ExternalLink className="h-3 w-3 text-[#1a1a1a] opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
