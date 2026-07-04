import { motion } from 'motion/react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface CoutureCollectionsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  cartQuantities: { [productId: string]: number };
}

export default function CoutureCollections({ products, onAddToCart, cartQuantities }: CoutureCollectionsProps) {
  // Find products associated with this volume
  const findProduct = (id: string) => products.find((p) => p.id === id);

  const polo = findProduct('p-01');
  const linenShirt = findProduct('p-02');
  const pleatedTrouser = findProduct('p-03');

  const getIndianRupeeStr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    // DADZY Lookbook Section - Quiet Wealth Editorial Style
    <div className="bg-white text-black overflow-hidden border-b border-subtle">
      {/* Editorial Quote Header */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center space-y-6">
        <span className="text-[9px] font-mono tracking-widest-mega text-neutral-400 uppercase block">
          THE HOUSE OF DADZY / EDITORIAL DICTUM
        </span>
        <h3 className="font-serif italic text-3xl md:text-5xl text-neutral-800 leading-tight max-w-3xl mx-auto">
          "True luxury is not loud. It is a slow, silent resonance of uncompromised craft, tailored for those who built our foundations."
        </h3>
        <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
          — SARTORIAL JOURNAL, ISSUE I
        </p>
      </section>

      {/* LOOK 1: The Atelier Silk-Cotton Polo */}
      <section className="relative py-16 md:py-28 px-6 md:px-16 border-t border-subtle bg-[#F9F9F9]">
        {/* Absolute Background Branding */}
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.025] text-[15vw] md:text-[20vw] font-serif font-black leading-none tracking-widest-mega text-right uppercase">
          ESSENTIAL
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Asymmetrical Image Frame */}
          <div className="md:col-span-7 group relative bg-white border border-subtle p-3 rounded-none transition-all duration-500 hover:border-black">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative">
              <img
                src="/images/dad_lifestyle_polo.png"
                alt="The Atelier Silk-Cotton Polo on a distinguished gentleman"
                className="w-full h-full object-cover grayscale contrast-110 brightness-95 group-hover:grayscale-0 transition-all duration-700 hover:scale-101"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-mono uppercase tracking-widest">
                18-GAUGE BIELLA SILK
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase block">LOOK 01 — CLASSIC KNITS</span>
              <h4 className="font-serif font-light text-2xl md:text-4xl text-black uppercase tracking-tight">
                The Atelier Silk-Cotton Polo
              </h4>
              <p className="text-xs font-mono text-neutral-500 uppercase mt-2">
                Biella tailoring / Hand-linked sleeves
              </p>
            </div>

            <p className="text-xs text-neutral-600 tracking-wide leading-relaxed font-mono">
              Knitted from ultrafine organic Giza cotton and pure mulberry silk, this essential polo provides an exceptionally soft touch and structural drape designed for mature silhouettes.
            </p>

            <div className="border-t border-subtle pt-6 flex justify-between items-center">
              <div>
                <span className="text-neutral-400 text-[9px] block uppercase font-mono">ALLOCATION PRICE</span>
                <span className="text-lg font-mono font-medium text-black">
                  {polo ? getIndianRupeeStr(polo.price) : '₹14,500'}
                </span>
              </div>

              {polo && (
                <button
                  onClick={() => onAddToCart(polo)}
                  className="px-6 py-3 bg-black hover:bg-neutral-900 text-white font-mono text-[9px] tracking-widest uppercase transition-colors flex items-center space-x-1.5 font-bold cursor-pointer rounded-none"
                >
                  <Plus size={12} />
                  <span>SECURE PIECE</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LOOK 2: The Cold Linen Editorial Shirt */}
      <section className="relative py-16 md:py-28 px-6 md:px-16 border-t border-subtle">
        {/* Absolute Background Branding */}
        <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.025] text-[15vw] md:text-[20vw] font-serif font-black leading-none tracking-widest-mega text-left uppercase">
          SARTORIAL
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Description Block - Desktop Left */}
          <div className="md:col-span-5 order-2 md:order-1 space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase block">LOOK 02 — SARTORIAL BLAZERS</span>
              <h4 className="font-serif font-light text-2xl md:text-4xl text-black uppercase tracking-tight">
                The Tailored Blazer Jacket
              </h4>
              <p className="text-xs font-mono text-neutral-500 uppercase mt-2">
                Linen-Wool Blend / Horn Button Detail
              </p>
            </div>

            <p className="text-xs text-neutral-600 tracking-wide leading-relaxed font-mono">
              Designed with structured shoulders and a sleek double-vented back, this tailored linen-wool blazer maintains a crisp, dignified stance for formal or leisure afternoons.
            </p>

            <div className="border-t border-subtle pt-6 flex justify-between items-center">
              <div>
                <span className="text-neutral-400 text-[9px] block uppercase font-mono">ALLOCATION PRICE</span>
                <span className="text-lg font-mono font-medium text-black">
                  {linenShirt ? getIndianRupeeStr(linenShirt.price) : '₹32,000'}
                </span>
              </div>

              {linenShirt && (
                <button
                  onClick={() => onAddToCart(linenShirt)}
                  className="px-6 py-3 bg-black hover:bg-neutral-900 text-white font-mono text-[9px] tracking-widest uppercase transition-colors flex items-center space-x-1.5 font-bold cursor-pointer rounded-none"
                >
                  <Plus size={12} />
                  <span>SECURE PIECE</span>
                </button>
              )}
            </div>
          </div>

          {/* Asymmetrical Image Frame - Desktop Right */}
          <div className="md:col-span-7 order-1 md:order-2 group relative bg-[#F9F9F9] border border-subtle p-3 rounded-none transition-all duration-500 hover:border-black">
            <div className="aspect-[4/5] bg-white overflow-hidden relative">
              <img
                src="/images/dad_editorial_blazer.png"
                alt="The Tailored Blazer Jacket styled elegantly"
                className="w-full h-full object-cover grayscale contrast-110 brightness-95 group-hover:grayscale-0 transition-all duration-700 hover:scale-101"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-mono uppercase tracking-widest">
                BIELLA LINEN-WOOL WEAVE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOOK 3: The Sartorial Pleated Trouser */}
      <section className="relative py-16 md:py-28 px-6 md:px-16 border-t border-subtle bg-[#F9F9F9]">
        {/* Absolute Background Branding */}
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.025] text-[15vw] md:text-[20vw] font-serif font-black leading-none tracking-widest-mega text-right uppercase">
          ELEGANCE
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Asymmetrical Image Frame */}
          <div className="md:col-span-7 group relative bg-white border border-subtle p-3 rounded-none transition-all duration-500 hover:border-black">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative">
              <img
                src="/images/dad_pleated_trouser.png"
                alt="The Sartorial Pleated Trouser close up drape details"
                className="w-full h-full object-cover grayscale contrast-110 brightness-95 group-hover:grayscale-0 transition-all duration-700 hover:scale-101"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-mono uppercase tracking-widest">
                CERRUTI WOOL-LINEN WEAVE
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase block">LOOK 03 — TROUSERS</span>
              <h4 className="font-serif font-light text-2xl md:text-4xl text-black uppercase tracking-tight">
                The Sartorial Pleated Trouser
              </h4>
              <p className="text-xs font-mono text-neutral-500 uppercase mt-2">
                Double pleats / Steel side adjusters
              </p>
            </div>

            <p className="text-xs text-neutral-600 tracking-wide leading-relaxed font-mono">
              Designed with side adjusters rather than belt loops, these double-pleated wool-linen trousers sit comfortably at a high waist, framing the mature torso with unyielding structure.
            </p>

            <div className="border-t border-subtle pt-6 flex justify-between items-center">
              <div>
                <span className="text-neutral-400 text-[9px] block uppercase font-mono">ALLOCATION PRICE</span>
                <span className="text-lg font-mono font-medium text-black">
                  {pleatedTrouser ? getIndianRupeeStr(pleatedTrouser.price) : '₹18,500'}
                </span>
              </div>

              {pleatedTrouser && (
                <button
                  onClick={() => onAddToCart(pleatedTrouser)}
                  className="px-6 py-3 bg-black hover:bg-neutral-900 text-white font-mono text-[9px] tracking-widest uppercase transition-colors flex items-center space-x-1.5 font-bold cursor-pointer rounded-none"
                >
                  <Plus size={12} />
                  <span>SECURE PIECE</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
