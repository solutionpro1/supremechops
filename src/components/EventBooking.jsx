import React, { useState } from 'react';

export default function EventBooking({ onBackToMenu }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    guests: '',
    serviceType: 'on-site',
    eventDate: '',
    location: '',
    additionalNotes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'guests') {
      // Strictly enforce integer values only
      const sanitized = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, guests: sanitized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const WHATSAPP_NUMBER = "2347081241745";
    
    const message = `*SUPREME CHOPS EVENT CATERING BOOKING*\n\n` +
      `*Full Name:* ${formData.fullName}\n` +
      `*Phone Number:* ${formData.phone}\n` +
      `*Email Address:* ${formData.email}\n` +
      `*Estimated Guests:* ${formData.guests}\n` +
      `*Service Type:* ${formData.serviceType === 'on-site' ? 'On-Site Catering' : 'Bulk Event Delivery'}\n` +
      `*Event Date:* ${formData.eventDate}\n` +
      `*Location/Venue:* ${formData.location}\n` +
      `*Notes:* ${formData.additionalNotes || 'None Provided'}`;

    setSubmitted(true);
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation back button */}
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Order Menu
        </button>

        {/* Header Title */}
        <div className="space-y-3 text-center sm:text-left">
          <span className="bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-orange-500/20 inline-block">
            Party & Event Catering
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-foody">
            Book Supreme Chops For Your Event
          </h1>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-6 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
                Full Name <span className="text-orange-500">*</span>
              </label>
              <input
                required
                type="text"
                name="fullName"
                placeholder="e.g. Adekeye Olamide"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors font-medium"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
                Phone Number <span className="text-orange-500">*</span>
              </label>
              <input
                required
                type="tel"
                name="phone"
                placeholder="0708 124 1745"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors font-medium"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
                Email Address <span className="text-orange-500">*</span>
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors font-medium"
              />
            </div>

            {/* Number of Guests (Integer only) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
                Number of Guests <span className="text-orange-500">*</span>
              </label>
              <input
                required
                type="text"
                name="guests"
                inputMode="numeric"
                placeholder="e.g. 150"
                value={formData.guests}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors font-mono font-bold"
              />
            </div>

            {/* Service Type Select */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
                Service Type <span className="text-orange-500">*</span>
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors font-medium cursor-pointer"
              >
                <option value="on-site">On-Site Catering</option>
                <option value="delivery">Bulk Event Delivery</option>
              </select>
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
                Event Date <span className="text-orange-500">*</span>
              </label>
              <input
                required
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors font-medium color-scheme-dark"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
              Event Location / Venue Address <span className="text-orange-500">*</span>
            </label>
            <textarea
              required
              rows="3"
              name="location"
              placeholder="e.g. Landmark Event Center, Victoria Island, Lagos"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors font-medium resize-none"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300">
              Additional Event Notes
            </label>
            <textarea
              rows="2"
              name="additionalNotes"
              placeholder="Special requests or timing details..."
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors font-medium resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitted}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2"
          >
            {submitted ? (
              <span>Routing to Event Desk on WhatsApp...</span>
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                <span>Submit Event Catering Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
