import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import HeroSection from './HeroSection';
import MenuCatalog from './MenuCatalog';
import EventBooking from './EventBooking';
import FloatingSocials from './FloatingSocials';

import logoPng from '../assets/logo.png';

export default function SupremeChopsOrder() {
  const [currentPage, setCurrentPage] = useState('menu');
  const [siteLoading, setSiteLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('packs');
  
  const [glidingParticles, setGlidingParticles] = useState([]);
  const [isForSelf, setIsForSelf] = useState(true);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);

  const [deliveryZone, setDeliveryZone] = useState('zone1');
  const [detectedKm, setDetectedKm] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  const DEPOT_LAT = 6.438384;
  const DEPOT_LNG = 3.414441;

  const deliveryOptions = {
    zone1: { label: 'Zone 1: VI, Ikoyi, Lagos Island, Obalende Axis (1-7km)', fee: 1500 },
    zone2: { label: 'Zone 2: Lekki Phase 1 down to Ikate (8-15km)', fee: 2500 },
    zone3: { label: 'Zone 3: Extended Lagos Axis / Mainland (>15km)', fee: 5000 }
  };

  const currentDeliveryFee = deliveryOptions[deliveryZone].fee;
  const WHATSAPP_NUMBER = "2347081241745";

  useEffect(() => {
    emailjs.init('x9Cbvqg5TNeYJjv_Z'); 
    const timer = setTimeout(() => setSiteLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser device profile.");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const distance = calculateGpsDistance(DEPOT_LAT, DEPOT_LNG, userLat, userLng);
        const roundedDistance = Math.round(distance * 10) / 10;
        setDetectedKm(roundedDistance);

        if (roundedDistance <= 7) {
          setDeliveryZone('zone1');
        } else if (roundedDistance > 7 && roundedDistance <= 15) {
          setDeliveryZone('zone2');
        } else {
          setDeliveryZone('zone3');
        }

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}&zoom=18&addressdetails=1`);
          const data = await response.json();
          if (data && data.display_name) {
            const cleanAddress = data.display_name.replace(', Nigeria', '').replace(', West Africa', '');
            setDeliveryAddress(cleanAddress);
          }
        } catch (err) {
          console.error("Address lookup failed:", err);
        }
        
        setGpsLoading(false);
      },
      (error) => {
        console.error("GPS lock failed:", error);
        alert("Unable to pinpoint live coordinates. Please type your address manually.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  const handleAddressInputChange = (value) => {
    setDeliveryAddress(value);

    if (!value || value.length < 3 || isForSelf) {
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
    }, 600);
  };

  const handleSelectSuggestion = (suggestion) => {
    const cleanLabel = suggestion.display_name.replace(', Nigeria', '').replace(', West Africa', '');
    setDeliveryAddress(cleanLabel);
    setAddressSuggestions([]);

    if (suggestion.lat && suggestion.lon) {
      const targetLat = parseFloat(suggestion.lat);
      const targetLng = parseFloat(suggestion.lon);
      
      const distance = calculateGpsDistance(DEPOT_LAT, DEPOT_LNG, targetLat, targetLng);
      const roundedDistance = Math.round(distance * 10) / 10;
      setDetectedKm(roundedDistance);

      if (roundedDistance <= 7) {
        setDeliveryZone('zone1');
      } else if (roundedDistance > 7 && roundedDistance <= 15) {
        setDeliveryZone('zone2');
      } else {
        setDeliveryZone('zone3');
      }
    }
  };

  const handleAddToCartWithAnimation = (item, type, event) => {
    const uniqueId = `${type}-${item.id || item.name.replace(/\s+/g, '-').toLowerCase()}`;
    const existing = cart.find(cartItem => cartItem.uniqueId === uniqueId);
    
    if (existing) {
      setCart(cart.map(cartItem => cartItem.uniqueId === uniqueId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    } else {
      setCart([...cart, { uniqueId, name: item.name, price: item.price, quantity: 1 }]);
    }

    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      const newParticle = {
        id: Date.now(),
        startX,
        startY
      };

      setGlidingParticles(prev => [...prev, newParticle]);

      setTimeout(() => {
        setGlidingParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 700);
    }
  };

  const updateQuantity = (uniqueId, amount) => {
    setCart(cart.map(item => {
      if (item.uniqueId === uniqueId) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleRemoveItem = (uniqueId) => {
    setCart(cart.filter(item => item.uniqueId !== uniqueId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + currentDeliveryFee;
  };

  const scrollToCartSection = () => {
    const orderPanel = document.getElementById('order-summary-panel');
    if (orderPanel) {
      orderPanel.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadInvoice = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your order sheet is completely empty!");
      return;
    }
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert("Please enter full delivery coordinates before generating your document.");
      return;
    }

    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = currentDateTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 880 + (cart.length * 52);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ea580c'; 
    ctx.fillRect(0, 0, canvas.width, 24);

    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('SUPREME CHOPS INTERNATIONAL', 40, 75);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '13px sans-serif';
    ctx.fillText('Official Order Invoice Receipt (Depot: Obalende)', 40, 98);

    ctx.fillStyle = '#171717';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`Date: ${formattedDate}`, 420, 75);
    ctx.fillText(`Time: ${formattedTime}`, 420, 95);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 125); ctx.lineTo(560, 125); ctx.stroke();

    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('DELIVERY COORDINATES & LOGISTICS PROFILE', 40, 155);

    ctx.fillStyle = '#171717';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Order Target:     ${isForSelf ? 'For Myself (Self Handover)' : 'For Someone Else (Gift/Recipient Dispatch)'}`, 40, 185);
    ctx.fillText(`Name Profile:     ${customerName}`, 40, 215);
    ctx.fillText(`Primary Contact:  ${customerPhone}`, 40, 245);
    ctx.fillText(`Alternative No:   ${altPhone || 'None Provided'}`, 40, 275);
    ctx.fillText(`Delivery Address:`, 40, 305);
    
    ctx.fillStyle = '#404040';
    const words = deliveryAddress.split(' ');
    let line = '';
    let yCoord = 305;
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > 360 && n > 0) {
        ctx.fillText(line, 180, yCoord);
        line = words[n] + ' ';
        yCoord += 22;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 180, yCoord);

    yCoord += 35;
    ctx.fillStyle = '#171717';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`Axis: ${deliveryOptions[deliveryZone].label}`, 40, yCoord);
    if (detectedKm) {
      yCoord += 20;
      ctx.fillText(`Distance Calculated: ${detectedKm} km from Obalende Hub`, 40, yCoord);
    }

    yCoord += 30;
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath(); ctx.moveTo(40, yCoord); ctx.lineTo(560, yCoord); ctx.stroke();
    
    yCoord += 30;
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('ORDER ITEMS MANIFEST', 40, yCoord);

    cart.forEach((item) => {
      yCoord += 40;
      ctx.fillStyle = '#171717';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${item.name} (x${item.quantity})`, 40, yCoord);
      ctx.textAlign = 'right';
      ctx.fillText(`₦${(item.price * item.quantity).toLocaleString()}`, 560, yCoord);
      ctx.textAlign = 'left';
    });

    yCoord += 45;
    ctx.strokeStyle = '#a3a3a3';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(40, yCoord); ctx.lineTo(560, yCoord); ctx.stroke();
    ctx.setLineDash([]);

    yCoord += 35;
    ctx.fillStyle = '#525252';
    ctx.font = '13px sans-serif';
    ctx.fillText('Items Subtotal:', 40, yCoord);
    ctx.textAlign = 'right';
    ctx.fillText(`₦${calculateSubtotal().toLocaleString()}`, 560, yCoord);
    ctx.textAlign = 'left';

    yCoord += 28;
    ctx.fillStyle = '#525252';
    ctx.font = '13px sans-serif';
    ctx.fillText('Delivery Fee:', 40, yCoord);
    ctx.textAlign = 'right';
    ctx.fillText(`₦${currentDeliveryFee.toLocaleString()}`, 560, yCoord);
    ctx.textAlign = 'left';

    yCoord += 35;
    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('TOTAL DUE:', 40, yCoord);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`₦${calculateTotal().toLocaleString()}`, 560, yCoord);
    ctx.textAlign = 'left';

    yCoord += 50;
    ctx.fillStyle = '#9ca3af';
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText('Thank you for choosing Supreme Chops International! Order invoice generated.', 40, yCoord);

    const imageURI = canvas.toDataURL('image/jpeg', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.download = `Invoice-${customerName.replace(/\s+/g, '-')}.jpg`;
    downloadLink.href = imageURI;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    const emailParams = {
      customer_name: customerName,
      customer_phone: customerPhone,
      alt_phone: altPhone || 'None Provided',
      delivery_address: `[${isForSelf ? 'ORDER FOR SELF' : 'ORDER FOR SOMEONE ELSE'}] ${deliveryAddress}`,
      delivery_zone: `${deliveryOptions[deliveryZone].label} ${detectedKm ? `(${detectedKm}km)` : ''}`,
      delivery_fee: `₦${currentDeliveryFee.toLocaleString()}`,
      date_time: `${formattedDate} at ${formattedTime}`,
      order_manifest: cart.map(item => `• ${item.name} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`).join('\n'),
      total_bill: `₦${calculateTotal().toLocaleString()}`
    };
    emailjs.send('service_ff173go', 'template_j8rkxyd', emailParams, 'x9Cbvqg5TNeYJjv_Z').catch((err) => console.error(err));

    setInvoiceGenerated(true);
    alert("Invoice downloaded! Click the green button below to push details directly to WhatsApp.");
  };

  const handleForwardToWhatsApp = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your order sheet is completely empty!");
      return;
    }
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert("Please enter full delivery coordinates before routing to WhatsApp.");
      return;
    }

    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = currentDateTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

    const textManifest = cart.map(item => `- ${item.name} x${item.quantity}`).join('\n');
    const mobileWhatsAppMessage = `*SUPREME CHOPS ORDER REQUEST*\n\n*Order Target:* ${isForSelf ? 'For Myself' : 'For Someone Else'}\n*Name/Recipient:* ${customerName}\n*Phone Number:* ${customerPhone}\n*Alternative No:* ${altPhone || 'None'}\n*Delivery Address:* ${deliveryAddress}\n*Delivery Area:* ${deliveryOptions[deliveryZone].label}${detectedKm ? ` (${detectedKm}km calculated)` : ''}\n*Timestamp:* ${formattedDate} at ${formattedTime}\n\n*Order Items Summary:*\n${textManifest}\n\n*Items Subtotal:* NGN ${calculateSubtotal().toLocaleString()}\n*Delivery Fee:* NGN ${currentDeliveryFee.toLocaleString()}\n*Grand Total Due:* NGN ${calculateTotal().toLocaleString()}\n\n(Note: Custom image invoice receipt has been downloaded onto device storage.)`;

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mobileWhatsAppMessage)}`;
  };

  if (siteLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <img src={logoPng} alt="Supreme Chops" className="w-20 h-20 object-contain animate-pulse" />
        <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-orange-600 w-1/2 animate-infinite-loading rounded-full"></div>
        </div>
        <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase">Loading Menu Portal...</p>
      </div>
    );
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      
      {/* GLIDING PARTICLES CONTAINER */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {glidingParticles.map(particle => (
          <div
            key={particle.id}
            className="fixed w-4 h-4 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 animate-glide-to-cart"
            style={{
              '--start-x': `${particle.startX}px`,
              '--start-y': `${particle.startY}px`
            }}
          />
        ))}
      </div>

      <div>
        {/* HEADER BAR */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/40 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div 
              onClick={() => setCurrentPage('menu')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img src={logoPng} alt="Supreme Chops Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-lg font-black text-neutral-900 tracking-tight leading-none uppercase">SUPREME CHOPS</h1>
                <p className="text-[9px] font-black tracking-widest text-orange-600 uppercase mt-1">International</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setCurrentPage('event')}
                className={`text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all duration-300 transform active:scale-95 ${
                  currentPage === 'event'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                    : 'bg-neutral-900 text-white border-neutral-800 hover:bg-orange-600'
                }`}
              >
                🎉 Book Us For Events
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {currentPage === 'event' ? (
          <EventBooking onBackToMenu={() => setCurrentPage('menu')} />
        ) : (
          <>
            <HeroSection onNavigateToCustomize={() => {
              setActiveTab('customize');
              document.getElementById('menu-catalog')?.scrollIntoView({ behavior: 'smooth' });
            }} />

            <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
              <div className="lg:col-span-2">
                <MenuCatalog onAddToCart={handleAddToCartWithAnimation} activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>

              <div id="order-summary-panel" className="lg:col-span-1">
                <div className="bg-white border border-neutral-200/60 rounded-3xl p-6 sticky top-28 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-600 fill-current" viewBox="0 0 24 24">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                      Your Order Sheet
                    </h3>
                    {cart.length > 0 && (
                      <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        {totalCartCount} Items
                      </span>
                    )}
                  </div>
                  
                  {cart.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-12 text-center font-medium">Your basket is empty. Select items to construct your pack.</p>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-[190px] overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div key={item.uniqueId} className="flex justify-between items-center text-xs border-b border-neutral-100 pb-3">
                            <div className="space-y-0.5 max-w-[65%]">
                              <p className="font-bold text-neutral-800 truncate">{item.name}</p>
                              <p className="text-neutral-400 font-mono">₦{item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <div className="flex items-center bg-neutral-100 rounded-lg">
                                <button onClick={() => updateQuantity(item.uniqueId, -1)} className="px-2 py-1 font-bold text-neutral-500 text-sm">-</button>
                                <span className="px-1 text-xs font-black font-mono text-neutral-800">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.uniqueId, 1)} className="px-2 py-1 font-bold text-neutral-500 text-sm">+</button>
                              </div>
                              <button onClick={() => handleRemoveItem(item.uniqueId)} className="text-neutral-300 hover:text-red-500 text-sm font-medium">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-neutral-500">
                          <span>Items Subtotal:</span>
                          <span className="font-mono">₦{calculateSubtotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-neutral-500">
                          <span>Delivery Fee:</span>
                          <span className="font-mono">₦{currentDeliveryFee.toLocaleString()}</span>
                        </div>
                        {detectedKm && (
                          <div className="text-[10px] text-green-600 font-bold tracking-wide flex items-center gap-1">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            Calculated Distance: {detectedKm}km from Depot Hub
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t">
                          <span>Total Invoice:</span>
                          <span className="font-mono text-orange-600">₦{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-3.5 pt-2 border-t border-dashed">
                        <h4 className="text-[11px] font-black text-neutral-950 uppercase tracking-widest">Delivery Coordinates</h4>
                        
                        <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl border">
                          <button 
                            type="button"
                            onClick={() => {
                              setIsForSelf(true);
                              setDeliveryAddress('');
                              setDetectedKm(null);
                              setAddressSuggestions([]);
                            }}
                            className={`text-center py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${isForSelf ? 'bg-white text-orange-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                          >
                            For Myself
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              setIsForSelf(false);
                              setDeliveryAddress('');
                              setDetectedKm(null);
                            }}
                            className={`text-center py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${!isForSelf ? 'bg-white text-orange-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                          >
                            For Someone Else
                          </button>
                        </div>

                        {isForSelf ? (
                          <button 
                            type="button"
                            onClick={handleAutoDetectLocation}
                            className="w-full border border-orange-500 bg-orange-50/50 hover:bg-orange-50 text-orange-600 font-black text-[11px] uppercase tracking-wider p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
                            <span>{gpsLoading ? 'Pinning Location Coordinates...' : 'Click to Pin My Live Location'}</span>
                          </button>
                        ) : (
                          <div className="p-3 bg-neutral-50 border border-neutral-200 text-neutral-500 text-[10px] rounded-xl font-medium leading-relaxed">
                            Search address metrics and choose axis zones manually below.
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                            {isForSelf ? 'Your Full Name' : "Recipient's Full Name"}
                          </label>
                          <input 
                            required
                            type="text" 
                            placeholder={isForSelf ? "e.g. Olamide" : "Recipient name"} 
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
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Delivery Axis / Zone</label>
                          <select 
                            className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium cursor-pointer"
                            value={deliveryZone}
                            onChange={e => setDeliveryZone(e.target.value)}
                          >
                            <option value="zone1">Zone 1: VI, Ikoyi, Lagos Island, Obalende (1-7km) — ₦1,500</option>
                            <option value="zone2">Zone 2: Lekki Phase 1 to Ikate (8-15km) — ₦2,500</option>
                            <option value="zone3">Zone 3: Extended Axis / Mainland (&gt;15km) — ₦5,000</option>
                          </select>
                        </div>

                        <div className="space-y-1 relative">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                            {isForSelf ? 'Detected Delivery Address' : 'Search & Select Delivery Address'}
                          </label>
                          <textarea 
                            required
                            rows="2"
                            placeholder={isForSelf ? "Click the pin button above to fetch address string..." : "Type street name, estate, or building landmarks here..."} 
                            className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium resize-none"
                            value={deliveryAddress}
                            onChange={e => handleAddressInputChange(e.target.value)}
                          />

                          {!isForSelf && (addressSuggestions.length > 0 || searchLoading) && (
                            <div className="absolute z-50 left-0 right-0 top-[100%] mt-1 bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden max-h-[200px] overflow-y-auto">
                              {searchLoading && (
                                <div className="p-3 text-[11px] text-neutral-400 font-bold italic animate-pulse">
                                  Searching mapped grid indices...
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
                        </div>

                        <div className="grid grid-cols-1 gap-2 pt-2">
                          <button 
                            type="button"
                            onClick={handleDownloadInvoice}
                            className={`w-full font-black text-xs uppercase tracking-widest p-4 rounded-xl transition-all duration-300 transform active:scale-95 border-2 flex items-center justify-center gap-2 ${invoiceGenerated ? 'bg-neutral-100 border-neutral-300 text-neutral-500' : 'bg-white border-neutral-950 text-neutral-950 hover:bg-neutral-50'}`}
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                            <span>{invoiceGenerated ? 'Invoice Downloaded Again' : 'Download Image Invoice'}</span>
                          </button>

                          <button 
                            type="button"
                            onClick={handleForwardToWhatsApp}
                            className="w-full bg-neutral-950 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest p-4 rounded-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M2.004 22l1.352-4.968A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.952 9.952 0 01-5.032-1.356L2.004 22zM8.391 7.308c-.18-.024-.361-.024-.541 0a1.05 1.05 0 00-.735.418c-.287.391-.818 1.341-.818 2.651 0 1.31.848 2.576.965 2.736.118.16 1.668 2.684 4.092 3.633 2.02.791 2.433.633 2.875.592.441-.04 1.418-.58 1.618-1.141.2-.56.2-1.041.14-1.141-.06-.1-.22-.16-.46-.281-.24-.12-1.418-.701-1.638-.781-.22-.08-.38-.12-.54.12-.16.24-.62.781-.76.941-.14.16-.28.18-.52.06-.24-.12-1.015-.374-1.933-1.193-.715-.638-1.198-1.426-1.338-1.666-.14-.24-.015-.37.105-.49.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.781-.195-.468-.396-.404-.543-.411z"/></svg>
                            <span>Forward Order to WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </>
        )}
      </div>

      {/* FLOATING SOCIALS - BOTTOM RIGHT */}
      <FloatingSocials />

      {/* FLOATING BOTTOM-LEFT CART BUBBLE */}
      {currentPage === 'menu' && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={scrollToCartSection}
            className="group relative bg-neutral-950 hover:bg-orange-600 text-white p-4 rounded-2xl shadow-2xl border border-neutral-800 hover:border-orange-500 transition-all duration-300 transform active:scale-90 flex items-center gap-3"
          >
            <div className="relative">
              <svg className="w-6 h-6 fill-current text-orange-400 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>

              {totalCartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-orange-600 group-hover:bg-neutral-950 text-white font-mono text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                  {totalCartCount}
                </span>
              )}
            </div>

            <div className="text-left hidden sm:block">
              <p className="text-[9px] font-black uppercase text-neutral-400 group-hover:text-orange-100 tracking-wider">Your Pack</p>
              <p className="text-xs font-mono font-extrabold text-white">
                {totalCartCount === 0 ? 'Empty' : `₦${calculateSubtotal().toLocaleString()}`}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-neutral-950 text-neutral-400 text-xs py-16 mt-32 border-t border-neutral-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-4">
            <img src={logoPng} alt="Supreme Chops" className="w-12 h-12 object-contain bg-white rounded-xl p-1" />
            <h4 className="text-white font-black text-base uppercase">Supreme Chops</h4>
            <p className="text-neutral-500 leading-relaxed text-[13px]"> Premium gourmet catering across Lagos state. </p>
          </div>
          <div className="space-y-3 text-[13px]">
            <h4 className="text-white font-black text-sm uppercase mb-2">Contacts</h4>
            <p>📧 <span className="text-neutral-300">supremechops777@gmail.com</span></p>
            <p>📞 <span className="text-neutral-300">+234 708 124 1745</span></p>
            <p className="text-neutral-500">📍 26 Moshalashi Street, Ikoyi Obalende, Lagos</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase">Locator Map</h4>
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <iframe 
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.654631317188!2d3.414441575874254!3d6.438384224151701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8ad561dd83a9%3A0x6bba3bc7441113ad!2sMoshalashi%20St%2C%20Obalende%2C%20Lagos!5e0!3m2!1sen!2sng!4v1710000000000!5m2!1sen!2sng"
                className="w-full h-full border-0 opacity-80 grayscale invert"
                allowFullScreen="" 
                loading="lazy" 
              ></iframe>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-600 mt-16 pt-8 border-t border-neutral-900/60">
          <div>
            &copy; 2026 Supreme Chops International. All rights reserved.
          </div>
          <div className="font-black tracking-wider uppercase text-neutral-500 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800/60">
            ⚡ Engineered by <span className="text-orange-500">SolutionPRO Technologies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
