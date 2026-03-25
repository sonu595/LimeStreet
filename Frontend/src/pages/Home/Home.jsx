import React from 'react'
import Line from '../../Component/Hero/Line'
import Hero from '../../Component/Hero/Hero'
import Product from '../../Component/Product/Product'
import V from '../../Component/Video/V'

const Home = () => {
  return (
    <div className="bg-black pb-24 md:pb-0">
      <V />
      <div className='px-4 md:px-8 lg:px-16 py-8 md:py-12 bg-black'>
        <Line/>
      </div>
      <Hero/>
      <Product/>
    </div>
  )
}

export default Home
