import React from 'react';

export default function HeroSection({ onNavigateToCustomize, onSelectLocation }) {
  return (
    <section className="relative bg-neutral-950 text-white pt-12 pb-20 px-6 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
        {/* Trust Badge Bar */}
        <div className="inline-flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-full text-xs font-semibold text-orange-400 backdrop-blur-md shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Freshly Made Gourmet Small Chops in Lagos</span>
        </div>

        {/* Big Foodie Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight uppercase font-foody">
          Craving Hot, Crispy <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400">
            Small Chops?
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Order premium finger foods, party platters, and custom snack packs delivered fresh across Lagos within hours.
        </p>

        {/* Hero Action Buttons */}
        <div className="max-w-xl mx-auto pt-4 space-y-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-left">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Hub</p>
                <p className="text-xs font-semibold text-white truncate">Lagos State (VI, Ikoyi, Lekki & Mainland)</p>
              </div>
            </div>

            <button
              onClick={() => {
                const catalog = document.getElementById('menu-catalog');
                if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-orange-600/30 whitespace-nowrap flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span>Order Menu Now</span>
            </button>
          </div>

          {/* Dedicated Customize Pack CTA Tab */}
          <button
            onClick={onNavigateToCustomize}
            className="w-full bg-neutral-900/90 hover:bg-neutral-800 text-orange-400 border border-orange-500/30 hover:border-orange-500/60 font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all duration-300 backdrop-blur-md shadow-md flex items-center justify-center gap-2 transform active:scale-95"
          >
            <svg className="w-4 h-4 fill-current text-amber-400" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span>Customize Your Pack</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center border-t border-neutral-800/80 mt-8">
          <div>
            <p className="text-base sm:text-lg font-black text-white font-mono">100%</p>
            <p className="text-[10px] text-neutral-400 uppercase font-medium">Fresh Ingredients</p>
          </div>
          <div className="border-x border-neutral-800">
            <p className="text-base sm:text-lg font-black text-white font-mono">1-2 hrs</p>
            <p className="text-[10px] text-neutral-400 uppercase font-medium">Lagos Dispatch</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-black text-white font-mono">Events</p>
            <p className="text-[10px] text-neutral-400 uppercase font-medium">Party Catering</p>
          </div>
        </div>
      </div>
    </section>
  );
}
