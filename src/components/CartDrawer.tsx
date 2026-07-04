import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Trash2, Shield, Loader2, CreditCard, CheckCircle, Smartphone } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onCheckoutSuccess: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQty,
  onCheckoutSuccess
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'locking' | 'razorpay' | 'success'>('cart');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('vimalparmar@okaxis');
  const [cardNumber, setCardNumber] = useState('4321 8876 1120 4492');
  const [isProcessing, setIsProcessing] = useState(false);

  const getIndianRupeeStr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleStartCheckout = () => {
    // Step 1: Simulate Medusa securing advisory row locks on Postgres DB
    setCheckoutStep('locking');
    setTimeout(() => {
      // Step 2: Proceed to Razorpay portal after securing locks
      setCheckoutStep('razorpay');
    }, 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Razorpay processing & Webhook callback trigger
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep('success');
      // Decrement main stock outside after transaction commits
      onCheckoutSuccess();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={onClose}
            className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Drawer Frame */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-bg-panel border-l border-subtle p-6 flex flex-col justify-between font-mono text-xs text-neutral-600 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-subtle pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={16} className="text-brand" />
                <span className="text-xs font-bold uppercase tracking-widest text-text-main font-sans">MEDUSA CHECKOUT SECURE</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-100 border border-subtle rounded-none text-neutral-500 hover:text-text-main"
              >
                <X size={15} />
              </button>
            </div>

            {/* Dynamic Content States */}
            <div className="flex-1 overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                {checkoutStep === 'cart' && (
                  <motion.div
                    key="cart-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {cartItems.length === 0 ? (
                      <div className="py-16 text-center">
                        <ShoppingBag className="mx-auto text-neutral-300 mb-4" size={24} />
                        <span className="text-[10px] tracking-widest text-neutral-400 uppercase">Your bag is empty</span>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div 
                          key={item.product.id}
                          className="flex space-x-4 bg-bg-panel-dark p-4 border border-subtle rounded-none"
                        >
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-none grayscale hover:grayscale-0 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold text-text-main uppercase truncate max-w-[160px]">
                                  {item.product.name}
                                </span>
                                <span className="text-[10px] text-text-main font-bold whitespace-nowrap">
                                  {getIndianRupeeStr(item.product.price * item.quantity)}
                                </span>
                              </div>
                              <span className="text-[8px] text-neutral-500 block uppercase mt-1">
                                Category: {item.product.category}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-2.5">
                              {/* Quantity Control */}
                              <div className="flex items-center space-x-2 border border-subtle rounded-none bg-bg-panel">
                                <button 
                                  onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                                  className="px-2 py-0.5 hover:bg-neutral-100 text-neutral-400 hover:text-text-main"
                                >
                                  -
                                </button>
                                <span className="text-[9px] text-text-main font-bold">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                                  className="px-2 py-0.5 hover:bg-neutral-100 text-neutral-400 hover:text-text-main"
                                >
                                  +
                                </button>
                              </div>

                              {/* Remove */}
                              <button 
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-neutral-400 hover:text-brand flex items-center space-x-1 uppercase text-[8px] tracking-widest transition-colors"
                              >
                                <Trash2 size={10} />
                                <span>REMOVE</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {checkoutStep === 'locking' && (
                  <motion.div
                    key="locking-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-6"
                  >
                    <Loader2 size={32} className="animate-spin text-brand mx-auto" />
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-text-main uppercase tracking-widest">ACQUIRING POSTGRES TRANSACTION ROW LOCKS</h4>
                      <p className="text-[9px] text-neutral-500 uppercase max-w-xs mx-auto leading-relaxed">
                        Medusa is securing atomic locking leases to isolate transactional states & prevent double allocations...
                      </p>
                    </div>

                    <div className="bg-bg-panel-dark p-4 border border-subtle rounded-none text-left text-[9px] space-y-1.5 uppercase text-neutral-600 font-mono">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex justify-between">
                          <span className="text-neutral-500">Advisory Lock: {item.product.id}</span>
                          <span className="text-brand font-bold">LOCKED (Lease secured)</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {checkoutStep === 'razorpay' && (
                  <motion.div
                    key="razorpay-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="bg-bg-panel-dark border border-subtle p-4 rounded-none flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-neutral-500 uppercase">MERCHANT GATEWAY</span>
                        <span className="text-xs font-bold text-text-main tracking-widest uppercase">Razorpay Secure</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-neutral-500 uppercase block">NET BILLING</span>
                        <span className="text-xs text-brand font-bold">{getIndianRupeeStr(totalAmount)}</span>
                      </div>
                    </div>

                    {/* Method Selector */}
                    <div className="grid grid-cols-3 gap-2">
                      {(['upi', 'card', 'netbanking'] as PaymentMethod[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSelectedPayment(m)}
                          className={`p-3 border text-center uppercase tracking-widest text-[9px] rounded-none transition-all ${
                            selectedPayment === m
                              ? 'border-brand bg-brand-muted text-brand font-bold'
                              : 'border-subtle bg-bg-panel hover:border-neutral-400 text-text-main'
                          }`}
                        >
                          {m === 'upi' && 'UPI Pay'}
                          {m === 'card' && 'Card'}
                          {m === 'netbanking' && 'Bank'}
                        </button>
                      ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      {selectedPayment === 'upi' && (
                        <div>
                          <label className="block text-[8px] text-neutral-500 uppercase tracking-widest mb-1.5">UPI ID (VPA)</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full bg-bg-panel border border-subtle p-3 text-xs text-text-main uppercase focus:outline-none focus:border-brand rounded-none pl-10 font-mono"
                            />
                            <Smartphone className="absolute left-3.5 top-3.5 text-neutral-400" size={13} />
                          </div>
                        </div>
                      )}

                      {selectedPayment === 'card' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[8px] text-neutral-500 uppercase tracking-widest mb-1.5">CARD NUMBER</label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full bg-bg-panel border border-subtle p-3 text-xs text-text-main focus:outline-none focus:border-brand rounded-none pl-10"
                              />
                              <CreditCard className="absolute left-3.5 top-3.5 text-neutral-400" size={13} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] text-neutral-500 uppercase tracking-widest mb-1.5">EXPIRY DATE</label>
                              <input
                                type="text"
                                required
                                defaultValue="11/29"
                                className="w-full bg-bg-panel border border-subtle p-3 text-xs text-text-main text-center focus:outline-none focus:border-brand rounded-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] text-neutral-500 uppercase tracking-widest mb-1.5">CVV/CVC</label>
                              <input
                                type="password"
                                maxLength={3}
                                required
                                defaultValue="991"
                                className="w-full bg-bg-panel border border-subtle p-3 text-xs text-text-main text-center focus:outline-none focus:border-brand rounded-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPayment === 'netbanking' && (
                        <div>
                          <label className="block text-[8px] text-neutral-500 uppercase tracking-widest mb-1.5">SELECT METROPOLITAN BANK</label>
                          <select className="w-full bg-bg-panel border border-subtle p-3 text-xs text-text-main focus:outline-none focus:border-brand rounded-none">
                            <option>HDFC BANK (HNI PRIVILEGE)</option>
                            <option>ICICI BANK (WEALTH DIVISION)</option>
                            <option>STATE BANK OF INDIA (PREMIER)</option>
                            <option>AXIS BANK (BURGUNDY)</option>
                          </select>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-none text-xs tracking-widest uppercase transition-colors flex items-center justify-center space-x-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin" size={14} />
                            <span>WEBHOOK SIGNATURE VERIFYING...</span>
                          </>
                        ) : (
                          <span>CONFIRM ₹ {totalAmount.toLocaleString('en-IN')} & CHECKOUT</span>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {checkoutStep === 'success' && (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-6"
                  >
                    <CheckCircle size={44} className="text-brand mx-auto animate-bounce" />
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-text-main uppercase tracking-widest">TRANSACTION TRANSMITTED SUCCESSFULLY</h4>
                      <p className="text-[10px] text-neutral-500 uppercase max-w-xs mx-auto leading-relaxed">
                        Medusa database has locked the inventory indices. A secure insured courier from Vimal Parmar Collections has been dispatched.
                      </p>
                    </div>

                    <div className="bg-bg-panel-dark p-4 border border-subtle rounded-none text-left text-[9px] space-y-1.5 uppercase text-neutral-500 font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Order Reference:</span>
                        <span className="text-text-main font-bold">VP-998-LOCK</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Gateway Provider:</span>
                        <span className="text-text-main">Razorpay Live webhook</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Shipment Status:</span>
                        <span className="text-brand font-bold">Allocated in Mumbai Vault</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCheckoutStep('cart');
                        onClose();
                      }}
                      className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold text-[9px] uppercase tracking-widest rounded-none transition-colors"
                    >
                      RETURN TO THE DROPS
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom calculation block */}
            {checkoutStep === 'cart' && cartItems.length > 0 && (
              <div className="border-t border-subtle pt-6 mt-6 space-y-4">
                <div className="space-y-2 font-mono text-[10px] uppercase">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Medusa Cart Total</span>
                    <span className="text-text-main">{getIndianRupeeStr(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">GCP Insured Shipping</span>
                    <span className="text-brand font-bold">FREE (HNI WAIVER)</span>
                  </div>
                  <div className="flex justify-between border-t border-subtle pt-2 text-xs font-bold text-text-main">
                    <span>Grand Total</span>
                    <span className="text-brand font-bold">{getIndianRupeeStr(totalAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[9px] text-neutral-500 uppercase leading-normal">
                  <Shield size={12} className="text-brand shrink-0" />
                  <span>Inventory holds are leased for a maximum of 15 minutes before recycling.</span>
                </div>

                <button
                  onClick={handleStartCheckout}
                  className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 text-xs tracking-widest uppercase transition-colors rounded-none text-center"
                >
                  SECURE RESERVATIONS NOW
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
