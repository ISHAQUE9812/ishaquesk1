'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useScrollSpy } from '@/lib/useScrollSpy';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
  { href: 'https://github.com/ISHAQUE9812', label: 'GitHub', external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy(navLinks.map(l => l.href.replace('#', '')));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-gold"
        >
          <Link href="/">MI</Link>
        </motion.div>

        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ href, label, external }) => {
            const isActive = activeSection === href.replace('#', '') && !external;
            return (
              <motion.li key={href} whileHover={{ scale: 1.1 }} className="relative">
                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-gold transition-colors"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    href={href}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-gold' : 'hover:text-gold'
                    }`}
                  >
                    {label}
                  </Link>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}