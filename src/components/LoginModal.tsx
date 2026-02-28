"use client";
import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={cn(
        "bg-card/95 backdrop-blur-xl border-0 shadow-2xl",
        "w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:max-w-5xl lg:max-w-6xl",
        "h-auto max-h-[calc(100vh-2rem)]",
        "overflow-hidden p-0",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500",
        "rounded-3xl"
      )} showCloseButton={true}>
        <div className="flex h-full w-full flex-col md:flex-row min-h-[500px] md:min-h-[600px]">
          <div className={cn(
            "relative bg-card border-r border-border/20",
            "h-[280px] md:h-full w-full md:w-[45%]",
            "flex items-center justify-center p-8 md:p-12",
            "rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none",
            "overflow-hidden",
            "animate-in slide-in-from-left-4 duration-700"
          )}>
            <div className="absolute top-16 left-8 w-32 h-32 bg-muted/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-16 right-8 w-40 h-40 bg-muted/15 rounded-full blur-2xl animate-pulse delay-1000" />
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="relative">
                <Image
                  src="/teamwork.svg"
                  alt="Teamwork Illustration"
                  width={280}
                  height={280}
                  className="max-w-full max-h-full opacity-90 drop-shadow-lg animate-in zoom-in-50 duration-700 delay-200"
                />
              </div>
              <div className="mt-8 space-y-3 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Welcome Back
                </h3>
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                  Connect, collaborate, and build amazing projects together
                </p>
                <div className="mt-6 flex justify-center gap-6 animate-in slide-in-from-bottom-2 duration-500 delay-400">
                  <div className="w-12 h-12 bg-muted/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="w-12 h-12 bg-muted/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="w-12 h-12 bg-muted/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "bg-background/98 backdrop-blur-xl",
            "p-10 sm:p-12 md:p-16 lg:p-20",
            "flex flex-col justify-center",
            "w-full md:w-[55%]",
            "rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none",
            "animate-in slide-in-from-right-4 duration-700 delay-200",
            "relative"
          )}>
            <div className="absolute inset-0 bg-muted/10" />
            
            <div className="relative z-10">
              <DialogHeader className="mb-12 animate-in slide-in-from-top-2 duration-500 delay-400">
                <div className="text-center space-y-4">
                  <DialogTitle className="text-2xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
                    Sign In
                  </DialogTitle>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">
                    Choose your preferred method to continue to ProjectStack
                  </p>
                  
                </div>
              </DialogHeader>
              
              <div className="space-y-4 w-full max-w-sm mx-auto">
                <Button
                  onClick={() => signIn('google', { callbackUrl: '/home' })}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full cursor-pointer group",
                    "rounded-xl border-2 border-border",
                    "bg-card hover:bg-accent",
                    "h-14 text-base font-medium",
                    "text-foreground",
                    "shadow-sm hover:shadow-md",
                    "transition-all duration-300 ease-out",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "animate-in slide-in-from-bottom-2 duration-500 delay-500"
                  )}
                >
                  <div className="flex items-center justify-center gap-3">
                    <FaGoogle className="w-5 h-5 text-red-500 transition-colors" />
                    <span>Continue with Google</span>
                  </div>
                </Button>
                
                <Button
                  onClick={() => signIn('github', { callbackUrl: '/home' })}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full cursor-pointer group",
                    "rounded-xl border-2 border-border",
                    "bg-card hover:bg-accent",
                    "h-14 text-base font-medium",
                    "text-foreground",
                    "shadow-sm hover:shadow-md",
                    "transition-all duration-300 ease-out",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "animate-in slide-in-from-bottom-2 duration-500 delay-600"
                  )}
                >
                  <div className="flex items-center justify-center gap-3">
                    <FaGithub className="w-5 h-5 transition-colors" />
                    <span>Continue with GitHub</span>
                  </div>
                </Button>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <div className="w-2 h-2 bg-amber-800 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-green-800 rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-blue-800 rounded-full animate-pulse delay-200" />
              </div>

              <div className={cn(
                "mt-12 text-center space-y-2",
                "animate-in fade-in duration-500 delay-700"
              )}>
                <div className="text-xs text-muted-foreground/60 leading-relaxed max-w-xs mx-auto">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2">
                    Privacy Policy
                  </a>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}