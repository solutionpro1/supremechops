import React, { useState, useRef } from 'react';

export default function CheckoutWizard({
  cart,
  updateQuantity,
  handleRemoveItem,
  calculateSubtotal,
  calculateTotal,
  currentDeliveryFee,
  deliveryZone,
  setDeliveryZone,
  detectedKm,
  setDetectedKm,
  BANK_ACCOUNT,
  handleDownloadInvoice,
  handleForwardToWhatsApp,
  isForSelf,
  setIsForSelf,
  deliveryMethod,
  setDeliveryMethod,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  altPhone,
  setAltPhone,
  deliveryAddress,
  setDeliveryAddress,
  deliveryNotes,
  setDeliveryNotes,
  gpsLoading,
  setGpsLoading,
  invoiceGenerated,
  onClose
}) {
  const [step, setStep] = useState(1);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedDepot, setCopiedDepot] = useState(false);
  const [searchQuery, setSearchLoadingQuery] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);

  const DEPOT_LAT = 6.438384;
  const DEPOT_LNG = 3.414441;
  const DEPOT_ADDRESS = "26 Moshalashi Street, Ikoyi Obalende, Lagos";

  const calculateGpsDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  const determineZoneFromDistance = (distanceKm) => {
    if (distanceKm <= 5) return 'tier1';
    if (distanceKm <= 10) return 'tier2';
    if (distanceKm <= 15) return 'tier3';
    if (distanceKm <= 20) return 'tier4';
    if (distanceKm <= 25) return 'tier5';
    if (distanceKm <= 30) return 'tier6';
    if (distanceKm <= 35) return 'tier7';
    if (distanceKm <= 40) return 'tier8';
    return 'outOfRange';
  };

  const handleAutoDetectFeeOnly = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser device profile.");
      return;
    }

    setGpsLoading(true);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const distance = calculateGpsDistance(DEPOT_LAT, DEPOT_LNG, userLat, userLng);
        const roundedDistance = Math.round(distance * 10) / 10;
        setDetectedKm(roundedDistance);
        setDeliveryZone(determineZoneFromDistance(roundedDistance));
        setGpsLoading(false);
      },
      (error) => {
        console.error("GPS lock error code:", error.code, error.message);
        setGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access was denied. Please allow location permissions in your browser or select your area using the search bar.");
        } else {
          alert("Unable to fetch high-precision GPS lock. Please search your area manually below.");
        }
      },
      geoOptions
    );
  };

  const handleCopyBankAccount = () => {
    navigator.clipboard.writeText(BANK_ACCOUNT.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleCopyDepotAddress = () => {
    navigator.clipboard.writeText(DEPOT_ADDRESS);
    setCopiedDepot(true);
    setTimeout(() => setCopiedDepot(false), 2500);
  };

  const handleAddressSearch = (value) => {
    setSearchLoadingQuery(value);

    if (!value || value.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const query = encodeURIComponent(`${value}, Lagos`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ng&addressdetails=1&limit=5`);
        const data = await response.json();
        setAddressSuggestions(data || []);
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 500);
  };

  const handleSelectSuggestion = (suggestion) => {
    const cleanLabel = suggestion.display_name.replace(', Nigeria', '').replace(', West Africa', '');
    setSearchLoadingQuery(cleanLabel);
    setAddressSuggestions([]);

    if (suggestion.lat && suggestion.lon) {
      const targetLat = parseFloat(suggestion.lat);
      const targetLng = parseFloat(suggestion.lon);
      
      const distance = calculateGpsDistance(DEPOT_LAT, DEPOT_LNG, targetLat, targetLng);
      const roundedDistance = Math.round(distance * 10) / 10;
      setDetectedKm(roundedDistance);
      setDeliveryZone(determineZoneFromDistance(roundedDistance));
    }
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-neutral-950/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5 relative flex flex-col justify-between">
        
        {/* Wizard Header Bar & Step Indicators */}
        <div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                Step {step} of 3
              </span>
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                {step === 1 && "Confirm Order Items"}
                {step === 2 && "Recipient Selection"}
                {step === 3 && (deliveryMethod === 'pickup' ? "Pickup Logistics" : "Delivery Coordinates")}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-full font-bold text-neutral-600 text-sm flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar Dots */}
          <div className="flex gap-2 pt-3">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-orange-600' : 'bg-neutral-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-orange-600' : 'bg-neutral-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-orange-600' : 'bg-neutral-200'}`} />
          </div>
        </div>

        {/* PERSISTENT LIVE ORDER SUMMARY STRIP */}
        {step > 1 && (
          <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-2 border border-neutral-800 shadow-md">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                Order Summary ({totalItemCount} Items)
              </span>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-[10px] font-bold text-orange-400 hover:text-orange-300 underline uppercase"
              >
                Edit Cart
              </button>
            </div>

            <p className="text-neutral-300 text-[11px] truncate font-mono">
              {cart.map(item => `${item.name} (${item.quantity})`).join(', ')}
            </p>

            <div className="pt-2 border-t border-neutral-800/80 space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span>₦{calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>
                  {deliveryMethod === 'pickup' ? 'Fulfillment:' : `Delivery Fee ${detectedKm ? `(${detectedKm}km)` : ''}:`}
                </span>
                <span className={deliveryMethod === 'pickup' ? "text-emerald-400 font-bold" : (deliveryZone === 'outOfRange' ? "text-red-400 font-bold uppercase" : (currentDeliveryFee > 0 ? "text-orange-300 font-bold" : "text-neutral-500"))}>
                  {deliveryMethod === 'pickup' ? "FREE (Self Pickup)" : (deliveryZone === 'outOfRange' ? "Out of Range" : (currentDeliveryFee > 0 ? `₦${currentDeliveryFee.toLocaleString()}` : "₦0 (Pin Location Below)"))}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-white pt-1">
                <span>Grand Total:</span>
                <span className="text-orange-400 font-extrabold text-sm">₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: ORDER CONFIRMATION */}
        {step === 1 && (
          <div className="space-y-5 py-1">
            {cart.length === 0 ? (
              <p className="text-xs text-neutral-400 py-12 text-center font-medium">Your basket is empty. Select items to construct your pack.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.uniqueId} className="flex justify-between items-center text-xs border-b border-neutral-100 pb-3">
                      <div className="space-y-0.5 max-w-[65%]">
                        <p className="font-bold text-neutral-800 truncate">{item.name}</p>
                        <p className="text-neutral-400 font-mono">₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center bg-neutral-100 rounded-lg">
                          <button onClick={() => updateQuantity(item.uniqueId, -1)} className="px-2.5 py-1 font-bold text-neutral-500 text-sm">-</button>
                          <span className="px-1 text-xs font-black font-mono text-neutral-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.uniqueId, 1)} className="px-2.5 py-1 font-bold text-neutral-500 text-sm">+</button>
                        </div>
                        <button onClick={() => handleRemoveItem(item.uniqueId)} className="text-neutral-300 hover:text-red-500 text-sm font-medium">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-neutral-500">
                    <span>Items Subtotal:</span>
                    <span className="font-mono">₦{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-neutral-500">
                    <span>Estimated Fulfillment:</span>
                    <span className="font-mono">{deliveryMethod === 'pickup' ? "FREE (Self Pickup)" : (currentDeliveryFee > 0 ? `₦${currentDeliveryFee.toLocaleString()}` : "₦0 (Pending Pin)")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-neutral-900 pt-1.5 border-t">
                    <span>Grand Total:</span>
                    <span className="font-mono text-orange-600">₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-neutral-950 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Confirm Order & Proceed</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 2: RECIPIENT TARGET CHOICE */}
        {step === 2 && (
          <div className="space-y-5 py-4">
            <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight text-center">
              Who is this order for?
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsForSelf(true);
                  setDeliveryAddress('');
                  setDetectedKm(null);
                  setDeliveryZone('none');
                  setStep(3);
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${isForSelf ? 'border-orange-500 bg-orange-50/40' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div>
                  <p className="font-extrabold text-sm text-neutral-900 uppercase">For Myself</p>
                  <p className="text-[11px] text-neutral-500 font-medium">Deliver or pick up for myself</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-600 font-bold text-xs">
                  ✓
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForSelf(false);
                  setDeliveryAddress('');
                  setDetectedKm(null);
                  setDeliveryZone('none');
                  setStep(3);
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${!isForSelf ? 'border-orange-500 bg-orange-50/40' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div>
                  <p className="font-extrabold text-sm text-neutral-900 uppercase">For Someone Else</p>
                  <p className="text-[11px] text-neutral-500 font-medium">Send as a gift or dispatch to another recipient</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-600 font-bold text-xs">
                  🎁
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-neutral-100 text-neutral-600 font-bold text-xs uppercase tracking-wider p-3 rounded-xl hover:bg-neutral-200"
            >
              ← Back to Order Items
            </button>
          </div>
        )}

        {/* STEP 3: LOGISTICS METHOD, COORDINATES & PAYMENT ACCOUNT */}
        {step === 3 && (
          <div className="space-y-4 py-1">
            
            {/* DELIVERY VS PICKUP FULFILLMENT TOGGLE */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Order Fulfillment Method</label>
              <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl border">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('dispatch')}
                  className={`text-center py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${deliveryMethod === 'dispatch' ? 'bg-white text-orange-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                  🛵 Doorstep Delivery
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod('pickup');
                    setDeliveryZone('none');
                    setDetectedKm(null);
                    setDeliveryAddress(DEPOT_ADDRESS);
                  }}
                  className={`text-center py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${deliveryMethod === 'pickup' ? 'bg-white text-orange-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                  🏪 Self Pickup (Depot)
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                {isForSelf ? 'Your Full Name' : "Recipient's Full Name"}
              </label>
              <input 
                required
                type="text" 
                placeholder={isForSelf ? "e.g. Olamide" : "Recipient full name"} 
                className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Contact Phone</label>
                <input 
                  required
                  type="tel" 
                  placeholder="0708..." 
                  className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Alternative No</label>
                <input 
                  type="tel" 
                  placeholder="Optional" 
                  className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium"
                  value={altPhone}
                  onChange={e => setAltPhone(e.target.value)}
                />
              </div>
            </div>

            {/* IF PICKUP METHOD SELECTED: SHOW DEPOT ADDRESS CARD */}
            {deliveryMethod === 'pickup' ? (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                    📍 Self Pickup Depot Address
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDepotAddress}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedDepot ? "Copied!" : "Copy Address"}
                  </button>
                </div>
                <p className="text-xs font-extrabold text-neutral-800 leading-snug">
                  {DEPOT_ADDRESS}
                </p>
                <p className="text-[10px] text-emerald-700 font-medium italic">
                  ✓ Delivery fee is ₦0. You can pick up your freshly prepared pack directly at our Obalende kitchen depot once notified.
                </p>
              </div>
            ) : (
              /* IF DELIVERY DISPATCH SELECTED: SHOW GPS PIN OR SEARCH LOGIC */
              <>
                {isForSelf ? (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Location Coordinate Pin</label>
                    <button 
                      type="button"
                      onClick={handleAutoDetectFeeOnly}
                      className="w-full border border-orange-500 bg-orange-50/50 hover:bg-orange-50 text-orange-600 font-black text-[11px] uppercase tracking-wider p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
                      <span>{gpsLoading ? 'Pinning Location Coordinates...' : 'Click to Pin My Live Location'}</span>
                    </button>

                    {detectedKm && (
                      deliveryZone === 'outOfRange' ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-center space-y-1">
                          <p className="text-xs font-black uppercase">⚠️ Out of Direct Delivery Range ({detectedKm} km)</p>
                          <p className="text-[10px] font-medium leading-relaxed text-red-600">
                            Location exceeds 40 km from our Obalende depot. Please select <strong>"For Someone Else"</strong> to order for a recipient within Lagos, or switch to <strong>"Self Pickup"</strong>.
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-green-600 font-bold text-center bg-green-50 py-1.5 rounded-lg border border-green-200">
                          ✓ Location Pinned: {detectedKm} km from Depot (Fee: ₦{currentDeliveryFee.toLocaleString()})
                        </p>
                      )
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Search Delivery Area</label>
                    <input 
                      type="text" 
                      placeholder="Type area name (e.g. Ajah, Sangotedo, Ikeja)..." 
                      className="w-full border border-orange-300 bg-orange-50/30 text-xs p-3 rounded-xl focus:outline-none font-medium"
                      value={searchQuery}
                      onChange={e => handleAddressSearch(e.target.value)}
                    />

                    {(addressSuggestions.length > 0 || searchLoading) && (
                      <div className="absolute z-50 left-0 right-0 top-[100%] mt-1 bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden max-h-[180px] overflow-y-auto">
                        {searchLoading && (
                          <div className="p-3 text-[11px] text-neutral-400 font-bold italic animate-pulse">
                            Searching mapped Lagos areas...
                          </div>
                        )}
                        {addressSuggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="p-3 text-[11px] font-medium text-neutral-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer border-b border-neutral-100 last:border-b-0 truncate"
                          >
                            {suggestion.display_name.replace(', Nigeria', '').replace(', West Africa', '')}
                          </div>
                        ))}
                      </div>
                    )}

                    {detectedKm && deliveryZone === 'outOfRange' && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-center space-y-1 mt-2">
                        <p className="text-xs font-black uppercase">⚠️ Out of Delivery Range ({detectedKm} km)</p>
                        <p className="text-[10px] font-medium leading-relaxed text-red-600">
                          Selected area exceeds 40 km from our Obalende depot. Please choose an address within Lagos or switch to <strong>"Self Pickup"</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Address Field */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                    Full Delivery Street Address <span className="text-orange-500">*</span>
                  </label>
                  <textarea 
                    required
                    rows="2"
                    placeholder="Enter exact street address, house number, estate name..." 
                    className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium resize-none"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Delivery / Pickup Notes */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                {deliveryMethod === 'pickup' ? 'Estimated Pickup Time & Special Notes' : 'Delivery Instructions / Landmarks'}
              </label>
              <input 
                type="text" 
                placeholder={deliveryMethod === 'pickup' ? "e.g. Picking up by 3:30 PM today" : "e.g. Call when at gate, leave at reception"}
                className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium"
                value={deliveryNotes}
                onChange={e => setDeliveryNotes(e.target.value)}
              />
            </div>

            {/* STEP 3 PAYMENT TRANSFER DETAILS DISPLAY */}
            <div className="bg-orange-50/90 border border-orange-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-orange-700 tracking-wider flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-current text-orange-600" viewBox="0 0 24 24">
                    <path d="M4 10h16v2H4zm0 4h16v2H4zm0-8h16v2H4zm-2 14h20V4H2v16zm2-14h16v12H4V6z"/>
                  </svg>
                  Payment Bank Account (Direct Transfer)
                </span>
                <span className="text-[10px] font-black text-neutral-600 uppercase">{BANK_ACCOUNT.bankName}</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div>
                  <p className="text-base font-mono font-black text-neutral-900 tracking-wider">{BANK_ACCOUNT.accountNumber}</p>
                  <p className="text-[11px] font-bold text-neutral-700 uppercase">{BANK_ACCOUNT.accountName}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyBankAccount}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1 shrink-0"
                >
                  {copiedBank ? "Copied!" : "Copy Acc"}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2 pt-2">
              <button 
                type="button"
                onClick={handleDownloadInvoice}
                disabled={deliveryZone === 'outOfRange'}
                className={`w-full font-black text-xs uppercase tracking-widest p-4 rounded-xl transition-all duration-300 transform active:scale-95 border-2 flex items-center justify-center gap-2 ${deliveryZone === 'outOfRange' ? 'bg-neutral-200 border-neutral-300 text-neutral-400 cursor-not-allowed' : (invoiceGenerated ? 'bg-neutral-100 border-neutral-300 text-neutral-500' : 'bg-white border-neutral-950 text-neutral-950 hover:bg-neutral-50')}`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                <span>{invoiceGenerated ? 'Invoice Downloaded Again' : 'Download Image Invoice'}</span>
              </button>

              <button 
                type="button"
                onClick={handleForwardToWhatsApp}
                disabled={deliveryZone === 'outOfRange'}
                className={`w-full font-black text-xs uppercase tracking-widest p-4 rounded-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${deliveryZone === 'outOfRange' ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' : 'bg-neutral-950 hover:bg-emerald-600 text-white'}`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M2.004 22l1.352-4.968A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.952 9.952 0 01-5.032-1.356L2.004 22zM8.391 7.308c-.18-.024-.361-.024-.541 0a1.05 1.05 0 00-.735.418c-.287.391-.818 1.341-.818 2.651 0 1.31.848 2.576.965 2.736.118.16 1.668 2.684 4.092 3.633 2.02.791 2.433.633 2.875.592.441-.04 1.418-.58 1.618-1.141.2-.56.2-1.041.14-1.141-.06-.1-.22-.16-.46-.281-.24-.12-1.015-.374-1.933-1.193-.715-.638-1.198-1.426-1.338-1.666-.14-.24-.015-.37.105-.49.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.781-.195-.468-.396-.404-.543-.411z"/></svg>
                <span>Forward Order to WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full text-neutral-400 font-bold text-xs uppercase tracking-wider py-2"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
