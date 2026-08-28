import React, { useEffect } from 'react';

export default function Gallery({ onBackToMenu, onOrderNow }) {
  
  useEffect(() => {
    // Safely load the Elfsight Instagram widget script when the gallery opens
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when the user closes the gallery
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      
      {/* CUSTOM HEADER BANNER */}
      <div className="bg-neutral-950 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden text-center space-y-4 border border-neutral-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-block bg-orange-500/20 border border-orange-500/40 text-orange-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
          Live Instagram Showcase
        </span>
        
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
          Supreme Chops <span className="text-orange-500">Gallery</span>
        </h2>
        
        <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
          Explore our freshly prepared finger food platters, grilled delicacies, and party event setups straight from our Instagram feed.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={onOrderNow}
            className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-orange-600/30"
          >
            Order These Now
          </button>
          <button
            type="button"
            onClick={onBackToMenu}
            className="bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all"
          >
            ← Back to Menu
          </button>
        </div>
      </div>

      {/* LIVE INSTAGRAM WIDGET CONTAINER */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 sm:p-6 shadow-sm min-h-[500px] relative">
        <div className="elfsight-app-01c4d7de-7a39-47c1-b526-6a28e0dc6870 w-full" data-elfsight-app-lazy></div>
      </div>
    </div>
  );
}
