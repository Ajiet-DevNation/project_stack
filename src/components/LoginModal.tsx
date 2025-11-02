"use client";
import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="min-w-[800px] h-[600px] p-0 flex items-center justify-center rounded-xl border border-border">
        <div className="flex h-full w-full">
          <div className="relative bg-[#834c57] h-full w-1/2 hidden md:flex items-center justify-center py-8 rounded-l-xl overflow-hidden">
            <Image
              src="/teamwork.svg"
              alt="Teamwork Illustration"
              width={400}
              height={400}
              className="max-w-full max-h-full"
            />
          </div>

          <div className="p-8 flex flex-col justify-center bg-[#eddbc7] rounded-r-xl w-full md:w-1/2">
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-3xl font-bold text-gray-800 text-center">Access</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Button
                onClick={() => signIn('google', { callbackUrl: '/home' })}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <FaGoogle />
                Continue with Google
              </Button>
              <Button
                onClick={() => signIn('github', { callbackUrl: '/home' })}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <FaGithub />
                Continue with GitHub
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
