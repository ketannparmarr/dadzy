import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { TabOption } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: TabOption;
  setActiveTab: (tab: TabOption) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // DADZY Sticky Header - Zara / Balenciaga Style
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-subtle transition-colors duration-300">
      <div className="flex h-20 items-center justify-between px-6 md:px-12 relative">
        {/* Far Left: Hamburger Menu Trigger */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-black hover:opacity-70 transition-opacity focus:outline-none flex items-center space-x-2 cursor-pointer"
            id="nav-hamburger-btn"
          >
            <Menu size={20} strokeWidth={1.5} />
            <span className="hidden md:inline text-[9px] font-mono tracking-widest uppercase">MENU</span>
          </button>
        </div>

        {/* Absolute Center: Clean DADZY Text Logo */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
          onClick={() => {
            setActiveTab(TabOption.DROPS);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          id="nav-logo-btn"
        >
          <h1 className="font-serif font-semibold text-2xl md:text-3xl tracking-[0.3em] uppercase leading-none text-black hover:opacity-85 transition-opacity">
            DADZY
          </h1>
        </div>

        {/* Far Right: Minimalist Shopping Bag */}
        <div className="flex items-center">
          <button
            onClick={onOpenCart}
            className="text-black hover:opacity-70 transition-opacity focus:outline-none flex items-center space-x-2 cursor-pointer"
            id="nav-cart-btn"
          >
            <span className="hidden md:inline text-[9px] font-mono tracking-widest uppercase">BAG</span>
            <div className="relative flex items-center">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              ) : (
                <span className="text-[9px] font-mono ml-1 text-neutral-400 font-medium">(0)</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Slide-out Left Menu Drawer - Zara Style */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark minimal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs"
              id="menu-backdrop"
            />

            {/* Left Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white border-r border-subtle p-8 flex flex-col justify-between"
              id="left-menu-drawer"
            >
              <div className="space-y-10">
                {/* Close Button & Header */}
                <div className="flex items-center justify-between border-b border-subtle pb-5">
                  <span className="font-serif font-semibold text-lg tracking-[0.25em] text-black">DADZY</span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-black hover:opacity-60 transition-opacity p-1.5 border border-subtle rounded-none cursor-pointer"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-5">
                  <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">COLLECTIONS</span>
                  {(Object.values(TabOption) as TabOption[]).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setIsMenuOpen(false);
                        }}
                        className={`text-left text-xl font-serif tracking-widest uppercase transition-all py-2 border-b border-transparent cursor-pointer ${
                          isActive
                            ? 'text-black font-semibold border-black'
                            : 'text-neutral-400 hover:text-black hover:border-neutral-300'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </nav>

                {/* Brand Philosophy Blurb */}
                <div className="space-y-3 pt-6 border-t border-subtle/40">
                  <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">THE DICTUM</span>
                  <p className="text-xs font-serif italic text-neutral-600 leading-relaxed uppercase">
                    "We dress the distinguished patriarch. Elegant knit polo t-shirts, premium shirts, and tailored trousers. Stark, quiet luxury without compromise."
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="space-y-4 pt-6 border-t border-subtle">
                <div className="text-[8px] font-mono tracking-widest text-neutral-400 uppercase">
                  ESTABLISHED 2026 / CHENNAI DESPATCH
                </div>
                <div className="flex space-x-4 text-[9px] font-mono text-neutral-500 uppercase">
                  <span className="hover:text-black cursor-pointer">TERMS</span>
                  <span className="hover:text-black cursor-pointer">PRIVACY</span>
                  <span className="hover:text-black cursor-pointer">CONCIERGE</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
