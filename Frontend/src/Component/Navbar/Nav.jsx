import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/LimeStreet.jpeg'

const Nav = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 bg-white z-50 shadow-sm">

      <div className="flex items-center justify-between px-4 py-3 md:px-10">

        <img className="h-10 md:h-14" src={logo} alt="logo" />

        <div className="hidden md:flex text-lg gap-8">
          <Link to="/" className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">Home</Link>
          <Link to="/arrivel" className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">New Arrivel</Link>
          <Link to="/sale" className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">Sale</Link>
        </div>
        <div className="flex items-center gap-3 md:gap-5">

          <div className="flex items-center gap-2 cursor-pointer">
            <Link to='/cart' className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
            </Link>
            <span className="hidden md:block">Cart</span>
          </div>

          <Link to='/wishlist' className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
            </svg>
          </Link>

          <Link to='/profile' className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5"/>
              <path d="M20 21a8 8 0 0 0-16 0"/>
            </svg>
          </Link>
          <button
            className="md:hidden text-3xl ml-2"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-4 px-6 pb-5 text-lg md:hidden bg-white shadow-md">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/arrivel" onClick={() => setOpen(false)}>New Arrivel</Link>
          <Link to="/sale" onClick={() => setOpen(false)}>Sale</Link>
        </div>
      )}

    </div>
  )
}

export default Nav
