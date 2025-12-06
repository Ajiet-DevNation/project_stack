"use client";

import React, { useState, useEffect, useMemo } from 'react';

type AnimatedSquareStyle = React.CSSProperties & {
  "--delay": string;
  "--speed": number;
  "--play-state": "paused" | "running";
};

export const Component = () => {
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [squareCount, setSquareCount] = useState(12);
  const [speed, setSpeed] = useState(0.35);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    
    // Inject animation styles
    const styleId = 'nested-squares-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes magic {
          0% {
            transform: scale(0) rotate(0deg);
            filter: blur(0px);
          }
          50% {
            transform: scale(1) rotate(90deg);
            filter: blur(0.5px);
          }
          100% {
            transform: scale(2) rotate(180deg);
            filter: blur(1px);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }

        .nested-square {
          animation: magic calc(2s / var(--speed, 1)) ease infinite alternate;
          animation-delay: var(--delay);
          animation-play-state: var(--play-state, running);
          transform-origin: center;
          will-change: transform;
        }

        /* Smooth transitions for controls */
        .control-panel {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom range slider styling */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.1);
          height: 4px;
          border-radius: 2px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: white;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          margin-top: -6px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .control-panel {
            flex-direction: column !important;
            width: calc(100vw - 2rem) !important;
            max-width: 320px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      clearTimeout(timer);
      const style = document.getElementById(styleId);
      if (style && document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const squares = useMemo(() => {
    return Array.from({ length: squareCount }, (_, i) => {
      const index = i + 1;
      const hue = (index * 360 / squareCount) % 360;
      return {
        id: index,
        padding: index * 10,
        offset: index * -10,
        color: `hsl(${260 + hue / 3}, 80%, 60%)`, // Purple to blue gradient
        delay: i * 0.1,
      };
    });
  }, [squareCount]);

  const [backgroundElements] = useState(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: `bg-${i}`,
      style: {
        position: 'absolute' as const,
        width: '2px',
        height: '2px',
        backgroundColor: '#a855f7',
        borderRadius: '50%',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `glow ${3 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 3}s`,
      },
    }));
  });

  if (!mounted) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          border: '4px solid transparent',
          borderTopColor: '#a855f7',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(ellipse at center, #0a0014 0%, #000000 100%)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated background elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {backgroundElements.map(el => (
          <div
            key={el.id}
            style={el.style}
          />
        ))}
      </div>

      {/* Main animation */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}>
        <div style={{ position: 'relative' }}>
          {squares.map((square) => {
            const squareStyle: AnimatedSquareStyle = {
              position: 'absolute',
              boxSizing: 'content-box',
              padding: `${square.padding}px`,
              top: `${square.offset}px`,
              left: `${square.offset}px`,
              border: `1px solid ${square.color}`,
              boxShadow: `0 0 3px ${square.color}, inset 0 0 3px rgba(255, 255, 255, 0.1)`,
              borderRadius: '2px',
              '--delay': `${square.delay}s`,
              '--speed': speed,
              '--play-state': isPaused ? 'paused' : 'running',
            };
            return (
              <div
                key={square.id}
                className="nested-square"
                style={squareStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 0 10px #ffffff, inset 0 0 5px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = square.color;
                  e.currentTarget.style.boxShadow = `0 0 3px ${square.color}, inset 0 0 3px rgba(255, 255, 255, 0.1)`;
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div 
        className="control-panel"
        style={{
          position: 'fixed',
          bottom: showControls ? '32px' : '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 24px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <button
          onClick={() => setIsPaused(!isPaused)}
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isPaused ? '▶' : '⏸'} {isPaused ? 'Play' : 'Pause'}
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
            Speed
          </label>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: '100px', height: '4px' }}
          />
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '13px', 
            fontFamily: 'monospace',
            minWidth: '35px'
          }}>
            {speed}x
          </span>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
            Squares
          </label>
          <input
            type="range"
            min="5"
            max="40"
            value={squareCount}
            onChange={(e) => setSquareCount(Number(e.target.value))}
            style={{ width: '100px', height: '4px' }}
          />
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '13px', 
            fontFamily: 'monospace',
            minWidth: '25px'
          }}>
            {squareCount}
          </span>
        </div>
      </div>

      {/* Toggle controls button */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {showControls ? '✕' : '☰'}
      </button>

      {/* Title */}
      <div style={{
        position: 'fixed',
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: 'monospace',
      }}>
        Nested Squares
      </div>
    </div>
  );
};