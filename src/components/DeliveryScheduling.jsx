import React, { useState, useEffect } from 'react';

export const DeliveryScheduling = ({ onScheduleChange }) => {
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [deliveryType, setDeliveryType] = useState('asap');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Check live Lagos time (WAT / UTC+1)
  useEffect(() => {
    const checkLiveStoreHours = () => {
      const now = new Date();
      const utcHour = now.getUTCHours();
      const lagosHour = (utcHour + 1) % 24; 
      const day = now.getUTCDay(); // 0 is Sunday, 1-6 is Mon-Sat

      // Open Mon - Sat (Day 1-6) between 9:00 AM (9) and 5:00 PM (17)
      const open = day !== 0 && lagosHour >= 9 && lagosHour < 17;
      setIsOpenNow(open);

      if (!open) {
        setDeliveryType('scheduled');
        if (onScheduleChange) {
          onScheduleChange({ type: 'scheduled', date: selectedDate, time: selectedTime, storeClosedNow: true });
        }
      }
    };

    checkLiveStoreHours();
    const interval = setInterval(checkLiveStoreHours, 60000);
    return () => clearInterval(interval);
  }, [selectedDate, selectedTime]);

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const day = date.getUTCDay();
    if (day === 0) {
      alert("Supreme Chops is closed on Sundays. Please select a delivery date from Monday to Saturday.");
      setSelectedDate('');
      return;
    }
    setSelectedDate(e.target.value);
    if (onScheduleChange) {
      onScheduleChange({ type: 'scheduled', date: e.target.value, time: selectedTime });
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    if (onScheduleChange) {
      onScheduleChange({ type: 'scheduled', date: selectedDate, time: e.target.value });
    }
  };

  const handleTypeSwitch = (type) => {
    if (type === 'asap' && !isOpenNow) {
      alert("We are currently closed for immediate delivery. Kitchen opens Mon - Sat (9:00 AM - 5:00 PM). Please select a scheduled time slot!");
      return;
    }
    setDeliveryType(type);
    if (onScheduleChange) {
      if (type === 'asap') {
        onScheduleChange({ type: 'asap' });
      } else {
        onScheduleChange({ type: 'scheduled', date: selectedDate, time: selectedTime });
      }
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white my-3">
      {/* Real-time Status Alert Banner */}
      {!isOpenNow ? (
        <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200">
          <div className="flex items-center gap-2 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Kitchen is Currently Closed</span>
          </div>
          <p className="text-zinc-300">
            Immediate dispatch is unavailable right now. Our active kitchen hours are <strong>Mon – Sat (9:00 AM – 5:00 PM)</strong>. Please choose a scheduled date and time slot below to lock in your order!
          </p>
        </div>
      ) : (
        <div className="p-2.5 bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Kitchen Open & Delivering Now!</span>
          </div>
          <span className="text-[11px] text-zinc-400">Closes at 5:00 PM</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <label className="text-sm font-semibold text-zinc-200">Delivery Preference</label>
        <span className="text-[11px] text-amber-400 font-medium">Mon – Sat (9AM – 5PM)</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTypeSwitch('asap')}
          disabled={!isOpenNow}
          className={`py-2 px-3 text-xs font-medium rounded-lg border transition ${
            !isOpenNow
              ? 'bg-zinc-800/40 border-zinc-800 text-zinc-600 cursor-not-allowed'
              : deliveryType === 'asap'
              ? 'bg-amber-600 border-amber-500 text-white shadow'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          Deliver ASAP {!isOpenNow ? '(Closed)' : ''}
        </button>

        <button
          type="button"
          onClick={() => handleTypeSwitch('scheduled')}
          className={`py-2 px-3 text-xs font-medium rounded-lg border transition ${
            deliveryType === 'scheduled'
              ? 'bg-amber-600 border-amber-500 text-white shadow'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          Schedule For Later
        </button>
      </div>

      {deliveryType === 'scheduled' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Select Delivery Date (Mon – Sat)</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full bg-zinc-800 border border-zinc-700 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Select Delivery Slot (9AM – 5PM)</label>
            <select
              value={selectedTime}
              onChange={handleTimeChange}
              className="w-full bg-zinc-800 border border-zinc-700 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Choose Time Window</option>
              <option value="09:00 AM - 11:00 AM">09:00 AM – 11:00 AM</option>
              <option value="11:00 AM - 01:00 PM">11:00 AM – 01:00 PM</option>
              <option value="01:00 PM - 03:00 PM">01:00 PM – 03:00 PM</option>
              <option value="03:00 PM - 05:00 PM">03:00 PM – 05:00 PM</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
