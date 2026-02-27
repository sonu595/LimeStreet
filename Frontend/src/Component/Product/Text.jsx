import React from 'react'
import { ArrowLeft, ArrowRight } from "lucide-react";

const Text = ({scrollLeft, scrollRight }) => {
  return (
    <div className="flex w-full">

      <div className="flex-1 p-10">
        <p className="text-3xl text-white">
          Carefully curated best sellers designed for comfort, confidence, and everyday elegance lorem49
        </p>
      </div>

      <div className="flex-1 items-center justify-center p-10">
        <button className='text-black font-bold bg-amber-300 rounded'>
          HOT PICS
        </button>
        <h1 className='text-5xl text-white'>
          EVERYDAY STYLES WOMEN LOVE
        </h1>
      </div>

      <div className="flex-1 flex text-white justify-end items-end p-4 gap-4">
          <div onClick={scrollLeft} className="w-12 h-12 border border-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition">
            <ArrowLeft size={18} />
          </div>

          <div onClick={scrollRight} className="w-12 h-12 border border-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition">
            <ArrowRight size={18} />
          </div>
      </div>

    </div>
  )
}

export default Text
