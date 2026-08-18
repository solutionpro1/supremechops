import React, { useState, useEffect } from 'react';

export const DeliveryScheduling = ({ onScheduleChange }) => {
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [deliveryType, setDeliveryType] = useState('asap');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00 AM - 12:00 PM');

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const utcHour = now.getUTCHours();
      const lagosHour = (utcHour + 1) % 24;

      // Open Mon-Sun (Everyday) between 10:00 AM and 5:00 PM
      const open = lagosHour >= 10 && lagosHour < 17;
      setIsOpenNow(open);

      if (!open) {
        setDeliveryType('scheduled');
        const nextDate = new Date();
        if (lagosHour >= 17) {
          nextDate.setDate(nextDate.getDate() + 1); // Next day if past 5PM
        }
        const dateStr = nextDate.toISOString().split('T')[0];
        setSelectedDate(dateStr);

        if (onScheduleChange) {
          onScheduleChange({
            type: 'scheduled',
            date: dateStr,
            time: '10:00 AM - 12:00 PM',
            storeClosedNow: true
          });
        }
      } else {
        if (onScheduleChange) {
          onScheduleChange({ type: 'asap', storeClosedNow: false });
        }
      }
    };

    checkStatus();
  }, []);

  const handleDateChange = (e) => {
    const val = e.target.value;
    setSelectedDate(val);
    if (onScheduleChange) {
      onScheduleChange({
        type: 'scheduled',
        date: val,
        time: selectedTime || '10:00 AM - 12:00 PM'
      });
    }
  };

  const handleTimeChange = (e) => {
    const val = e.target.value;
    setSelectedTime(val);
    if (onScheduleChange) {
      onScheduleChange({
        type: 'scheduled',
        date: selectedDate,
        time: val
      });
    }
  };

  const handleTypeSwitch = (type) => {
    if (!isOpenNow && type === 'asap') return;
    setDeliveryType(type);
    if (onScheduleChange) {
      if (type === 'asap') {
        onScheduleChange({ type: 'asap' });
      } else {
        onScheduleChange({
          type: 'scheduled',
          date: selectedDate,
          time: selectedTime || '10:00 AM - 12:00 PM'
        });
      }
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white my-3">
      {!isOpenNow ? (
        <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200">
          <div className="flex items-center gap-2 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Kitchen is Currently Closed</span>
          </div>
          <p className="text-zinc-300">
            Immediate dispatch is closed right now (Active hours: <strong>Mon - Sun, 10:00 AM - 5:00 PM</strong>). Please schedule your delivery slot below.
          </p>
        </div>
      ) : (
        <div className="p-2.5 bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Kitchen Open & Delivering Now!</span>
          </div>
          <span className="text-[11px] text-zinc-400">Closes 5:00 PM</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <label className="text-sm font-semibold text-zinc-200">Delivery Timing</label>
        <span className="text-[11px] text-amber-400 font-medium">Mon - Sun (10AM - 5PM)</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!isOpenNow}
          onClick={() => handleTypeSwitch('asap')}
          className={`py-2 px-3 text-xs font-medium rounded-lg border transition flex items-center justify-center gap-1.5 ${
            !isOpenNow
              ? 'bg-zinc-900/60 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-40 pointer-events-none'
              : deliveryType === 'asap'
              ? 'bg-amber-600 border-amber-500 text-white shadow'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
          <span>Deliver ASAP {!isOpenNow ? '(Closed)' : ''}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeSwitch('scheduled')}
          className={`py-2 px-3 text-xs font-medium rounded-lg border transition flex items-center justify-center gap-1.5 ${
            deliveryType === 'scheduled'
              ? 'bg-amber-600 border-amber-500 text-white shadow'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg>
          <span>Schedule Slot</span>
        </button>
      </div>

      {deliveryType === 'scheduled' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Delivery Date (Mon - Sun)</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full bg-zinc-800 border border-zinc-700 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Time Slot (10AM - 5PM)</label>
            <select
              value={selectedTime}
              onChange={handleTimeChange}
              className="w-full bg-zinc-800 border border-zinc-700 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
              <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
