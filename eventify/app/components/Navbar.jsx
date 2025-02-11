'use client'
import { ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='flex flex-wrap items-center justify-between w-full px-4 sm:px-8 md:px-28 py-6'>
      {/* Logo */}
      <div className='text-blue-600 font-bold text-xl sm:text-[25px]'>
        Eventify
      </div>

      {/* Hamburger Menu Icon (Mobile Only) */}
      <div className='block sm:hidden' onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      {/* Navigation Links */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } w-full sm:w-auto sm:flex sm:flex-1 sm:justify-center sm:gap-10 mt-4 sm:mt-0`}
      >
        <Link href='/' className='block sm:inline-block py-2 sm:py-0 text-center hover:text-blue-500'>
          Events
        </Link>
        <Link href='/' className='block sm:inline-block py-2 sm:py-0 text-center hover:text-blue-500'>
          My Ticket
        </Link>
        <Link href='/' className='block sm:inline-block py-2 sm:py-0 text-center hover:text-blue-500'>
          About Project
        </Link>
      </div>

      {/* My Ticket Button */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } w-full sm:w-auto sm:block border flex flex-row p-3 gap-2 bg-blue-500 text-white rounded-xl cursor-pointer mt-4 sm:mt-0`}
      >
        <h1>My Ticket</h1>
        <ArrowRight size={20} />
      </div>
    </nav>
  );
};

export default Navbar;