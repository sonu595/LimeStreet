import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();
  
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
    { path: '/sale', name: 'Sale' }
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
                  <circle cx="8" cy="21" r="1"/>
                  <circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
              </div>
            </Link>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">0</motion.span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to='/wishlist' className="group">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
                  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to='/profile' className="group">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
                  <circle cx="12" cy="8" r="5"/>
                  <path d="M20 21a8 8 0 0 0-16 0"/>
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-3xl ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
            onClick={() => setOpen(!open)}
          >
            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }}>
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