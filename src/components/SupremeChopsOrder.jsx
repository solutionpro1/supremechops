import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser'; // Integrated email notification library
import HeroSection from './HeroSection';
import MenuCatalog from './MenuCatalog';

import logoPng from '../assets/logo.png';

export default function SupremeChopsOrder() {
  const [siteLoading, setSiteLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('packs'); // Fixed to match your PDF master categories
  const [animatingCart, setAnimatingCart] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  
  // Comprehensive Professional Customer Input Coordinates
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Business Master Phone Target Number
  const WHATSAPP_NUMBER = "2347081241745";

  useEffect(() => {
    // CRUCIAL: Pre-authenticate your Public API key right when the app first renders
    emailjs.init('x9Cbvqg5TNeYJjv_Z'); 

    const timer = setTimeout(() => setSiteLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCartWithAnimation = (item, type, event) => {
    const uniqueId = `${type}-${item.id || item.name.replace(/\s+/g, '-').toLowerCase()}`;
    if (event && event.clientX && event.clientY) {
      const bubble = document.createElement('div');
      bubble.innerText = '🍢';
      bubble.className = 'fixed text-xl z-50 pointer-events-none transition-all duration-700 ease-in-out bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2';
      bubble.style.left = `${event.clientX}px`;
      bubble.style.top = `${event.clientY}px`;
      document.body.appendChild(bubble);

      const cartBadge = document.getElementById('cart-floating-trigger');
      const targetX = cartBadge ? cartBadge.getBoundingClientRect().left + 20 : window.innerWidth - 100;
      const targetY = cartBadge ? cartBadge.getBoundingClientRect().top + 20 : window.innerHeight - 100;

      setTimeout(() => {
        bubble.style.left = `${targetX}px`;
        bubble.style.top = `${targetY}px`;
        bubble.style.transform = 'scale(0.3) translate(-1/2, -1/2)';
        bubble.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        bubble.remove();
        setAnimatingCart(true);
        setTimeout(() => setAnimatingCart(false), 300);
      }, 750);
    }

    const existing = cart.find(cartItem => cartItem.uniqueId === uniqueId);
    if (existing) {
      setCart(cart.map(cartItem => cartItem.uniqueId === uniqueId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    } else {
      setCart([...cart, { uniqueId, name: item.name, price: item.price, quantity: 1 }]);
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

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // --- COMPREHENSIVE COMBINED INVOICE DISPATCH MACHINE ---
  const handleCheckoutViaWhatsApp = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your order sheet is completely empty!");
      return;
    }
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert("Please enter full delivery coordinates before submitting your request.");
      return;
    }

    // Capture precise local date and time parameters dynamically
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = currentDateTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

    // 1. --- GENERATE PHYSICAL JPG INVOICE VIA HTML5 CANVAS ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 760 + (cart.length * 52); // Fluid bounding size matching item counts dynamically

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ea580c'; // Supreme Chops International brand accent orange
    ctx.fillRect(0, 0, canvas.width, 24);

    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('SUPREME CHOPS INTERNATIONAL', 40, 75);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '13px sans-serif';
    ctx.fillText('Official Order Invoice Receipt', 40, 98);

    ctx.fillStyle = '#171717';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`Date: ${formattedDate}`, 420, 75);
    ctx.fillText(`Time: ${formattedTime}`, 420, 95);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 125); ctx.lineTo(560, 125); ctx.stroke();

    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('DELIVERY COORDINATES', 40, 155);

    ctx.fillStyle = '#171717';
    ctx.font = '14px sans-serif';
    ctx.fillText(`👤 Customer Name:  ${customerName}`, 40, 185);
    ctx.fillText(`📞 Primary Contact:    ${customerPhone}`, 40, 215);
    ctx.fillText(`☎️ Alternative No:     ${altPhone || 'None Provided'}`, 40, 245);
    ctx.fillText(`📍 Delivery Address:`, 40, 275);
    
    // Address wrapping rules context to cleanly map multi-line addresses
    ctx.fillStyle = '#404040';
    const words = deliveryAddress.split(' ');
    let line = '';
    let yCoord = 275;
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

    yCoord += 40;
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath(); ctx.moveTo(40, yCoord); ctx.lineTo(560, yCoord); ctx.stroke();
    
    yCoord += 30;
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('ORDER ITEMS MANIFEST', 40, yCoord);

    ctx.fillStyle = '#171717';
    ctx.font = '13px sans-serif';
    cart.forEach((item) => {
      yCoord += 42;
      ctx.fillStyle = '#171717';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${item.name} (x${item.quantity})`, 40, yCoord);
      
      ctx.textAlign = 'right';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`₦${(item.price * item.quantity).toLocaleString()}`, 560, yCoord);
      ctx.textAlign = 'left';
    });

    yCoord += 45;
    ctx.strokeStyle = '#a3a3a3';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(40, yCoord); ctx.lineTo(560, yCoord); ctx.stroke();
    ctx.setLineDash([]);

    yCoord += 40;
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
    ctx.fillText('Thank you for choosing Supreme Chops International! Your order invoice is generated.', 40, yCoord);

    // Prompt immediate file browser attachment download layer
    const imageURI = canvas.toDataURL('image/jpeg', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.download = `Invoice-${customerName.replace(/\s+/g, '-')}.jpg`;
    downloadLink.href = imageURI;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 2. --- TRANSMIT DATA BLUEPRINT VIA BACKGROUND EMAILJS PIPELINES ---
    const emailParams = {
      customer_name: customerName,
      customer_phone: customerPhone,
      alt_phone: altPhone || 'None Provided',
      delivery_address: deliveryAddress,
      date_time: `${formattedDate} at ${formattedTime}`,
      order_manifest: cart.map(item => `• ${item.name} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`).join('\n'),
      total_bill: `₦${calculateTotal().toLocaleString()}`
    };

    emailjs.send(
      'service_ff173go', 
      'template_j8rkxyd', 
      emailParams, 
      'x9Cbvqg5TNeYJjv_Z'
    )
    .then((res) => {
       console.log('Background serverless email notification dispatched successfully!', res.status, res.text);
    })
    .catch((err) => {
       console.error('Email tracking system encountered errors:', err);
    });

    // 3. --- PACKAGE INVOICE LOG TEXT AND REDIRECT WINDOW TO WHATSAPP ---
    const textManifest = cart.map(item => `• ${item.name} x${item.quantity}`).join('\n');
    const mobileWhatsAppMessage = `🧾 *SUPREME CHOPS INVOICE CODES*\n\n👤 *Client:* ${customerName}\n📞 *Phone:* ${customerPhone}\n📍 *Address:* ${deliveryAddress}\n📆 *Timestamp:* ${formattedDate} (${formattedTime})\n\n📦 *Order Manifest Summary:*\n${textManifest}\n\n💰 *Total Dues Total:* ₦${calculateTotal().toLocaleString()}\n\n_(Note: Attached matching invoice receipt JPG file auto-downloaded to device folder.)_`;

    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mobileWhatsAppMessage)}`;
    }, 800);
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

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none z-0 w-[500px] h-[500px] flex items-center justify-center">
        <img src={logoPng} alt="Watermark logo" className="w-full h-full object-contain grayscale" />
      </div>

      <div>
        <header className="bg-white/80 backdrop-blur-xl border-b border-neutral-200/40 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logoPng} alt="Supreme Chops Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-lg font-black text-neutral-900 tracking-tight leading-none uppercase">SUPREME CHOPS</h1>
                <p className="text-[9px] font-black tracking-widest text-orange-600 uppercase mt-1">International</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-orange-100">
                Lagos Instant Delivery 🟢
              </span>
            </div>
          </div>
        </header>

        <HeroSection onNavigateToCustomize={() => {
          setActiveTab('customize');
          document.getElementById('menu-catalog')?.scrollIntoView({ behavior: 'smooth' });
        }} />

        <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
          <div className="lg:col-span-2">
            <MenuCatalog 
              onAddToCart={handleAddToCartWithAnimation}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Desktop Right Hand Side Invoice Form Panel Layout */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white border border-neutral-200/60 rounded-3xl p-6 sticky top-28 shadow-xl space-y-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 border-b pb-3">🛒 Your Order Sheet</h3>
              
              {cart.length === 0 ? (
                <p className="text-xs text-neutral-400 py-12 text-center font-medium">Your basket is empty. Select items to construct your pack.</p>
              ) : (
                <>
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
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
                    <div className="flex justify-between text-sm font-black text-neutral-900 pt-1">
                      <span>Total Invoice:</span>
                      <span className="font-mono text-orange-600">₦{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Customer Coordination Form Layout */}
                  <form onSubmit={handleCheckoutViaWhatsApp} className="space-y-3.5 pt-2 border-t border-dashed">
                    <h4 className="text-[11px] font-black text-neutral-950 uppercase tracking-widest">📋 Delivery Coordinates</h4>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Your Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Olamide" 
                        className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Phone Number</label>
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
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Full Delivery Address</label>
                      <textarea 
                        required
                        rows="2"
                        placeholder="House block, street, town coordinates..." 
                        className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 font-medium resize-none"
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-neutral-950 hover:bg-green-600 text-white font-black text-xs uppercase tracking-widest p-4 rounded-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 mt-2"
                    >
                      <span>💾 Download & Open WhatsApp</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button for Mobile Users */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end lg:hidden">
        <button
          id="cart-floating-trigger"
          onClick={() => setMobileCartOpen(true)}
          className={`w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 relative border-2 border-white scale-100 ${animatingCart ? 'scale-125' : ''}`}
        >
          <span className="text-2xl">🛒</span>
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-neutral-950 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Slide-out Mobile Sheet Form View */}
      {mobileCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div onClick={() => setMobileCartOpen(false)} className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex justify-between items-center pb-4 border-b mb-6">
                <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider">🛒 Your Order Sheet</h3>
                <button onClick={() => setMobileCartOpen(false)} className="text-neutral-400 font-bold p-2 text-sm">✕ Close</button>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-neutral-400 py-12 text-center font-medium">Your basket is empty.</p>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1">
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
                          <button onClick={() => handleRemoveItem(item.uniqueId)} className="text-neutral-300 text-sm font-medium">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-neutral-500">
                      <span>Total Invoice:</span>
                      <span className="font-mono text-orange-600 font-black">₦{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <form onSubmit={handleCheckoutViaWhatsApp} className="space-y-3.5 pt-2 border-t border-dashed">
                    <h4 className="text-[11px] font-black text-neutral-950 uppercase tracking-widest">📋 Delivery Coordinates</h4>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Your Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Olamide" 
                        className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="0708..." 
                        className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Alternative Number</label>
                      <input 
                        type="tel" 
                        placeholder="Optional" 
                        className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl"
                        value={altPhone}
                        onChange={e => setAltPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Full Delivery Address</label>
                      <textarea 
                        required
                        rows="2"
                        placeholder="Delivery coordinates..." 
                        className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl resize-none"
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-neutral-950 hover:bg-green-600 text-white font-black text-xs uppercase tracking-widest p-4 rounded-xl mt-2"
                    >
                      <span>💾 Download & Open WhatsApp</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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
        <div className="max-w-7xl mx-auto px-6 text-center text-[11px] text-neutral-600 mt-16 pt-8 border-t border-neutral-900/60">
          &copy; 2026 Supreme Chops International. All rights reserved.
        </div>
      </footer>
    </div>
  );
}