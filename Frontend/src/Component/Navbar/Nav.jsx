import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, Menu, Moon, ShoppingCart, Sun, User, X } from 'lucide-react';
import useAuth from '../../context/useAuth';

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const savedTheme = window.localStorage.getItem('limeStreetTheme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const { scrollYProgress } = useScroll();
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 12) {
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    window.localStorage.setItem('limeStreetTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/arrivel', name: 'New Arrival' },
    { path: '/sale', name: 'Sale' },
    ...(isAdmin ? [{ path: '/admin', name: 'Admin' }] : [])
  ];

  const navWrapperClass = isDarkMode
    ? scrolled
      ? 'bg-black/95 backdrop-blur-md shadow-lg'
      : 'bg-black shadow-sm'
    : scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-black/10'
      : 'bg-white shadow-sm border-b border-black/10';

  const iconClass = isDarkMode
    ? 'text-white rounded-full bg-white/10 hover:bg-white/20'
    : 'text-black rounded-full bg-black/5 hover:bg-black/10';

  const linkActiveClass = isDarkMode ? 'text-white font-semibold' : 'text-black font-semibold';
  const linkInactiveClass = isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black';
  const logoPrimaryClass = isDarkMode
    ? 'bg-gradient-to-r from-white to-gray-400'
    : 'bg-gradient-to-r from-black to-gray-500';
  const logoSecondaryClass = isDarkMode ? 'text-white' : 'text-black';
  const dotClass = isDarkMode ? 'bg-white' : 'bg-black';
  const mobileMenuClass = isDarkMode
    ? 'overflow-hidden md:hidden bg-black/95 backdrop-blur-md border-t border-white/10'
    : 'overflow-hidden md:hidden bg-white/95 backdrop-blur-md border-t border-black/10';

  const navbarClass = isDarkMode
    ? scrolled
      ? 'bg-black/95 backdrop-blur-md shadow-lg'
      : 'bg-black shadow-sm'
    : scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-black/5'
      : 'bg-white shadow-sm border-b border-black/5';

  const iconButtonClass = isDarkMode
    ? 'bg-white/10 text-white hover:bg-white/20'
    : 'bg-black/5 text-black hover:bg-black/10';

  const inactiveLinkClass = isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black';
  const activeLinkClass = isDarkMode ? 'text-white font-semibold' : 'text-black font-semibold';
  const underlineClass = isDarkMode ? 'from-white to-gray-400' : 'from-black to-gray-500';
  const mobileMenuClass = isDarkMode
    ? 'bg-black/95 border-white/10'
    : 'bg-white/95 border-black/10';
  const mobileActiveClass = isDarkMode
    ? 'text-white font-semibold border-l-4 border-white pl-3'
    : 'text-black font-semibold border-l-4 border-black pl-3';
  const mobileInactiveClass = isDarkMode
    ? 'text-gray-400 hover:text-white hover:pl-3'
    : 'text-gray-600 hover:text-black hover:pl-3';

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-xl shadow-lg'
          : 'bg-black/92'
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
              <span className="text-2xl md:text-3xl font-bold tracking-tight bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
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
                  className={`absolute left-0 bottom-0 h-0.5 bg-linear-to-r from-white to-gray-400 transition-all duration-300 ${
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
          <div className="hidden items-center gap-3 md:flex md:gap-5">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
            <Link to='/cart' className="group">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center text-white justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                <ShoppingCart className="transition-transform duration-300 group-hover:scale-110" size={20} />
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
            <Link to='/wishlist' className="group">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                <Heart className="transition-transform duration-300 group-hover:scale-110" size={20} />
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to='/profile' className="group">
              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                <User className="transition-transform duration-300 group-hover:scale-110" size={20} />
              </div>
            </Link>
          </motion.div>
          </div>

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

      <div className="pointer-events-none absolute right-20 top-3 z-10 hidden sm:flex lg:right-24">
        <div className="pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 md:px-4 md:text-sm"
          >
            {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </motion.button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-14 top-3 z-10 sm:hidden">
        <div className="pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
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

      {/* SCROLL PROGRESS BAR - NAVBAR KE BOTTOM MEIN */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-white/70"
        style={{ width: progressBarWidth }}
      />
      
    </motion.div>
  );
};

export default Nav;
