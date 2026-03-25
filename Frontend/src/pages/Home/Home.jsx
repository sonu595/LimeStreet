import React from 'react'
import Line from '../../Component/Hero/Line'
import Hero from '../../Component/Hero/Hero'
import Product from '../../Component/Product/Product'
import V from '../../Component/Video/V'

const Home = () => {
  return (
    <div className="bg-black pb-24 md:pb-0">
      <V />
      <div className='bg-black px-4 py-4 md:px-8 md:py-12 lg:px-16'>
        <Line/>
      </div>
      <Hero/>
      <Product/>
    </div>
  )
}

export default Home
