import React, { useEffect, useState } from 'react'
import Card from './Card'
import axios from 'axios'

const Section = ({ eyebrow, title, description, products }) => (
  <section className="mb-16">
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-gray-500">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">{description}</p>
      </div>
      <div className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-300">
        {products.length} products
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
      {products.length > 0 ? (
        products.map((item) => (
          <Card key={item.id} product={item} />
        ))
      ) : (
        <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-sm text-gray-400">
          No products available in this section yet.
        </div>
      )}
    </div>
  </section>
)

const Product = () => {
  const [newArrivals, setNewArrivals] = useState([])
  const [saleItems, setSaleItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/products/new-arrivals'),
      axios.get('http://localhost:8080/api/products/sale-items')
    ])
      .then(([arrivalsResponse, saleResponse]) => {
        setNewArrivals(arrivalsResponse.data)
        setSaleItems(saleResponse.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  
  return (
    <div className="relative bg-black px-4 py-16 md:px-8 md:py-20 lg:px-16">
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl">
          <Section
            eyebrow="New Arrival"
            title="Latest Drops For Everyday Streetwear"
            description="Fresh pieces that just landed. These are the newest additions arranged separately so the collection feels clean and easy to manage."
            products={newArrivals}
          />

          <Section
            eyebrow="Sale"
            title="Discounted Picks Worth Grabbing"
            description="Marked-down products are now separated from new arrivals so sale items stay focused, faster to browse, and easier to manage later from admin."
            products={saleItems}
          />
        </div>
      )}
    </div>
  )
}

export default Product
