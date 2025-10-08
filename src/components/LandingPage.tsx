import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LandingPageProps {
  onGetStarted?: () => void;
  onExploreProjects?: () => void;
}

export default function LandingPage({ onGetStarted, onExploreProjects }: LandingPageProps) {
  const router = useRouter();
  const [activeWord, setActiveWord] = useState(0);
  const {data: session, status} = useSession();
  const words = ['Collaborate', 'Create', 'Build', 'Innovate'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(167, 114, 125, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(167, 114, 125, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Orbs - Using your color palette */}
      <div className="fixed top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse" style={{background: 'radial-gradient(circle, rgba(167, 114, 125, 0.2), transparent)'}}></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{background: 'radial-gradient(circle, rgba(237, 219, 199, 0.15), transparent)'}}></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen pb-24">
        
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" style={{color: '#EDDBC7'}} />
              <span className="text-sm text-gray-300">Built by students, for students</span>
            </div>

            {/* Main Headline with Rotating Word */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Your Next Big Project
                <br />
                <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(to right, #A7727D, #EDDBC7, #F8EAD8)'}}>
                  Starts Here
                </span>
              </h1>
              
              {/* Rotating Keywords */}
              <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl text-gray-400">
                <span>Where you</span>
                <div className="relative inline-block w-40 h-10">
                  {words.map((word, idx) => (
                    <span
                      key={word}
                      className={`absolute inset-0 flex items-center justify-center font-semibold transition-all duration-500 ${
                        idx === activeWord
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4'
                      }`}
                      style={idx === activeWord ? {color: '#EDDBC7'} : {}}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              ProjectStack is a platform where students and creators can share project ideas, 
              find teammates, and bring innovative ideas to life.
            </p>

            {/* CTA Buttons - Parent component will handle these */}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <button 
                onClick={
                  !session?.user
                    ? onGetStarted
                    : () => router.push('/dashboard')
                }
                  // triggers modal from Home
                className="group px-8 py-4 rounded-full font-semibold text-neutral-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105"
                style={{
                  background: 'linear-gradient(to right, #A7727D, #EDDBC7)',
                  boxShadow: '0 10px 40px rgba(167, 114, 125, 0.3)'
                }}
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={onExploreProjects}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                Explore Projects
              </button>
            </div>


            {/* Small Tagline */}
            <p className="text-sm text-gray-500 pt-8">
              Free for all students. No limits on ideas.
            </p>
          </div>
        </section>

      </div>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-7 left-0 right-0 z-50  ">
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
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}