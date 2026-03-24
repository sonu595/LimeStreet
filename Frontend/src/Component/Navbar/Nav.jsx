import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, Menu, ShoppingCart, User, X } from 'lucide-react';
import useAuth from '../../context/useAuth';
import { useStore } from '../../context/StoreContext';

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { cartCount, wishlistCount } = useStore();
  
  const { scrollYProgress } = useScroll();
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/arrivel', name: 'New Arrival' },
    { path: '/sale', name: 'Sale' },
    ...(isAdmin ? [{ path: '/admin', name: 'Admin' }] : [])
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-black shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-10">
        
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <Link to='/'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-1"
            >
              <span className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                LIME
              </span>
              <span className="text-2xl md:text-3xl font-light tracking-tight text-white">
                STREET
              </span>
              <span className="w-1 h-1 bg-white rounded-full ml-1"></span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex text-lg gap-8">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                to={link.path}
                className={`relative group py-2 transition-colors duration-300 ${
                  activeLink === link.path 
                    ? 'text-white font-semibold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
                <motion.span
                  className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-white to-gray-400 transition-all duration-300 ${
                    activeLink === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  layoutId="underline"
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
            <Link to='/cart' className="group">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center text-white justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                <ShoppingCart className="transition-transform duration-300 group-hover:scale-110" size={20} />
              </div>
            </Link>
            {cartCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {cartCount}
              </motion.span>
            )}
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
            <Link to='/wishlist' className="group">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                <Heart className="transition-transform duration-300 group-hover:scale-110" size={20} />
              </div>
            </Link>
            {wishlistCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-white text-black text-[10px] rounded-full flex items-center justify-center">
                {wishlistCount}
              </motion.span>
            )}
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to='/profile' className="group">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                <User className="transition-transform duration-300 group-hover:scale-110" size={20} />
              </div>
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-3xl ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
            <motion.span className="hidden" animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }}>
              ☰
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden bg-black/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              {navLinks.map((link, index) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <Link to={link.path} onClick={() => setOpen(false)} className={`block py-2 text-lg transition-all duration-300 ${
                    activeLink === link.path ? 'text-white font-semibold border-l-4 border-white pl-3' : 'text-gray-400 hover:text-white hover:pl-3'
                  }`}>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ SCROLL PROGRESS BAR - NAVBAR KE BOTTOM MEIN */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-white via-gray-400 to-white"
        style={{ 
          width: progressBarWidth,
          boxShadow: '0 0 8px rgba(255,255,255,0.5)'
        }}
      />
      
      {/* Optional: Glow Effect */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-white/20 blur-sm"
        style={{ width: progressBarWidth }}
      />
      
    </motion.div>
  );
};

export default Nav;
