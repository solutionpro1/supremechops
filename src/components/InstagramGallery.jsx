import React, { useEffect } from 'react';

export default function InstagramGallery({ onClose }) {
  useEffect(() => {
    // This safely loads the external Instagram widget script
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute('data-use-service-core', '');
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when the user closes the gallery
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[150] bg-neutral-950 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 py-8 relative min-h-screen flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6 sticky top-0 bg-neutral-950 z-10 pt-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-orange-500 uppercase tracking-tight">Our Gallery</h2>
            <p className="text-neutral-400 text-xs sm:text-sm font-medium">Fresh from our kitchen to your feed.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 rounded-full font-bold text-neutral-400 hover:text-white text-lg flex items-center justify-center transition-colors border border-neutral-800"
          >
            ✕
          </button>
        </div>

        {/* Instagram Widget Container */}
        <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-3xl p-2 sm:p-4 min-h-[600px]">
          
          {/* !!! PASTE YOUR ELFSIGHT WIDGET ID BELOW !!! */}
          <div className="elfsight-app-REPLACE-THIS-WITH-YOUR-WIDGET-ID"></div>
          
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-4">
          <p className="text-[11px] text-neutral-600 font-medium">
            Follow us on Instagram for daily updates.
          </p>
        </div>
      </div>
    </div>
  );
}
