import React from 'react'
import Model from '../../assets/Model.png'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <div className='relative h-125 md:h-150 lg:h-175 bg-black overflow-hidden flex items-center justify-center'>
      
      {/* Premium Gradient Background */}
      <div className='absolute inset-0 bg-linear-to-b from-black via-zinc-900 to-black'></div>
      
      {/* Grain Texture */}
      <div className='absolute inset-0 opacity-20 bg-[url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="0.4"/%3E%3C/svg%3E")]'></div>

      {/* BIG BG TEXT */}
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className='absolute left-1/2 -translate-x-1/2 -translate-y-1/3
                       text-[50px] sm:text-[80px] md:text-[120px] lg:text-[180px]
                       font-extrabold text-white/5 whitespace-nowrap
                       select-none pointer-events-none
                       scale-y-110 md:scale-y-125 scale-x-95 md:scale-x-90
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
          absolute bottom-0 left-[75%] -translate-x-1/2
          w-[85%] sm:w-[75%] md:w-[65%] lg:w-[55%]
          h-auto object-contain z-20
          drop-shadow-2xl
        "
      />

      {/* Paragraph with Premium Style */}
      <motion.h3 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='absolute left-4 sm:left-6 md:left-8 lg:left-12 bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-16
                       max-w-45 sm:max-w-55 md:max-w-xs
                       text-xs sm:text-sm md:text-base
                       text-gray-300 z-10
                       leading-relaxed font-light
                       border-l-2 border-white/30 pl-3 sm:pl-4'
      >
        Designed for everyday movement. Soft fabrics, relaxed fits, and effortless comfort.
      </motion.h3>

      {/* Optional: Decorative Element */}
      <div className='absolute right-4 sm:right-6 md:right-8 lg:right-12 bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-16 z-10'>
        <div className='flex items-center gap-2 text-white/40 text-[10px] sm:text-xs tracking-wider'>
          <span>SS26 COLLECTION</span>
          <div className='w-8 sm:w-12 h-px bg-white/30'></div>
        </div>
      </div>
    </div>
  )
}

export default Hero