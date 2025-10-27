'use client';

import { Lightbulb, Users } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  return (
    <nav 
      className="fixed bottom-7 left-0 right-0 z-[9999] pointer-events-auto"
    >
      <div className="max-w-4xl mx-auto px-6 py-4 bg-neutral-900/80 backdrop-blur-xl border-t border-white/10 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #A7727D, #EDDBC7)'}}>
              <span className="text-neutral-900 font-bold text-sm">PS</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">ProjectStack</span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <a href="#projects" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Projects</span>
            </a>
            <a href="#community" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </a>
            <button 
              className='hidden cursor-pointer z-20 sm:inline text-gray-300 hover:text-white transition-colors'
              onClick={() => signOut()}
            >
              Sign-out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}