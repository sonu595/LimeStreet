import React, { useEffect, useRef } from 'react';
import videoBg from '../../assets/LimeStreet2.mp4';

const V = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9; // Slightly slower for more elegance
    }
  }, []);

  useEffect(() => {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return (
    <div className='relative min-h-screen w-full overflow-hidden font-sans'>
      
      {/* Background Video with Parallax Scale */}
      <div className='absolute top-0 left-0 w-full h-full scale-110'>
        <video
          ref={videoRef}
          className='absolute top-0 left-0 w-full h-full object-cover'
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Sophisticated Gradient Overlay */}
      <div className='absolute top-0 left-0 w-full h-full bg-linear-to-br from-black/70 via-black/50 to-black/80'></div>
      
      {/* Subtle Vignette Effect */}
      <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_30%,black_100%)] opacity-60'></div>

      {/* Content */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center px-6'>
        
        {/* Minimalist Brand Mark */}
        <div className='mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]'>
          <div className='w-12 h-px bg-white/40 mx-auto mb-6'></div>
          <p className='text-xs tracking-[0.3em] uppercase text-white/60 font-light'>
            Established 2026
          </p>
        </div>
        
        {/* Main Brand Name with Elegant Typography */}
        <h1 className='font-light tracking-[0.2em] text-5xl md:text-8xl lg:text-9xl uppercase opacity-0 animate-[fadeInUp_0.8s_ease-out_0.1s_forwards]'>
          <span className='font-bold tracking-wider'>Lime</span>
          <span className='font-thin'>Street</span>
        </h1>

        {/* Sophisticated Tagline */}
        <p className='mt-8 text-sm md:text-base uppercase tracking-[0.25em] text-white/70 font-light opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]'>
          Artisanal Streetwear • Limited Editions
        </p>

        {/* Elegant Divider with Center Accent */}
        <div className='mt-12 flex items-center justify-center gap-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]'>
          <div className='w-16 h-px bg-white/30'></div>
          <div className='w-1.5 h-1.5 rounded-full bg-white/50'></div>
          <div className='w-16 h-px bg-white/30'></div>
        </div>

        {/* Refined Button with Hover Animation */}
        <button className='group mt-12 relative px-10 py-4 overflow-hidden opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]'>
          {/* Button Background Animation */}
          <div className='absolute inset-0 bg-white/10 backdrop-blur-sm transition-all duration-500 group-hover:scale-110'></div>
          
          {/* Border Animation */}
          <div className='absolute inset-0 border border-white/30 group-hover:border-white/70 transition-all duration-500'></div>
          
          {/* Button Content */}
          <span className='relative z-10 text-xs tracking-[0.2em] uppercase font-light group-hover:tracking-[0.3em] transition-all duration-500'>
            Discover Collection
          </span>
        </button>

        {/* Scroll Indicator */}
        <div className='absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]'>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-[10px] tracking-[0.2em] uppercase text-white/40 font-light'>
              Scroll
            </span>
            <div className='w-px h-12 bg-white/20 relative overflow-hidden'>
              <div className='absolute top-0 left-0 w-full h-full bg-white/60 animate-[scrollDown_2s_ease-in-out_infinite]'></div>
            </div>
          </div>
        </div>

      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scrollDown {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        @keyframes subtlePulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default V;
