import React from 'react'
import { motion } from 'framer-motion'

const Line = () => {
  const items = ['MOVE COMFORTABLE', 'LIVE FREELY', 'FEEL CONFIDENT']
  
  return (
    <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-light tracking-wider'>
      {items.map((item, index) => (
        <React.Fragment key={item}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className='text-gray-400 hover:text-white transition-colors duration-300 cursor-default'
          >
            {item}
          </motion.span>
          {index < items.length - 1 && (
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.2 + 0.1 }}
              className='w-8 sm:w-12 h-px bg-linear-to-r from-gray-600 to-gray-400'
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Line