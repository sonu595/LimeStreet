import React from 'react'
import Model from '../../assets/6bf21a6276e546338a440aba71094c73-removebg-preview.png'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <div className='relative flex min-h-[30rem] items-end justify-center overflow-hidden bg-black px-4 pt-6 pb-24 sm:h-152 sm:min-h-0 sm:items-center sm:px-0 sm:pt-0 sm:pb-0 md:h-150 lg:h-175'>
      
      {/* Premium Gradient Background */}
      <div className='absolute inset-0 bg-linear-to-b from-black via-zinc-900 to-black'></div>
      
      {/* Grain Texture */}
      <div className='absolute inset-0 opacity-20 bg-[url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="0.4"/%3E%3C/svg%3E")]'></div>

      {/* BIG BG TEXT */}
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className='absolute left-1/2 top-[69%] z-0 -translate-x-1/2 -translate-y-1/2
                       text-[48px] sm:text-[88px] md:text-[150px] lg:text-[220px] xl:text-[260px]
                       font-extrabold text-white/6 whitespace-nowrap
                       select-none pointer-events-none
                       scale-y-110 md:scale-y-120 scale-x-95 md:scale-x-90
                       tracking-tighter'
      >
        PURE COMFORT
      </motion.h1>

      {/* Model Image */}
      <motion.img
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        src={Model}
        alt="Model"
        className="
          absolute bottom-14 left-[58%] z-20 h-[64%] w-auto max-w-[84vw] -translate-x-1/2
          sm:bottom-0 sm:left-[55%] sm:h-[72%] sm:max-w-none
          md:left-auto md:right-[4%] md:h-[90%] md:translate-x-0
          lg:right-[7%] lg:h-[96%]
          xl:right-[9%]
          object-contain
          drop-shadow-2xl
        "
      />

      {/* Paragraph with Premium Style */}
      <motion.h3 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='absolute left-4 bottom-19 z-30 max-w-44 border-l-2 border-white/30 bg-black/35 pl-3 pr-2 py-2
                       text-[11px] leading-relaxed font-light text-gray-300 backdrop-blur-[2px]
                       sm:left-6 sm:bottom-8 sm:max-w-52 sm:pl-4 sm:text-sm
                       md:left-8 md:bottom-12 md:max-w-xs md:bg-transparent md:px-0 md:py-0 md:text-base md:backdrop-blur-0
                       lg:left-12 lg:bottom-16
                      '
      >
        Designed for everyday movement. Soft fabrics, relaxed fits, and effortless comfort.
      </motion.h3>

      {/* Optional: Decorative Element */}
      <div className='absolute right-4 bottom-[4.5rem] z-10 hidden sm:block sm:right-6 sm:bottom-10 md:right-8 md:bottom-12 lg:right-12 lg:bottom-16'>
        <div className='flex items-center gap-2 text-white/40 text-[10px] sm:text-xs tracking-wider'>
          <span>SS26 COLLECTION</span>
          <div className='w-8 sm:w-12 h-px bg-white/30'></div>
        </div>
      </div>
    </div>
  )
}

export default Hero
