import React, { useState, useEffect } from 'react';

export const HoursNoticeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  useEffect(() => {
    const hasSeenNotice = sessionStorage.getItem('supreme_hours_notice_seen');
    const now = new Date();
    const utcHour = now.getUTCHours();
    const lagosHour = (utcHour + 1) % 24;

    const open = lagosHour >= 10 && lagosHour < 17;
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
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isStoreOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {isStoreOpen ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            )}
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

        <div className="space-y-2.5 text-xs text-neutral-300 leading-relaxed bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800 text-[11px]">
            <span className="text-neutral-400">Kitchen Schedule:</span>
            <span className="font-bold text-orange-400">Mon - Sun (10:00 AM - 5:00 PM)</span>
          </div>

          {!isStoreOpen ? (
            <div className="space-y-1.5 pt-1">
              <p className="text-red-300 font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                We are currently closed for immediate dispatch.
              </p>
              <p className="text-neutral-400 text-[11px]">
                You can still browse our menu, assemble packs, and <strong>schedule delivery</strong> for our upcoming active kitchen hours.
              </p>
            </div>
          ) : (
            <p className="text-emerald-300 text-[11px] pt-1">
              Orders placed now are prepared fresh and dispatched promptly across Lagos.
            </p>
          )}
        </div>

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
