'use client';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex justify-center p-4">
      {/* Card Container */}
      <div className="w-full max-w-4xl border border-[#197686] rounded-lg shadow-lg">
        {/* Navbar */}
        <nav className="w-full p-4 flex justify-between items-center">
          <div className="text-white font-bold text-xl">ticz</div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 text-white">
            <a href="#" className="hover:text-gray-400 transition">Events</a>
            <a href="#" className="hover:text-gray-400 transition">My Tickets</a>
            <a href="#" className="hover:text-gray-400 transition">About Project</a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
          
          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="absolute top-0 left-0 w-2/3 h-full bg-[#12232f] p-6 flex flex-col space-y-4 shadow-md md:hidden"
            >
              <a href="#" className="text-white text-lg" onClick={() => setIsOpen(false)}>Events</a>
              <a href="#" className="text-white text-lg" onClick={() => setIsOpen(false)}>My Tickets</a>
              <a href="#" className="text-white text-lg" onClick={() => setIsOpen(false)}>About Project</a>
            </motion.div>
          )}
          
          <Button className="hidden md:block bg-black text-white px-4 py-2 rounded-lg shadow-md">MY TICKETS →</Button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;