import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, User, Sparkles, MapPin, Calendar, ArrowRight, Briefcase } from 'lucide-react';
import { HniUser } from '../types';

export default function PrivateSalon() {
  const [currentUser, setCurrentUser] = useState<HniUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('MUMBAI');
  const [phone, setPhone] = useState('');
  const [requestedCommission, setRequestedCommission] = useState('');
  const [selectedTier, setSelectedTier] = useState<'Heritage' | 'Regal' | 'Imperial'>('Heritage');

  // Load simulated profile on mount if saved
  useEffect(() => {
    const saved = localStorage.getItem('dadzy_hni_profile');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    const profile: HniUser = {
      fullName: name,
      email: email,
      city: city,
      phone: phone,
      tier: selectedTier,
      conciergeNotes: 'Awaiting bespoke size parameters. Initial preference: 18-gauge cold silk-cotton knitwear.',
      joinedAt: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      customCommissions: requestedCommission 
        ? [requestedCommission] 
        : ['Priority booking reservation for private viewing at Mumbai Vault']
    };

    localStorage.setItem('dadzy_hni_profile', JSON.stringify(profile));
    setCurrentUser(profile);
  };

  const handleAddCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedCommission || !currentUser) return;

    const updated = {
      ...currentUser,
      customCommissions: [...currentUser.customCommissions, requestedCommission]
    };

    localStorage.setItem('dadzy_hni_profile', JSON.stringify(updated));
    setCurrentUser(updated);
    setRequestedCommission('');
  };

  const handleResetProfile = () => {
    localStorage.removeItem('dadzy_hni_profile');
    setCurrentUser(null);
  };

  return (
    // DADZY Private Salon component - Stark Minimalist Luxury
    <div className="min-h-screen py-16 px-6 md:px-12 max-w-5xl mx-auto font-mono text-black">
      {/* Title Header */}
      <div className="text-center mb-16 space-y-4">
        <span className="text-[9px] text-neutral-400 tracking-widest-mega uppercase block">
          PRIVATE SALON REGISTRY / APPOINTMENT CONCIERGE
        </span>
        <h2 className="font-serif font-light text-3xl md:text-5xl text-black tracking-tight uppercase">
          The Private Salon
        </h2>
        <div className="h-[1px] w-20 bg-black mx-auto" />
        <p className="text-[10px] text-neutral-500 max-w-xl mx-auto leading-relaxed uppercase tracking-widest-plus">
          AN EXCLUSIVE DIGITAL LIAISON TO SECURE PRIVATE FITMENT SESSIONS, COMMISSIONS OF 1-OF-1 TEXTILE DESIGNS, AND PERSONALIZED STYLING DIRECTIVES.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!currentUser ? (
          /* Enrollment Form */
          <motion.div
            key="enrollment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-subtle p-6 md:p-10 rounded-none max-w-2xl mx-auto"
          >
            <div className="flex items-center space-x-3 text-black mb-8 border-b border-subtle pb-4">
              <Sparkles size={16} strokeWidth={1.5} />
              <h3 className="text-xs tracking-widest-plus font-bold uppercase">SECURE ENTRY DISPATCH</h3>
            </div>

            <form onSubmit={handleEnroll} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-400 mb-2 font-mono">FULL NAME / RECIPIENT</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vimal Parmar"
                    className="w-full bg-white border border-neutral-200 p-3 text-xs uppercase tracking-wider text-black focus:outline-none focus:border-black rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-400 mb-2 font-mono">PRIVATE COUTURE EMAIL</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. vimal@parmarcollections.in"
                    className="w-full bg-white border border-neutral-200 p-3 text-xs text-black focus:outline-none focus:border-black rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-400 mb-2 font-mono">METROPOLITAN VAULT</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-neutral-200 p-3 text-xs text-black focus:outline-none focus:border-black rounded-none uppercase font-mono cursor-pointer"
                  >
                    <option value="MUMBAI">MUMBAI (COLABA VAULT)</option>
                    <option value="NEW DELHI">NEW DELHI (LUTYENS SUITE)</option>
                    <option value="BENGALURU">BENGALURU (INDIRANAGAR ATELIER)</option>
                    <option value="CHENNAI">CHENNAI (COASTAL HARBOR)</option>
                    <option value="KOLKATA">KOLKATA (ALIPORE ENCLAVE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-400 mb-2 font-mono">PRIVATE CONTACT NUMBER</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98200 12345"
                    className="w-full bg-white border border-neutral-200 p-3 text-xs text-black focus:outline-none focus:border-black rounded-none"
                  />
                </div>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-400 mb-2 font-mono">SARTORIAL STATUS REQUESTED</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Heritage', title: 'Heritage Member', desc: 'Complimentary fitment, priority allocations' },
                    { id: 'Regal', title: 'Regal Patron', desc: 'Insured courier, private scent sample bookings' },
                    { id: 'Imperial', title: 'Imperial Collector', desc: '1-of-1 knit design requests, studio liaison' }
                  ].map((tier) => (
                    <div
                       key={tier.id}
                       onClick={() => setSelectedTier(tier.id as any)}
                       className={`border p-4 cursor-pointer rounded-none transition-all duration-300 flex flex-col justify-between h-28 ${
                        selectedTier === tier.id
                          ? 'border-black bg-neutral-50'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                       }`}
                    >
                      <div className="text-[9px] font-bold uppercase text-black">{tier.title}</div>
                      <div className="text-[8px] text-neutral-500 uppercase leading-normal tracking-wide">{tier.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial Request */}
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-400 mb-2 font-mono">BESPOKE DIRECTIVES (OPTIONAL)</label>
                <textarea
                  value={requestedCommission}
                  onChange={(e) => setRequestedCommission(e.target.value)}
                  placeholder="e.g., Sizing details, shoulder preference, or requests for special linen weaves."
                  rows={3}
                  className="w-full bg-white border border-neutral-200 p-3 text-xs text-black focus:outline-none focus:border-black rounded-none uppercase tracking-wide"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-900 text-white font-bold py-4 text-xs tracking-widest uppercase transition-colors rounded-none flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>TRANSMIT SALON SECURE KEY</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </motion.div>
        ) : (
          /* Enrolled Dashboard */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Top Verification Box */}
            <div className="bg-white border border-subtle p-6 md:p-8 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-none bg-neutral-50 border border-subtle flex items-center justify-center text-black">
                  <ShieldCheck size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[9px] tracking-widest text-black uppercase flex items-center space-x-2 font-bold">
                    <span>SALON CREDENTIAL VALIDATED</span>
                    <span className="text-[7px] bg-black text-white px-2 py-0.5 rounded-none font-bold">ACTIVE ALLOCATOR</span>
                  </div>
                  <h3 className="text-2xl font-serif font-light text-black uppercase leading-none mt-2">
                    {currentUser.fullName}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-[9px] text-neutral-400 uppercase mt-2">
                    <span className="flex items-center space-x-1">
                      <MapPin size={10} />
                      <span>{currentUser.city} COUTURE SECURE</span>
                    </span>
                    <span>•</span>
                    <span>PH: {currentUser.phone}</span>
                    <span>•</span>
                    <span>AUTHORIZED: {currentUser.joinedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <div className="bg-neutral-50 border border-subtle px-4 py-2 rounded-none text-center min-w-[120px]">
                  <span className="text-[7px] uppercase tracking-widest text-neutral-400 block">SARTORIAL STATUS</span>
                  <span className="text-[10px] font-bold text-black uppercase tracking-widest">{currentUser.tier} TIER</span>
                </div>
                <button
                  onClick={handleResetProfile}
                  className="px-4 py-2 bg-white hover:bg-neutral-50 border border-subtle text-neutral-500 hover:text-black transition-colors text-[9px] tracking-widest uppercase rounded-none cursor-pointer"
                >
                  DE-AUTHORIZE
                </button>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: Salon Benefits */}
              <div className="bg-white border border-subtle p-6 rounded-none space-y-6">
                <h4 className="text-[10px] font-bold text-black tracking-widest uppercase flex items-center space-x-2 border-b border-subtle pb-3">
                  <User size={13} strokeWidth={1.5} />
                  <span>SARTORIAL ACCOUNT</span>
                </h4>

                <div className="space-y-4 text-xs uppercase">
                  <div>
                    <span className="text-[8px] text-neutral-400 block mb-1">CONCIERGE DIRECTIVES</span>
                    <p className="text-[10px] text-neutral-700 bg-neutral-50 border border-subtle p-3 rounded-none leading-relaxed">
                      {currentUser.conciergeNotes}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] text-neutral-400 block">TIER ELEVATIONS IN FORCE</span>
                    <ul className="space-y-2.5 text-[9px]">
                      <li className="flex items-center space-x-2 text-neutral-500">
                        <span className="text-black">▪</span>
                        <span>Direct 1-to-1 secure SMS concierge with lead tailor</span>
                      </li>
                      <li className="flex items-center space-x-2 text-neutral-500">
                        <span className="text-black">▪</span>
                        <span>Insured courier transport with premium silk wrap</span>
                      </li>
                      <li className="flex items-center space-x-2 text-neutral-500">
                        <span className="text-black">▪</span>
                        <span>Bespoke custom hem modifications complimentary</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Column 2 & 3: Active Commissions */}
              <div className="md:col-span-2 bg-white border border-subtle p-6 rounded-none flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-black tracking-widest uppercase flex items-center space-x-2 border-b border-subtle pb-3 mb-4">
                    <Briefcase size={13} strokeWidth={1.5} />
                    <span>BESPOKE APPOINTMENTS & TEXTILE DESIGN</span>
                  </h4>

                  <div className="space-y-3">
                    {currentUser.customCommissions.map((comm, idx) => (
                      <div key={idx} className="bg-neutral-50 border border-subtle p-4 rounded-none relative overflow-hidden">
                        <div className="absolute right-0 top-0 bg-neutral-200 px-2 py-0.5 text-[7px] text-neutral-600 border-l border-b border-subtle font-mono tracking-widest uppercase font-medium">
                          TRANSMITTED
                        </div>
                        <p className="text-[10px] text-neutral-800 uppercase leading-relaxed tracking-wide pr-14 font-mono">
                          {comm}
                        </p>
                        <div className="flex items-center space-x-2 text-[8px] text-neutral-400 uppercase mt-3">
                          <Calendar size={10} />
                          <span>Status: Concierge Scheduling Fitting Slot</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submitting a new custom HNI request */}
                <form onSubmit={handleAddCommission} className="border-t border-subtle pt-4">
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-400 mb-2 font-mono">
                    SUBMIT ADDITIONAL COUTURE COMMISSION OR DIRECTIVE
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={requestedCommission}
                      onChange={(e) => setRequestedCommission(e.target.value)}
                      placeholder="e.g. Reserve private sizing slot at Lutyens New Delhi on Thursday."
                      className="flex-1 bg-white border border-neutral-200 p-3 text-[10px] uppercase tracking-wider text-black focus:outline-none focus:border-black rounded-none"
                    />
                    <button
                      type="submit"
                      className="bg-black hover:bg-neutral-900 text-white font-bold px-4 text-[10px] tracking-widest uppercase transition-colors rounded-none flex items-center space-x-1 whitespace-nowrap cursor-pointer"
                    >
                      <span>TRANSMIT</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="bg-[#F9F9F9] border border-subtle p-6 text-center text-[10px] tracking-widest uppercase italic text-neutral-500 max-w-2xl mx-auto leading-relaxed font-serif">
              "True prestige is recorded in silent care, preserving the heritage of those who crafted our today."
              <span className="block text-[8px] not-italic text-black font-mono tracking-widest-plus mt-2 font-bold">— THE HOUSE OF DADZY</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
