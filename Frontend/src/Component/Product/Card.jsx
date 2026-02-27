import React, { useState } from 'react'

const Card = ({product}) => {
  if(!product) return null;
  return (
    <div className='h-105 w-65 bg-white rounded-xl shrink-0 flex flex-col overflow-hidden'>
      <div className='justify-between flex p-4 text-black font-bold'>
        <div>
            {product.name}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
      </div>
      <img src={product.imageUrl} alt={product.name} className=' w-full object-cover flex-1' />
    </div>
  )
}

export default Card
