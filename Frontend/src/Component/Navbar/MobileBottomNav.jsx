import React from 'react'
import { Heart, Package, ShoppingCart, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { path: '/cart', label: 'Cart', icon: ShoppingCart },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/orders', label: 'Orders', icon: Package },
  { path: '/profile', label: 'Profile', icon: User }
]

const MobileBottomNav = () => {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 px-3 py-2 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 gap-2">
        {links.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path

          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition ${
                active ? 'bg-white text-black' : 'text-zinc-400'
              }`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
