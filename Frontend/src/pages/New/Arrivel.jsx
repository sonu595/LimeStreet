import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FolderOpen } from 'lucide-react'
import Card from '../../Component/Product/Card'
import { buildApiUrl } from '../../utils/api'

const Arrivel = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(buildApiUrl('/products/new-arrivals'))
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-black px-4 py-14 pb-24 md:px-8 md:pb-14 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-white/10 pb-12">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-gray-500">Collection</p>
          <h1 className="mt-4 text-center text-5xl font-semibold text-white md:text-7xl">
            NEW ARRIVAL
          </h1>
        </div>

        <div className="py-12">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
            </div>
          ) : (
            products.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
                {products.map((item) => (
                  <Card key={item.id} product={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-gray-400">
                New arrival products abhi available nahi hain.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Arrivel
