import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card } from './Card';

export function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-white/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <Card className={cn("relative w-full max-w-lg p-0 overflow-hidden animate-in fade-in zoom-in duration-200", className)}>
        <div className="flex items-center justify-between p-6 border-b-2 border-[#1a1a1a] bg-[var(--color-bg-primary)]">
          <h3 className="text-xl font-bold text-[#1a1a1a]">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-[#1a1a1a] transition-colors bg-white rounded-full p-1 border-2 border-transparent hover:border-[#1a1a1a]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
}
