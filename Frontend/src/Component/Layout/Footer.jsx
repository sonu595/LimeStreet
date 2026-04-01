import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="border-t border-white/10 bg-zinc-950/95">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">LimeStreet</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Streetwear store built for fast mobile shopping.</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
          A complete shopping flow with variant pricing, smooth checkout, order tracking, and a clean mobile experience.
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Explore</p>
        <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-300">
          <Link to="/" className="transition hover:text-white">Home</Link>
          <Link to="/arrivel" className="transition hover:text-white">New Arrival</Link>
          <Link to="/sale" className="transition hover:text-white">Sale</Link>
          <Link to="/orders" className="transition hover:text-white">Order History</Link>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Support</p>
        <div className="mt-4 space-y-3 text-sm text-zinc-300">
          <p>Delivery updates stay visible inside your orders page.</p>
          <p>Profile and checkout both support address management.</p>
          <p className="text-zinc-500">Made for desktop and mobile shoppers.</p>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
