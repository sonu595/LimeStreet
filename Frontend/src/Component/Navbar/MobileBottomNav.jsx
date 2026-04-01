import React from 'react'
import { Heart, Package, ShoppingCart, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../context/useAuth'

const links = [
  { path: '/cart', label: 'Cart', icon: ShoppingCart },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/orders', label: 'Orders', icon: Package },
  { path: '/profile', label: 'Profile', icon: User }
]

const MobileBottomNav = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const visibleLinks = links.filter(({ path }) => isAuthenticated || (path !== '/cart' && path !== '/wishlist'))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 px-3 py-2 backdrop-blur-xl md:hidden">
      <div className={`grid gap-2 ${visibleLinks.length === 4 ? 'grid-cols-4' : 'grid-cols-2'}`}>
        {visibleLinks.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path

          return (
            <Link
              key={path}
              to={isAuthenticated ? path : '/login'}
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
