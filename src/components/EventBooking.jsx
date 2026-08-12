import React, { useState } from 'react';

export default function EventBooking({ onBackToMenu }) {
  const [guestCount, setGuestCount] = useState('50-100');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [venue, setVenue] = useState('');
  const [additionalNotes, setDeliveryNotes] = useState('');

  const WHATSAPP_NUMBER = "2347081241745";

  const handleBookEventWhatsApp = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !eventDate) {
      alert("Please fill in your name, contact phone number, and event date.");
      return;
    }

    const message = `*SUPREME CHOPS EVENT CATERING BOOKING*\n\n` +
      `*Full Name:* ${fullName}\n` +
      `*Phone Number:* ${phone}\n` +
      `*Event Type:* ${eventType}\n` +
      `*Estimated Guests:* ${guestCount} Guests\n` +
      `*Event Date:* ${eventDate}\n` +
      `*Event Venue/Location:* ${venue || 'To be communicated'}\n` +
      `*Special Notes/Menu Needs:* ${additionalNotes || 'None'}\n\n` +
      `Hello Supreme Chops Team, I would like to request a catering quote for my event.`;

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-neutral-950 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden text-center space-y-4 border border-neutral-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-block bg-orange-500/20 border border-orange-500/40 text-orange-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
          Gourmet Catering Services
        </span>

        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
          Book Us For Your <span className="text-orange-500">Events</span>
        </h2>

        <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
          Planning a wedding, birthday party, corporate gathering, or private celebration in Lagos? Let Supreme Chops handle your live finger food stations and gourmet platters.
        </p>

        <div className="pt-2">
          <button
            onClick={onBackToMenu}
            className="bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all"
          >
            ← Back to Food Menu
          </button>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-neutral-900">
            Event Catering Request Form
          </h3>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Fill in your event details below to get an instant quote directly on WhatsApp.
          </p>
        </div>

        <form onSubmit={handleBookEventWhatsApp} className="space-y-5">
          {/* Contact Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Full Name <span className="text-orange-500">*</span>
              </label>
              <input 
                required
                type="text" 
                placeholder="Enter full name..." 
                className="w-full border border-neutral-200 bg-neutral-50 text-xs p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Phone Number <span className="text-orange-500">*</span>
              </label>
              <input 
                required
                type="tel" 
                placeholder="Enter phone number..." 
                className="w-full border border-neutral-200 bg-neutral-50 text-xs p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Event Type & Expected Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Event Type</label>
              <select 
                value={eventType}
                onChange={e => setEventType(e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50 text-xs p-3.5 rounded-xl focus:outline-none font-semibold text-neutral-800"
              >
                <option value="Wedding / Engagement">Wedding / Engagement</option>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Corporate Event / Seminar">Corporate Event / Seminar</option>
                <option value="End of Year / Office Party">End of Year / Office Party</option>
                <option value="House Warming / Private Gathering">House Warming / Private Gathering</option>
                <option value="Funeral / Memorial Reception">Funeral / Memorial Reception</option>
                <option value="Other Celebration">Other Celebration</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Estimated Guests</label>
              <select 
                value={guestCount}
                onChange={e => setGuestCount(e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50 text-xs p-3.5 rounded-xl focus:outline-none font-semibold text-neutral-800"
              >
                <option value="20 - 50 Guests">20 - 50 Guests</option>
                <option value="50 - 100 Guests">50 - 100 Guests</option>
                <option value="100 - 250 Guests">100 - 250 Guests</option>
                <option value="250 - 500 Guests">250 - 500 Guests</option>
                <option value="500+ Mega Event">500+ Mega Event</option>
              </select>
            </div>
          </div>

          {/* Event Date & Location Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Event Date <span className="text-orange-500">*</span>
              </label>
              <input 
                required
                type="date" 
                className="w-full border border-neutral-200 bg-neutral-50 text-xs p-3.5 rounded-xl focus:outline-none font-medium"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Event Venue / City</label>
              <input 
                type="text" 
                placeholder="e.g. Landmark Centre, Victoria Island, Ikeja..." 
                className="w-full border border-neutral-200 bg-neutral-50 text-xs p-3.5 rounded-xl focus:outline-none font-medium"
                value={venue}
                onChange={e => setVenue(e.target.value)}
              />
            </div>
          </div>

          {/* Special Requests / Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Special Menu Requests / Notes</label>
            <textarea 
              rows="3"
              placeholder="Tell us about your preferred items (e.g., Live puff puff frying station, Peppered Snails, Corndogs)..." 
              className="w-full border border-neutral-200 bg-neutral-50 text-xs p-3.5 rounded-xl focus:outline-none font-medium resize-none"
              value={additionalNotes}
              onChange={e => setDeliveryNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-950 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest p-4 rounded-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2.5 shadow-xl"
          >
            <svg className="w-5 h-5 fill-current text-emerald-400" viewBox="0 0 24 24">
              <path d="M2.004 22l1.352-4.968A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.952 9.952 0 01-5.032-1.356L2.004 22zM8.391 7.308c-.18-.024-.361-.024-.541 0a1.05 1.05 0 00-.735.418c-.287.391-.818 1.341-.818 2.651 0 1.31.848 2.576.965 2.736.118.16 1.668 2.684 4.092 3.633 2.02.791 2.433.633 2.875.592.441-.04 1.418-.58 1.618-1.141.2-.56.2-1.041.14-1.141-.06-.1-.22-.16-.46-.281-.24-.12-1.015-.374-1.933-1.193-.715-.638-1.198-1.426-1.338-1.666-.14-.24-.015-.37.105-.49.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.781-.195-.468-.396-.404-.543-.411z"/>
            </svg>
            <span>Request Event Catering Quote via WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
}
