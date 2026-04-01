import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import videoBg from '../../assets/LimeStreet2.mp4';

const LimeStreetLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [brandReveal, setBrandReveal] = useState(false);

  useEffect(() => {
    // Preload video with timeout
    const video = document.createElement('video');
    video.src = videoBg;
    
    let isMounted = true;
    
    const handleVideoLoad = () => {
      if (isMounted) {
        setVideoLoaded(true);
      }
    };
    
    video.addEventListener('loadeddata', handleVideoLoad);
    
    // Fallback timeout - agar video load nahi hoti to bhi proceed karein
    const videoTimeout = setTimeout(() => {
      if (isMounted && !videoLoaded) {
        console.log('Video load timeout, proceeding anyway');
        setVideoLoaded(true);
      }
    }, 8000); // 8 seconds timeout for video

    // Animated progress - slower for longer duration
    const interval = setInterval(() => {
      if (isMounted) {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Slower increment: 4-8% per interval
          return prev + (Math.random() * 4 + 4);
        });
      }
    }, 200); // Increased interval time

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(videoTimeout);
      video.removeEventListener('loadeddata', handleVideoLoad);
    };
  }, []);

  useEffect(() => {
    // Increased timeout for brand reveal and completion
    if (videoLoaded && progress >= 100) {
      setBrandReveal(true);
      // Increased timeout from 1000ms to 2500ms for better experience
      setTimeout(() => {
        onLoadingComplete();
      }, 2500);
    }
  }, [videoLoaded, progress, onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 bg-linear-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Content - Fully Responsive */}
      <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-[90%] sm:max-w-[80%] md:max-w-none mx-auto">
        
        {/* Animated Logo - Responsive */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8 md:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] sm:tracking-[0.2em]">
            <span className="font-bold">Lime</span>
            <span className="font-thin">Street</span>
          </h1>
        </motion.div>

        {/* Progress Bar - Responsive Width */}
        <div className="w-50 sm:w-64 md:w-80 lg:w-96 mx-auto">
          <div className="relative h-px bg-white/20 overflow-hidden rounded-full">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Percentage - Responsive Text */}
          <div className="flex justify-between mt-3 sm:mt-4 text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-white/40">
            <span className="uppercase">INITIALIZING</span>
            <span className="font-mono">{Math.floor(Math.min(progress, 100))}%</span>
          </div>
        </div>

        {/* Loading Dots - Responsive */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -6, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/60 rounded-full"
            />
          ))}
        </div>

        {/* Brand Reveal Message - Responsive */}
        <AnimatePresence>
          {brandReveal && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 sm:mt-8 text-[9px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] text-white/50 uppercase px-4"
            >
              EXPERIENCE THE PREMIUM STREETWEAR
            </motion.p>
          )}
        </AnimatePresence>

        {/* Optional: Loading Tip - Shows on mobile too */}
        {progress > 30 && progress < 90 && !brandReveal && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="mt-6 sm:mt-8 text-[8px] sm:text-[10px] text-white/30"
          >
            PREMIUM QUALITY • LIMITED EDITIONS
          </motion.p>
        )}
      </div>

      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(-4%, 2%); }
          30% { transform: translate(2%, -4%); }
          40% { transform: translate(-2%, 6%); }
          50% { transform: translate(-4%, 2%); }
          60% { transform: translate(6%, 0); }
          70% { transform: translate(0, 4%); }
          80% { transform: translate(-6%, 0); }
          90% { transform: translate(4%, 2%); }
        }
        
        @media (max-width: 640px) {
          .animate-grain {
            animation: grain 6s steps(8) infinite;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default LimeStreetLoader;
