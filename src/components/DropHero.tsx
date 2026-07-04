import { motion } from 'motion/react';

export default function DropHero() {
  const handleScrollToCollection = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // DADZY Hero Component - Zara Style
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Edge-to-Edge High-Resolution Imagery of a silver-haired patriarch */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?auto=format&fit=crop&q=80&w=1800"
          alt="Distinguished elder model wearing signature DADZY polo"
          className="w-full h-full object-cover filter grayscale contrast-110 brightness-[0.85] transition-all duration-700 hover:scale-102"
          referrerPolicy="no-referrer"
        />
        {/* Stark dark editorial ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/35" />
      </div>

      {/* Floating text description left-aligned in editorial style */}
      <div className="absolute top-32 left-6 md:left-16 max-w-lg text-white z-10 space-y-5">
        <span className="text-[9px] font-mono tracking-widest-mega uppercase text-neutral-300 block">
          THE APOGEE OF CLASSIC ESSENTIALS
        </span>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.1] uppercase font-light">
          Dignified. <br/>
          Sartorial. <br/>
          Uncompromised.
        </h2>
        <div className="h-px w-20 bg-white/45" />
        <p className="text-[10px] font-mono tracking-widest leading-relaxed text-neutral-300 uppercase">
          COLD LINEN, SILK KNITS, AND TAILORED TROUSERS FOR THE RETROSPECTIVE PATRIARCH.
        </p>
      </div>

      {/* Brand Identity Stamp at the Corner */}
      <div className="absolute bottom-12 left-16 hidden lg:block text-[9px] font-mono tracking-widest-mega text-neutral-400 uppercase">
        MUMBAI LABS / CHENNAI DESPATCH
      </div>

      {/* Far bottom right corner indicator */}
      <div className="absolute bottom-12 right-16 hidden lg:block text-[9px] font-mono tracking-widest-mega text-neutral-400">
        LOT ID: VP-2026-A1
      </div>

      {/* One single, delicate "Shop The Collection" button at the bottom center */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10">
        <motion.button
          onClick={handleScrollToCollection}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          whileHover={{ scale: 1.03 }}
          className="px-10 py-4 bg-white text-black border border-white hover:bg-black hover:text-white hover:border-black font-mono text-[10px] tracking-[0.25em] uppercase transition-all duration-300 rounded-none cursor-pointer font-bold shadow-md"
          id="hero-shop-collection-btn"
        >
          SHOP THE COLLECTION
        </motion.button>
      </div>
    </div>
  );
}
