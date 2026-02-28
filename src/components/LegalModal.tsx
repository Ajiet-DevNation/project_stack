"use client";

import { X } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function LegalModal({ isOpen, onClose, title, children }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none" role="dialog" aria-modal="true">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative z-[10000] bg-background border border-border/20 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border/10 flex-shrink-0">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-full hover:bg-muted/50 transition-colors duration-200 ml-4 cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
