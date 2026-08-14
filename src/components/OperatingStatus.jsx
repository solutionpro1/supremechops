import React from 'react';

export const OperatingStatus = () => {
  return (
    <div className="bg-amber-950/70 border border-amber-600/30 text-amber-200 text-xs py-2 px-4 rounded-xl flex flex-wrap items-center justify-between gap-2 mx-auto my-3 max-w-4xl shadow-sm">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
        <span>Kitchen Open: <strong>Mon – Sat (9:00 AM – 5:00 PM)</strong></span>
      </div>
      <span className="text-[11px] bg-amber-600/30 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-amber-100 font-medium">
        ? Live & Scheduled Deliveries Available
      </span>
    </div>
  );
};
