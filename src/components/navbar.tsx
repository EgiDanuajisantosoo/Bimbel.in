"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

const navLinks = [
  { href: '#Jadwal', label: 'Jadwal' },
  { href: '#Gallery', label: 'Gallery' },
  { href: '#Info', label: 'Info' },
  // { href: '#pendidikan', label: 'Pendidikan' },
  // { href: '#pengalaman-kerja', label: 'Pengalaman' },
  // { href: '#rincian-proyek', label: 'Proyek & Sertifikasi' },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState('#home');
  const [menuOpen, setMenuOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      let current = '#home';
      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (section) {
          const rect = (section as HTMLElement).getBoundingClientRect();
          if (rect.top <= 80) {
            current = link.href;
          }
        }
      }
      setActiveLink(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="bg-[#fff] text-gray-400 fixed w-full z-10 shadow-md">
  {/* 1. Ubah `items-end justify-end` menjadi `items-center justify-between` */}
  <div className="flex items-center justify-between container mx-auto p-4 relative h-22">
    
    <Image
      src="/assets/logo/logoBimbel.png"
      alt="Logo"
      width={150}
      height={30}
    />

    {/* Grupkan tombol dan menu untuk kontrol yang lebih baik di mobile */}
    <div className="flex items-center space-x-4 sm:space-x-8">
      <button
        className="sm:hidden text-gray-600 hover:text-black focus:outline-none z-30" // Tambah z-index
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>

      <ul
          className={`
            flex-col sm:flex-row sm:flex items-center space-y-4 sm:space-y-0 sm:space-x-8 ml-0 sm:ml-8
            ${menuOpen ? 'flex' : 'hidden sm:flex'}
            absolute sm:static left-0 sm:left-auto w-full sm:w-auto bg-[#2b2b2b] sm:bg-transparent z-20
            top-full sm:top-auto shadow-lg sm:shadow-none
            transition-all duration-300
          `}
        >
          {navLinks.map((link) => {
            const isActive = link.href === activeLink;
            return (
              <li key={link.href} className="w-full sm:w-auto text-center">
                <Link
                  href={link.href}
                  onClick={e => {
                    e.preventDefault();
                    setActiveLink(link.href);
                    setMenuOpen(false);
                    const el = document.querySelector(link.href);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`block py-2 sm:py-0 text-2xl sm:text-sm tracking-wider transition-colors duration-300 ${isActive
                    ? 'text-white sm:text-black sm:border-b-2 sm:border-black'
                    : 'text-gray-300 sm:text-gray-500 hover:text-white sm:hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
    </div>
  </div>
</nav>
  );
}
