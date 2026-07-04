import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Heart, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Product, InventoryDrop } from '../types';

interface ProductGridProps {
  drops: InventoryDrop[];
  onAddToCart: (product: Product) => void;
  cartQuantities: { [productId: string]: number };
}

type CategoryFilter = 'All' | 'Elite Knitwear' | 'Couture Jackets' | "Dad's Shirts" | "Dad's Trousers" | 'Saved for Later';

export default function ProductGrid({ drops, onAddToCart, cartQuantities }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [activeDropTab, setActiveDropTab] = useState<'active' | 'upcoming'>('active');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [tummyProfile, setTummyProfile] = useState<'flat' | 'dignified' | 'prominent'>('dignified');
  const [shoulderProfile, setShoulderProfile] = useState<'standard' | 'sloped' | 'square'>('standard');

  // Dynamic Sizing Recommendation logic for senior figures
  const getBespokeRecommendation = () => {
    let baseSize = 'L';
    let notes = '';

    if (tummyProfile === 'prominent') {
      baseSize = 'XXL';
      notes = 'Our relaxed-waist curvature adds 3cm of circumference to sit comfortably around the abdomen without feeling restrictive.';
    } else if (tummyProfile === 'dignified') {
      baseSize = 'XL';
      notes = 'A balanced, slightly relaxed cut provides natural mobility for active business travel and occasion dinners.';
    } else {
      baseSize = 'M';
      notes = 'A clean, closer fit that maintains structured lines across the chest and torso.';
    }

    if (shoulderProfile === 'square') {
      notes += ' The hand-felled seams are set 1.5cm wider for enhanced drape.';
    } else if (shoulderProfile === 'sloped') {
      notes += ' Soft-padded seamless construction is utilized to frame the shoulders elegantly.';
    }

    return { size: baseSize, notes };
  };

  const recommendation = getBespokeRecommendation();

  // Synchronize fitting profile to localStorage for secure checkout integration
  useEffect(() => {
    localStorage.setItem('dadzy_tummy_profile', tummyProfile);
  }, [tummyProfile]);

  useEffect(() => {
    localStorage.setItem('dadzy_shoulder_profile', shoulderProfile);
  }, [shoulderProfile]);

  // Wishlist persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dadzy_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dadzy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const currentDrop = drops.find((d) => d.status === activeDropTab);
  const products = currentDrop ? currentDrop.products : [];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : selectedCategory === 'Saved for Later'
      ? products.filter((p) => wishlist.includes(p.id))
      : products.filter((p) => p.category === selectedCategory);

  const categories: CategoryFilter[] = ['All', 'Elite Knitwear', 'Couture Jackets', "Dad's Shirts", "Dad's Trousers", 'Saved for Later'];

  const getIndianRupeeStr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Maps index to Zara/Balenciaga-style asymmetrical grid column widths
  const getColSpanClass = (index: number) => {
    const sequence = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7', 'md:col-span-6', 'md:col-span-6'];
    return sequence[index % sequence.length];
  };

  return (
    <section id="products-section" className="px-6 py-20 md:px-12 max-w-7xl mx-auto bg-white">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between border-b border-subtle pb-6 mb-8 gap-4">
        <div className="flex space-x-8">
          <button
            onClick={() => {
              setActiveDropTab('active');
              setSelectedCategory('All');
            }}
            className={`text-sm tracking-[0.25em] font-mono transition-all duration-300 relative pb-4 uppercase cursor-pointer ${
              activeDropTab === 'active' ? 'text-black font-bold' : 'text-neutral-400 hover:text-black'
            }`}
          >
            <span>Active Drops</span>
            {activeDropTab === 'active' && (
              <motion.div layoutId="activeDropLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveDropTab('upcoming');
              setSelectedCategory('All');
            }}
            className={`text-sm tracking-[0.25em] font-mono transition-all duration-300 relative pb-4 uppercase cursor-pointer ${
              activeDropTab === 'upcoming' ? 'text-black font-bold' : 'text-neutral-400 hover:text-black'
            }`}
          >
            <span>Upcoming Releases</span>
            {activeDropTab === 'upcoming' && (
              <motion.div layoutId="activeDropLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        </div>

        <div className="text-left md:text-right text-[9px] font-mono text-neutral-400 uppercase tracking-widest leading-relaxed">
          {activeDropTab === 'active'
            ? 'COUTURE REGISTER: 15 PIECES | 6 ACTIVE ALLOCATIONS | 9 EXPIRED/QUEUED'
            : 'COUTURE VOL. II / ALLOCATIONS COMMENCING SEPT 15'}
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-12 select-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const isWishlist = cat === 'Saved for Later';
          const countStr = isWishlist ? ` (${wishlist.length})` : '';
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-[10px] tracking-widest uppercase font-mono rounded-none border transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-black'
              }`}
            >
              {isWishlist && <Heart size={10} className={wishlist.length > 0 ? "fill-black text-black" : ""} />}
              <span>{cat === 'Saved for Later' ? 'SAVED' : cat}{countStr}</span>
            </button>
          );
        })}
      </div>

      {/* ASYMMETRICAL EDITORIAL MASONRY GRID (Zara/Balenciaga style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 gap-x-10 items-stretch">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, idx) => {
            const addedQty = cartQuantities[product.id] || 0;
            const remainingStock = Math.max(0, product.stock - addedQty);
            const isSoldOut = remainingStock === 0;
            const colSpan = getColSpanClass(idx);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedSize('L'); // default
                }}
                className={`group flex flex-col justify-between cursor-pointer space-y-4 ${colSpan}`}
              >
                {/* Image Container with slow elegant zoom */}
                <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden border border-neutral-100 group-hover:border-neutral-400 transition-colors duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-103 filter grayscale contrast-110 brightness-95 group-hover:grayscale-0 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />

                  {/* Category & Theme Stamp */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-1 items-start">
                    <div className="bg-white/95 backdrop-blur-xs border border-subtle px-2.5 py-1 text-[8px] font-mono tracking-widest uppercase text-black font-bold">
                      {product.category}
                    </div>
                    {product.theme && (
                      <div className="bg-black text-white px-2 py-0.5 text-[7px] font-mono tracking-widest uppercase">
                        {product.theme}
                      </div>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute bottom-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-xs border border-subtle text-neutral-400 hover:text-black hover:border-black transition-all rounded-none cursor-pointer"
                    title={wishlist.includes(product.id) ? "Remove from Saved" : "Save for Later"}
                  >
                    <Heart
                      size={11}
                      className={wishlist.includes(product.id) ? "fill-black text-black" : ""}
                    />
                  </button>

                  {/* Sold Out Banner */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-xs">
                      <span className="text-[10px] font-mono tracking-widest-mega text-neutral-500 border border-black px-4 py-2 uppercase bg-white">
                        INVENTORY EXPLETED
                      </span>
                    </div>
                  )}
                </div>

                {/* Info and price block */}
                <div className="flex flex-col space-y-2 pt-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-serif font-light text-xl text-black uppercase tracking-tight group-hover:opacity-70 transition-opacity">
                      {product.name}
                    </h4>
                    <span className="text-xs font-mono font-medium text-neutral-500">
                      {getIndianRupeeStr(product.price)}
                    </span>
                  </div>

                  <p className="text-neutral-500 text-xs tracking-wide leading-relaxed font-mono line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 uppercase pt-2 border-t border-subtle">
                    <span className="flex items-center space-x-1">
                      <MapPin size={9} />
                      <span className="truncate max-w-[120px]">{product.origin.split('/')[0]}</span>
                    </span>
                    {remainingStock > 0 && remainingStock <= 3 ? (
                      <span className="text-black font-semibold uppercase">{remainingStock} PIECES LEFT</span>
                    ) : (
                      <span>SERIES COUTURE</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="col-span-12 py-24 text-center border border-dashed border-neutral-200">
            <h3 className="text-xs font-mono tracking-widest-mega text-neutral-400 uppercase">NO SERIALS ATTAINED</h3>
            <p className="text-[10px] font-mono text-neutral-400 mt-2 uppercase">Please select another luxury category filter.</p>
          </div>
        )}
      </div>

      {/* FULL-SCREEN BESPOKE PRODUCT DETAIL PAGE (Zara/Balenciaga Style) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-white flex flex-col"
            id="bespoke-product-page"
          >
            {/* Top Navigation Bar on Product Page */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-subtle z-10 px-6 md:px-12 py-5 flex items-center justify-between">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex items-center space-x-2 text-black hover:opacity-60 transition-opacity font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                id="back-to-catalog-btn"
              >
                <ArrowLeft size={14} />
                <span>BACK TO COLLECTION</span>
              </button>

              <span className="font-serif font-semibold text-lg tracking-[0.25em] text-black">DADZY</span>

              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="text-black hover:opacity-60 transition-opacity font-mono text-[10px] tracking-widest uppercase flex items-center space-x-1.5 cursor-pointer"
              >
                <Heart size={12} className={wishlist.includes(selectedProduct.id) ? "fill-black text-black" : ""} />
                <span>{wishlist.includes(selectedProduct.id) ? "SAVED" : "SAVE"}</span>
              </button>
            </div>

            {/* Main Product Layout (Massive Image taking up 60-70% width on Desktop) */}
            <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Side: Massive Image Container (65% width on desktop) */}
              <div className="lg:col-span-8 bg-neutral-50 relative border-r border-subtle flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full max-h-[85vh] lg:max-h-none object-cover filter grayscale contrast-110 brightness-95 hover:grayscale-0 transition-all duration-[1000ms]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual authenticity tag */}
                <div className="absolute bottom-6 left-6 bg-black text-white px-3 py-1.5 text-[8px] font-mono uppercase tracking-widest">
                  SERIAL LOT: {selectedProduct.id.toUpperCase()}-A1
                </div>
              </div>

              {/* Right Side: Clean Sticky Sidebar for Product Details (35% width on desktop) */}
              <div className="lg:col-span-4 p-6 md:p-12 flex flex-col justify-between space-y-10 lg:sticky lg:top-24 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto">
                {/* Details Section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono tracking-widest-mega text-neutral-400 uppercase">
                        {selectedProduct.category} COLLECTION
                      </span>
                      {selectedProduct.theme && (
                        <span className="bg-black text-white text-[7px] font-mono px-1.5 py-0.5 uppercase tracking-widest font-bold">
                          {selectedProduct.theme}
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif font-light text-2xl md:text-4xl text-black uppercase tracking-tight">
                      {selectedProduct.name}
                    </h2>
                    <div className="text-lg font-mono text-black pt-1">
                      {getIndianRupeeStr(selectedProduct.price)}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 font-mono tracking-wide leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="border-t border-subtle pt-4 space-y-3">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase block">SPECIFICATIONS</span>
                    <ul className="space-y-2">
                      {selectedProduct.specs.map((spec, i) => (
                        <li key={i} className="flex items-start space-x-2 text-[10px] font-mono text-neutral-500">
                          <span className="text-black mt-1">▪</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sourcing details */}
                  <div className="border-t border-subtle pt-4 space-y-2">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase block">MATERIALS & TRACEABILITY</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedProduct.materials.map((m, i) => (
                        <span key={i} className="bg-neutral-100 text-neutral-600 font-mono text-[9px] px-2.5 py-1">
                          {m}
                        </span>
                      ))}
                    </div>
                    <p className="text-[9px] font-mono text-neutral-400 uppercase pt-1">
                      Sourced/Crafted: {selectedProduct.origin}
                    </p>
                  </div>

                  {/* Bespoke Silhouette Fit Guide */}
                  <div className="border-t border-subtle pt-4 space-y-4">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase block font-bold">BESPOKE SILHOUETTE FIT GUIDE</span>
                    
                    {/* Tummy Profile Selector */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block">Waistline / Tummy Profile</span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'flat', label: 'Flat' },
                          { id: 'dignified', label: 'Dignified' },
                          { id: 'prominent', label: 'Prominent' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setTummyProfile(item.id as any);
                              const newSize = item.id === 'prominent' ? 'XXL' : item.id === 'dignified' ? 'XL' : 'M';
                              setSelectedSize(newSize);
                            }}
                            className={`py-2 text-[9px] font-mono border transition-all cursor-pointer ${
                              tummyProfile === item.id
                                ? 'bg-black text-white border-black font-bold'
                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Shoulder Profile Selector */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block">Shoulder Profile</span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'standard', label: 'Standard' },
                          { id: 'sloped', label: 'Sloped' },
                          { id: 'square', label: 'Square' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setShoulderProfile(item.id as any)}
                            className={`py-2 text-[9px] font-mono border transition-all cursor-pointer ${
                              shoulderProfile === item.id
                                ? 'bg-black text-white border-black font-bold'
                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tailoring Note Box */}
                    <div className="bg-[#F9F9F9] border border-subtle p-3 space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-black font-bold">SILHOUETTE SIZE SUGGESTION:</span>
                        <span className="bg-brand/15 text-brand px-1.5 py-0.5 rounded-none font-bold text-[10px]">
                          SIZE {recommendation.size}
                        </span>
                      </div>
                      <p className="text-[9px] font-mono text-neutral-600 leading-relaxed">
                        {recommendation.notes}
                      </p>
                    </div>

                    {/* Live Allocation Queue Status */}
                    {selectedProduct.stock > 0 && (
                      <div className="border border-neutral-200 bg-neutral-50 p-3 space-y-1.5 flex flex-col">
                        <div className="flex items-center space-x-1.5 text-[8px] font-mono text-black font-bold uppercase tracking-widest">
                          <span className="h-1.5 w-1.5 rounded-full bg-black inline-block animate-pulse"></span>
                          <span>LIVE COUTURE QUEUE</span>
                        </div>
                        <div className="flex justify-between items-baseline text-[9px] font-mono text-neutral-600">
                          <span>Active Viewers:</span>
                          <span className="text-black font-bold">3 Patrons auditing</span>
                        </div>
                        <div className="flex justify-between items-baseline text-[9px] font-mono text-neutral-500 pt-1 border-t border-dashed border-neutral-200">
                          <span>Lot Allocation:</span>
                          <span className="text-black font-bold">Only 1 of {selectedProduct.stock} slots remaining</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* S, M, L, XL, XXL Size Selector */}
                  <div className="border-t border-subtle pt-4 space-y-3">
                    <div className="flex justify-between items-baseline text-[9px] font-mono">
                      <span className="text-neutral-400 uppercase">SELECT SIZE</span>
                      <span className="text-neutral-400 hover:text-black cursor-pointer underline">SIZE GUIDE</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`p-3 text-center font-mono text-xs transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-black text-white border-black font-bold'
                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Checkout/Add to Bag Action Panel */}
                <div className="space-y-4 pt-6 border-t border-subtle mt-auto">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase">
                    <span>INSURED DESPATCH</span>
                    <span className="text-black font-bold">FREE COURIER SHIPPING</span>
                  </div>

                  {activeDropTab === 'active' ? (
                    <button
                      onClick={() => {
                        onAddToCart(selectedProduct);
                        // don't close, user sees it added to cart drawer
                      }}
                      disabled={selectedProduct.stock === 0}
                      className={`w-full py-4 font-mono text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-none text-center ${
                        selectedProduct.stock === 0
                          ? 'bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed'
                          : 'bg-black hover:bg-neutral-900 text-white border border-black'
                      }`}
                      id="pdp-add-to-bag-btn"
                    >
                      {selectedProduct.stock === 0 ? 'OUT OF STOCK' : `ADD TO BAG — SIZE ${selectedSize}`}
                    </button>
                  ) : (
                    <button
                      className="w-full py-4 bg-neutral-100 border border-neutral-200 text-neutral-400 font-mono text-xs tracking-widest uppercase rounded-none cursor-not-allowed text-center"
                    >
                      RESERVING SEPT 15
                    </button>
                  )}

                  <div className="text-center">
                    <span className="text-[8px] font-mono text-neutral-400 uppercase">
                      * 15-MINUTE ATOMIC CART LOCK SYSTEM ACTIVE *
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
