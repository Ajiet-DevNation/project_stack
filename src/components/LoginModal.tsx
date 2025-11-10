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
        "bg-card border-0 shadow-2xl",
        "w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[900px] lg:w-[1000px]",
        "h-auto max-h-[calc(100vh-2rem)]",
        "overflow-hidden p-0",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300",
        "rounded-xl"
      )}>
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* Left Side - Illustration */}
          <div className={cn(
            "relative bg-gradient-to-br from-[#2a2522] via-[#393028] to-[#4a3d35]",
            "h-[200px] md:h-[600px] w-full md:w-[45%]",
            "flex items-center justify-center p-6 md:p-8",
            "rounded-t-xl md:rounded-l-xl md:rounded-tr-none",
            "overflow-hidden",
            "animate-in slide-in-from-left-4 duration-500"
          )}>
            {/* Decorative gradient orbs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-amber-900/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-900/15 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative z-10 flex flex-col items-center justify-center">
              <Image
                src="/teamwork.svg"
                alt="Teamwork Illustration"
                width={300}
                height={300}
                className="max-w-full max-h-full opacity-90 drop-shadow-2xl animate-in zoom-in-50 duration-700 delay-200"
              />
              <h3 className="mt-6 text-xl md:text-2xl font-bold text-amber-50/90 text-center animate-in slide-in-from-bottom-2 duration-500 delay-300">
                Welcome Back
              </h3>
              <p className="mt-2 text-sm text-amber-100/60 text-center max-w-[250px] animate-in slide-in-from-bottom-2 duration-500 delay-400">
                Join our community and collaborate on amazing projects
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={cn(
            "bg-background/95 backdrop-blur-sm",
            "p-6 sm:p-8 md:p-10",
            "flex flex-col justify-center",
            "w-full md:w-[55%]",
            "rounded-b-xl md:rounded-r-xl md:rounded-bl-none",
            "animate-in slide-in-from-right-4 duration-500 delay-150"
          )}>
            <DialogHeader className="mb-8 animate-in slide-in-from-top-2 duration-500 delay-300">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground text-center">
                Access
              </DialogTitle>
              <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
                Choose your preferred sign-in method
              </p>
            </DialogHeader>
            
            <div className="space-y-4 w-full">
              <Button
                onClick={() => signIn('google', { callbackUrl: '/home' })}
                variant="outline"
                size="lg"
                className={cn(
                  "w-full flex items-center justify-center gap-3",
                  "rounded-lg border-2 border-border/60",
                  "bg-card hover:bg-accent/80",
                  "h-14 text-base font-semibold",
                  "text-foreground",
                  "shadow-md hover:shadow-xl",
                  "transition-all duration-300 ease-out",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "hover:border-red-500/30",
                  "animate-in slide-in-from-bottom-2 duration-500 delay-400",
                  "group"
                )}
              >
                <FaGoogle className="w-5 h-5 text-red-500 transition-transform group-hover:scale-110 flex-shrink-0" />
                <span>Continue with Google</span>
              </Button>
              
              <Button
                onClick={() => signIn('github', { callbackUrl: '/home' })}
                variant="outline"
                size="lg"
                className={cn(
                  "w-full flex items-center justify-center gap-3",
                  "rounded-lg border-2 border-border/60",
                  "bg-card hover:bg-accent/80",
                  "h-14 text-base font-semibold",
                  "text-foreground",
                  "shadow-md hover:shadow-xl",
                  "transition-all duration-300 ease-out",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "hover:border-primary/40",
                  "animate-in slide-in-from-bottom-2 duration-500 delay-500",
                  "group"
                )}
              >
                <FaGithub className="w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
                <span>Continue with GitHub</span>
              </Button>
            </div>

            <div className={cn(
              "mt-10 text-center text-xs text-muted-foreground/60",
              "animate-in fade-in duration-500 delay-600",
              "leading-relaxed"
            )}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}