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
          ? "bg-accent-end/10 border border-accent-end/20 text-white rounded-tr-none px-6 py-4" 
          : "glass-card border-white/10 text-slate-100 rounded-tl-none"
      )}>
        {!isUser && (
          <div className="bg-white/[0.03] px-6 py-2 border-b border-white/5 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent-start animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Assistant</span>
          </div>
        )}

        <div className={cn(
          "prose prose-invert prose-sm max-w-none",
          !isUser ? "px-6 py-4 pb-2" : ""
        )}>
          <ReactMarkdown
            children={message.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group my-4 rounded-lg overflow-hidden border border-white/10">
                    <div className="bg-[#1e1e1e]/50 px-4 py-2 border-b border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3 w-3 text-slate-500" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{match[1]}</span>
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
                  <code className={cn("bg-white/10 rounded px-1.5 py-0.5", className)} {...props}>
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
            <div className="h-[1px] w-full bg-white/5 mb-4" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FileCode className="h-3 w-3" />
              Source Context
            </h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, i) => (
                <div 
                  key={i}
                  className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-all cursor-pointer"
                  title={source.snippet || source.code_snippet}
                >
                  <span className="text-xs font-mono text-accent-end max-w-[150px] truncate">
                    {(source.file || `Snippet-${i+1}`).split('/').pop()}
                  </span>
                  {source.line !== undefined && (
                    <span className="text-[10px] text-slate-500 font-mono">L{source.line}</span>
                  )}
                  <ExternalLink className="h-3 w-3 text-slate-600 group-hover:text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
