import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DropHero from './components/DropHero';
import CoutureCollections from './components/CoutureCollections';
import ProductGrid from './components/ProductGrid';
import PrivateSalon from './components/PrivateSalon';
import CartDrawer from './components/CartDrawer';
import { DADZY_DROPS } from './data/products';
import { TabOption, Product, CartItem } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.DROPS);
  const [dropsState, setDropsState] = useState(DADZY_DROPS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hniSubscribed, setHniSubscribed] = useState(false);
  const [hniEmail, setHniEmail] = useState('');

  const handleHniSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (hniEmail) {
      setHniSubscribed(true);
      setTimeout(() => {
        setHniSubscribed(false);
        setHniEmail('');
      }, 5000);
    }
  };

  // Compute total count of items in the cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Map product quantities in the cart
  const cartQuantities = cartItems.reduce<{ [id: string]: number }>((acc, item) => {
    acc[item.product.id] = item.quantity;
    return acc;
  }, {});

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const addedQty = existing ? existing.quantity : 0;
      
      // Check stock limit
      if (addedQty >= product.stock) {
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    // Auto-open cart to show atomic lock simulation
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }

    setCartItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;

      // Find actual product stock from the dropsState
      let productStock = 0;
      for (const drop of dropsState) {
        const prod = drop.products.find((p) => p.id === productId);
        if (prod) {
          productStock = prod.stock;
          break;
        }
      }

      if (newQty > productStock) {
        return prev; // block addition past available stock
      }

      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: newQty } : i
      );
    });
  };

  // On successful Checkout, decrement available stock in state and clear the cart
  const handleCheckoutSuccess = () => {
    setDropsState((prevDrops) => {
      return prevDrops.map((drop) => ({
        ...drop,
        products: drop.products.map((product) => {
          const cartItem = cartItems.find((item) => item.product.id === product.id);
          if (cartItem) {
            return {
              ...product,
              stock: Math.max(0, product.stock - cartItem.quantity)
            };
          }
          return product;
        })
      }));
    });
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main selection:bg-brand selection:text-white">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Tab content router */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          {activeTab === TabOption.DROPS && (
            <motion.div
              key="drops-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DropHero />
              <CoutureCollections
                products={dropsState.flatMap((d) => d.products)}
                onAddToCart={handleAddToCart}
                cartQuantities={cartQuantities}
              />
              <ProductGrid
                drops={dropsState}
                onAddToCart={handleAddToCart}
                cartQuantities={cartQuantities}
              />
            </motion.div>
          )}

          {activeTab === TabOption.SALON && (
            <motion.div
              key="salon-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PrivateSalon />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Brand Footer */}
      <footer className="border-t border-subtle bg-bg-panel-dark py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col text-center md:text-left">
            <span className="font-serif font-semibold text-xl tracking-tighter text-text-main">
              DADZY
            </span>
            <span className="text-[8px] font-mono tracking-widest-mega text-neutral-500">
              PARENT COMPANY: VIMAL PARMAR COLLECTIONS
            </span>
          </div>

          {/* Discreet Minimalist Email Capture for HNI Access */}
          <div className="flex flex-col items-center md:items-start max-w-xs w-full gap-2">
            <span className="text-[8px] font-mono tracking-widest-mega text-neutral-400 uppercase font-bold">
              REQUEST PRIVILEGED HNI ACCESS NOTIFICATIONS
            </span>
            <AnimatePresence mode="wait">
              {!hniSubscribed ? (
                <motion.form 
                  key="hni-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleHniSubscribe} 
                  className="flex w-full border border-subtle bg-bg-panel hover:border-brand/40 focus-within:border-brand transition-colors"
                >
                  <input
                    type="email"
                    value={hniEmail}
                    onChange={(e) => setHniEmail(e.target.value)}
                    placeholder="ENTER COUTURE EMAIL"
                    required
                    className="w-full bg-transparent px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-text-main focus:outline-none placeholder-neutral-400"
                  />
                  <button
                    type="submit"
                    className="bg-brand/10 hover:bg-brand hover:text-white text-brand px-3 text-[9px] font-mono tracking-widest uppercase border-l border-subtle transition-all duration-200"
                  >
                    SUBMIT
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="hni-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[9px] font-mono tracking-widest uppercase text-brand font-bold bg-brand-muted border border-brand/20 p-2 w-full text-center"
                >
                  ✓ EMAIL SIGNED TO HNI LEDGER
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-6 text-[10px] font-mono tracking-widest text-neutral-500 uppercase justify-center md:justify-end">
            <span>© 2026 DADZY INC. ALL RIGHTS SECURED</span>
          </div>
        </div>
      </footer>

      {/* Cart Slider */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQty={handleUpdateCartQty}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
