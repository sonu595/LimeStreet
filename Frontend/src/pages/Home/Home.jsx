import React from 'react'
import Line from '../../Component/Hero/Line'
import Hero from '../../Component/Hero/Hero'
import Product from '../../Component/Product/Product'

const Home = () => {
  return (
    <>
      <div className='p-16'>
        <Line/>
      </div>
      <Hero/>
      <Product/>
      </>
  )
}

export default Home
