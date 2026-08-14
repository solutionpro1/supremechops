import React, { useState, useEffect } from 'react';

export const HoursNoticeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  useEffect(() => {
    // Check if the user already dismissed it during this browser session
    const hasSeenNotice = sessionStorage.getItem('supreme_hours_notice_seen');
    
    // Check real-time Lagos store hours (WAT / UTC+1)
    const now = new Date();
    const utcHour = now.getUTCHours();
    const lagosHour = (utcHour + 1) % 24;
    const day = now.getUTCDay(); // 0 is Sunday, 1-6 is Mon-Sat

    const open = day !== 0 && lagosHour >= 9 && lagosHour < 17;
    setIsStoreOpen(open);

    if (!hasSeenNotice) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('supreme_hours_notice_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4 relative">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${isStoreOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {isStoreOpen ? '⚡' : '🕒'}
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight text-white">
              {isStoreOpen ? 'Kitchen Is Open & Delivering!' : 'Kitchen Operating Notice'}
            </h3>
            <p className="text-[11px] text-neutral-400 font-mono">
              Supreme Chops International
            </p>
          </div>
        </div>

        {/* Main Notice Body */}
        <div className="space-y-2.5 text-xs text-neutral-300 leading-relaxed bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800 text-[11px]">
            <span className="text-neutral-400">Official Kitchen Hours:</span>
            <span className="font-bold text-orange-400">Mon – Sat (9:00 AM – 5:00 PM)</span>
          </div>

          {!isStoreOpen ? (
            <div className="space-y-1.5 pt-1">
              <p className="text-red-300 font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                We are currently closed for immediate dispatch.
              </p>
              <p className="text-neutral-400 text-[11px]">
                You can still browse our menu, assemble custom packs, and <strong>schedule your delivery</strong> for upcoming working hours or days!
              </p>
            </div>
          ) : (
            <p className="text-emerald-300 text-[11px] pt-1">
              Orders placed now will be prepared fresh and dispatched promptly to your location across Lagos.
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/25"
        >
          {isStoreOpen ? 'Continue to Menu' : 'Got it, Let me Schedule'}
        </button>

      </div>
    </div>
  );
};
