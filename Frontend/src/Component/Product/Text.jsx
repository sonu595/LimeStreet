import React from 'react'
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';

const Text = ({ scrollLeft, scrollRight }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full px-4 md:px-8 py-8 md:py-12">
      
      <div className="flex-1 mb-6 lg:mb-0">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-light"
        >
          Carefully curated best sellers designed for comfort, confidence, and everyday elegance.
        </motion.p>
      </div>

      <div className="flex-1 mb-6 lg:mb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full mb-4">
            <span className="text-amber-400 text-xs font-semibold tracking-wider">
              HOT PICKS
            </span>
          </div>
          <h1 className='text-3xl md:text-4xl lg:text-5xl text-white font-light tracking-tight leading-tight'>
            EVERYDAY STYLES
            <br />
            <span className='font-bold'>WOMEN LOVE</span>
          </h1>
        </motion.div>
      </div>

      <div className="flex-1 flex justify-end items-end gap-3">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollLeft} 
          className="w-10 h-10 md:w-12 md:h-12 border border-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="group-hover:scale-110 transition" />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollRight} 
          className="w-10 h-10 md:w-12 md:h-12 border border-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all duration-300 group"
        >
          <ArrowRight size={18} className="group-hover:scale-110 transition" />
        </motion.div>
      </div>

    </div>
  )
}

export default Text