import React, { useState, useEffect } from "react";
import { Sparkles, Users, Lightbulb, ArrowRight } from "lucide-react";
import FAQSection from "./FAQSection";
import SpiralAnimation from "./SpiralAnimation";

interface LandingPageProps {
  onGetStarted?: () => void;
  onExploreProjects?: () => void;
}

export default function LandingPage({
  onGetStarted,
  onExploreProjects,
}: LandingPageProps) {
  const [activeWord, setActiveWord] = useState(0);
  const words = ["Collaborate", "Create", "Build", "Innovate"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="min-h-screen text-foreground pt-40 relative overflow-x-hidden">
      {/* Shader Background */}
      <div className="fixed inset-0 -z-10">
        <SpiralAnimation />
      </div>

      {/* Overlay gradient for better text readability */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80 pointer-events-none"
        style={{ zIndex: 1 }}
      ></div>

      {/* Main Content */}
      <div
        className="relative flex flex-col min-h-screen pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in-up duration-700">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-primary/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in-up delay-200">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium">
                Built by students, for students
              </span>
            </div>

            {/* Main Headline with Rotating Word */}
            <div className="space-y-4 animate-in fade-in-up delay-300">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">Your Next Big Project</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary/80 animate-in slide-in-from-left duration-700 delay-400">
                  Starts Here
                </span>
              </h1>

              {/* Rotating Keywords */}
              <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl text-muted-foreground animate-in fade-in-up delay-500">
                <span>Where you</span>
                <div className="relative inline-block w-40 h-10">
                  {words.map((word, idx) => (
                    <span
                      key={word}
                      className={`absolute inset-0 flex items-center justify-center font-semibold transition-all duration-500 ${
                        idx === activeWord
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={
                        idx === activeWord
                          ? { color: "hsl(var(--primary))" }
                          : {}
                      }
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in-up delay-600">
              ProjectStack is a platform where students and creators can share
              project ideas, find teammates, and bring innovative ideas to life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 animate-in fade-in-up delay-700">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 rounded-full font-semibold bg-primary text-primary-foreground transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105 cursor-pointer pointer-events-auto hover-lift"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreProjects}
                className="px-8 py-4 bg-card/80 hover:bg-card border-2 border-primary/30 hover:border-primary/50 rounded-full font-semibold transition-all duration-300 backdrop-blur-md cursor-pointer pointer-events-auto hover-lift text-foreground"
              >
                Explore Projects
              </button>
            </div>

            {/* Small Tagline */}
            <p className="text-sm text-muted-foreground/70 pt-8 animate-in fade-in-up delay-800">
              Free for all students. No limits on ideas.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 pointer-events-auto animate-in fade-in-up delay-1000">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift hover:border-primary/30">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Find Your Team
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with talented students who share your passion and
                  vision for creating amazing projects.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift hover:border-primary/30">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Share Ideas
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Post your project ideas and get feedback from a community of
                  innovative creators and builders.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift hover:border-primary/30">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Build Together
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Collaborate seamlessly and turn your innovative ideas into
                  reality with the right team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="pointer-events-auto">
          <FAQSection />
        </div>
      </div>
    </div>
  );
}
