import React, { useState, useEffect } from 'react';

const images = Array.from({ length: 12 }, (_, i) => {
  return new URL(`../assets/slide${i + 1}.jpg`, import.meta.url).href;
});

export default function HeroSection({ onNavigateToCustomize }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollToMenu = () => {
    const element = document.getElementById('menu-catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white border-b border-neutral-200/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-orange-600 uppercase">Premium Lagos Catering</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-none">
            GOURMET <br />
            <span className="text-orange-600">SMALL CHOPS</span> <br />
            FOR CLASSY EVENTS
          </h1>
          
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-lg">
            Elevate your gatherings with our premium, carefully crafted finger food packages. Golden-brown puff puff, crispy samosas, rich spring rolls, and succulent barbecue wings delivered hot and fresh directly to your venue.
          </p>
          
          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              onClick={handleScrollToMenu}
              className="bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-4 rounded-2xl text-xs tracking-wider uppercase transition-all active:scale-95 shadow-md"
            >
              Order Main Packs
            </button>
            <button 
              onClick={onNavigateToCustomize}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-black px-6 py-4 rounded-2xl text-xs tracking-wider uppercase transition-all active:scale-95 shadow-md"
            >
              Customize Your Pack ✨
            </button>
          </div>
        </div>

        <div className="relative h-[320px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-neutral-200/50 bg-neutral-100">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={src}
                alt={`Supreme Chops Presentation Platter ${index + 1}`}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[10000ms]"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-neutral-950/5 mix-blend-multiply"></div>
            </div>
          ))}

          <div className="absolute bottom-6 right-6 z-20 bg-neutral-900/70 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white tracking-widest uppercase">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

      </div>
    </div>
  );
}
