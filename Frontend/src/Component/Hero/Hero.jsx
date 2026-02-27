import React from 'react'
import Model from '../../assets/Model.png'

const Hero = () => {
  return (
    <div className='relative h-112.5 md:h-150 bg-[#f5f1ea] overflow-hidden flex items-center justify-center'>

      {/* BIG BG TEXT */}
      <h1 className='absolute left-1/2 -translate-x-1/2 -translate-y-1/3
                     text-[70px] sm:text-[110px] md:text-[160px] lg:text-[210px]
                     font-extrabold text-black/90 whitespace-nowrap
                     select-none pointer-events-none
                     scale-y-110 md:scale-y-125 scale-x-95 md:scale-x-90'>
        PURE COMFORT
      </h1>

     <img
        src={Model}
        alt="Model"
        className="
            absolute bottom-0 left-[75%] -translate-x-1/2
            w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]
            h-auto object-contain z-20
        "
        />

      {/* PARAGRAPH */}
      <h3 className='absolute left-6 bottom-10 md:left-12 md:bottom-16
                     max-w-50 md:max-w-xs text-sm md:text-base
                     text-gray-800 z-10'>
        Designed for everyday movement. Soft fabrics, relaxed fits, and effortless comfort.
      </h3>

    </div>
  )
}

export default Hero
