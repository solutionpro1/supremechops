import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import HeroSection from './HeroSection';
import MenuCatalog from './MenuCatalog';
import EventBooking from './EventBooking';
import Gallery from './Gallery';
import FloatingSocials from './FloatingSocials';
import CheckoutWizard from './CheckoutWizard';
import { HoursNoticeModal } from './HoursNoticeModal';

import logoPng from '../assets/logo.png';

export default function SupremeChopsOrder() {
  const [currentPage, setCurrentPage] = useState('menu');
  const [siteLoading, setSiteLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('packs');
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [glidingParticles, setGlidingParticles] = useState([]);
  const [isForSelf, setIsForSelf] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState('dispatch'); 

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [deliveryZone, setDeliveryZone] = useState('none');
  const [detectedKm, setDetectedKm] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  // UPDATED MONIEPOINT BANK DETAILS
  const BANK_ACCOUNT = {
    bankName: "Moniepoint",
    accountNumber: "6716087077",
    accountName: "SUPREME CHOPS INTERNATIONAL"
  };

  const deliveryOptions = {
    none: { label: 'Pending Pin / Pickup', fee: 0 },
    tier1: { label: '1 - 5 km Axis', fee: 1500 },
    tier2: { label: '6 - 10 km Axis', fee: 3000 },
    tier3: { label: '11 - 15 km Axis', fee: 4500 },
    tier4: { label: '16 - 20 km Axis', fee: 6000 },
    tier5: { label: '21 - 25 km Axis', fee: 7500 },
    tier6: { label: '26 - 30 km Axis', fee: 10000 },
    tier7: { label: '31 - 35 km Axis', fee: 13000 },
    tier8: { label: '36 - 40 km Axis', fee: 15000 },
    outOfRange: { label: 'Out of Delivery Range (>40km)', fee: 0 }
  };

  const currentDeliveryFee = deliveryMethod === 'pickup' ? 0 : (deliveryOptions[deliveryZone]?.fee || 0);
  const WHATSAPP_NUMBER = "2347081241745";

  useEffect(() => {
    emailjs.init('x9Cbvqg5TNeYJjv_Z'); 
    const timer = setTimeout(() => setSiteLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const triggerPageChange = (targetPage, callback) => {
    setIsMobileMenuOpen(false);
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPage(targetPage);
      if (callback) callback();
      setTransitioning(false);
    }, 600);
  };

  const handleNavClick = (target) => {
    setIsMobileMenuOpen(false);
    if (target === 'home') {
      triggerPageChange('menu', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else if (target === 'menu') {
      triggerPageChange('menu', () => {
        document.getElementById('menu-catalog')?.scrollIntoView({ behavior: 'smooth' });
      });
    } else if (target === 'customize') {
      triggerPageChange('menu', () => {
        setActiveTab('customize');
        document.getElementById('menu-catalog')?.scrollIntoView({ behavior: 'smooth' });
      });
    } else if (target === 'event') {
      triggerPageChange('event');
    } else if (target === 'gallery') {
      triggerPageChange('gallery');
    } else if (target === 'contact') {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ behavior: 'smooth' });
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

  const handleOpenCartModal = () => {
    triggerPageChange('menu', () => {
      setIsCartModalOpen(true);
    });
  };

  const generateOrderRef = () => {
    return `SC-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleDownloadInvoice = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your order sheet is completely empty!");
      return;
    }
    if (!customerName || !customerPhone || (!deliveryAddress && deliveryMethod !== 'pickup')) {
      alert("Please enter full delivery coordinates before generating your document.");
      return;
    }

    const orderRefCode = generateOrderRef();
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = currentDateTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 980 + (cart.length * 52);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ea580c'; 
    ctx.fillRect(0, 0, canvas.width, 24);

    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('SUPREME CHOPS INTERNATIONAL', 40, 75);
    
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`ORDER REF: ${orderRefCode}`, 420, 75);

    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.fillText('Official Order Invoice Receipt (Depot: Obalende)', 40, 98);
    ctx.fillText(`Date: ${formattedDate} at ${formattedTime}`, 420, 98);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 120); ctx.lineTo(560, 120); ctx.stroke();

    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('FULFILLMENT & LOGISTICS PROFILE', 40, 145);

    ctx.fillStyle = '#171717';
    ctx.font = '13px sans-serif';
    ctx.fillText(`Fulfillment:     ${deliveryMethod === 'pickup' ? 'Self Pickup (Obalende Depot)' : 'Doorstep Delivery'}`, 40, 175);
    ctx.fillText(`Order Target:     ${isForSelf ? 'For Myself' : 'For Someone Else'}`, 40, 200);
    ctx.fillText(`Name Profile:     ${customerName}`, 40, 225);
    ctx.fillText(`Primary Contact:  ${customerPhone}`, 40, 250);
    ctx.fillText(`Alternative No:   ${altPhone || 'None Provided'}`, 40, 275);
    
    let yCoord = 300;
    if (deliveryMethod === 'pickup') {
      ctx.fillText(`Pickup Depot:     26 Moshalashi Street, Ikoyi Obalende, Lagos`, 40, yCoord);
    } else {
      ctx.fillText(`Delivery Address:`, 40, yCoord);
      ctx.fillStyle = '#404040';
      const words = deliveryAddress.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > 360 && n > 0) {
          ctx.fillText(line, 180, yCoord);
          line = words[n] + ' ';
          yCoord += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 180, yCoord);
    }

    if (deliveryNotes) {
      yCoord += 22;
      ctx.fillStyle = '#171717';
      ctx.fillText(`Landmark / Notes: ${deliveryNotes}`, 40, yCoord);
    }

    yCoord += 30;
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('PAYMENT BANK DETAILS (DIRECT TRANSFER)', 40, yCoord);

    yCoord += 22;
    ctx.fillStyle = '#171717';
    ctx.font = '13px sans-serif';
    ctx.fillText(`Bank: ${BANK_ACCOUNT.bankName}  |  Acc No: ${BANK_ACCOUNT.accountNumber}  |  Name: ${BANK_ACCOUNT.accountName}`, 40, yCoord);

    yCoord += 30;
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath(); ctx.moveTo(40, yCoord); ctx.lineTo(560, yCoord); ctx.stroke();
    
    yCoord += 28;
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('ORDER ITEMS MANIFEST', 40, yCoord);

    cart.forEach((item) => {
      yCoord += 38;
      ctx.fillStyle = '#171717';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${item.name} (x${item.quantity})`, 40, yCoord);
      ctx.textAlign = 'right';
      ctx.fillText(`₦${(item.price * item.quantity).toLocaleString()}`, 560, yCoord);
      ctx.textAlign = 'left';
    });

    yCoord += 40;
    ctx.strokeStyle = '#a3a3a3';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(40, yCoord); ctx.lineTo(560, yCoord); ctx.stroke();
    ctx.setLineDash([]);

    yCoord += 32;
    ctx.fillStyle = '#525252';
    ctx.font = '13px sans-serif';
    ctx.fillText('Items Subtotal:', 40, yCoord);
    ctx.textAlign = 'right';
    ctx.fillText(`₦${calculateSubtotal().toLocaleString()}`, 560, yCoord);
    ctx.textAlign = 'left';

    yCoord += 25;
    ctx.fillStyle = '#525252';
    ctx.font = '13px sans-serif';
    ctx.fillText('Delivery Fee:', 40, yCoord);
    ctx.textAlign = 'right';
    ctx.fillText(deliveryMethod === 'pickup' ? "FREE (Self Pickup)" : `₦${currentDeliveryFee.toLocaleString()}`, 560, yCoord);
    ctx.textAlign = 'left';

    yCoord += 32;
    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('TOTAL DUE:', 40, yCoord);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`₦${calculateTotal().toLocaleString()}`, 560, yCoord);
    ctx.textAlign = 'left';

    yCoord += 45;
    ctx.fillStyle = '#9ca3af';
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText('Thank you for choosing Supreme Chops International! Order invoice generated.', 40, yCoord);

    const imageURI = canvas.toDataURL('image/jpeg', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.download = `Invoice-${orderRefCode}-${customerName.replace(/\s+/g, '-')}.jpg`;
    downloadLink.href = imageURI;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    const emailParams = {
      order_ref: orderRefCode,
      customer_name: customerName,
      customer_phone: customerPhone,
      alt_phone: altPhone || 'None Provided',
      delivery_address: deliveryMethod === 'pickup' ? '[SELF PICKUP] 26 Moshalashi Street, Ikoyi Obalende, Lagos' : `[DELIVERY] ${deliveryAddress} ${deliveryNotes ? `(Notes: ${deliveryNotes})` : ''}`,
      delivery_zone: deliveryMethod === 'pickup' ? 'Self Pickup (Free)' : `${deliveryOptions[deliveryZone]?.label || 'Standard'} ${detectedKm ? `(${detectedKm}km)` : ''}`,
      delivery_fee: deliveryMethod === 'pickup' ? 'FREE' : `₦${currentDeliveryFee.toLocaleString()}`,
      date_time: `${formattedDate} at ${formattedTime}`,
      order_manifest: cart.map(item => `• ${item.name} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`).join('\n'),
      total_bill: `₦${calculateTotal().toLocaleString()}`
    };
    emailjs.send('service_ff173go', 'template_j8rkxyd', emailParams, 'x9Cbvqg5TNeYJjv_Z').catch((err) => console.error(err));

    setInvoiceGenerated(true);
    alert(`Invoice ${orderRefCode} downloaded! Click the green button below to route details directly to WhatsApp.`);
  };

  const handleForwardToWhatsApp = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your order sheet is completely empty!");
      return;
    }
    if (!customerName || !customerPhone || (!deliveryAddress && deliveryMethod !== 'pickup')) {
      alert("Please enter full delivery coordinates before routing to WhatsApp.");
      return;
    }

    const orderRefCode = generateOrderRef();
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = currentDateTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

    const textManifest = cart.map(item => `- ${item.name} x${item.quantity}`).join('\n');
    
    const mobileWhatsAppMessage = `*SUPREME CHOPS ORDER REQUEST*\n` +
      `*Order Ref Code:* ${orderRefCode}\n\n` +
      `*Fulfillment Method:* ${deliveryMethod === 'pickup' ? '🏪 Self Pickup at Obalende Depot' : '🛵 Doorstep Delivery'}\n` +
      `*Order Target:* ${isForSelf ? 'For Myself' : 'For Someone Else'}\n` +
      `*Name/Recipient:* ${customerName}\n` +
      `*Phone Number:* ${customerPhone}\n` +
      `*Alternative No:* ${altPhone || 'None'}\n` +
      `*Address/Depot:* ${deliveryMethod === 'pickup' ? '26 Moshalashi Street, Ikoyi Obalende, Lagos' : deliveryAddress}\n` +
      `*Landmark/Notes:* ${deliveryNotes || 'None'}\n` +
      `*Timestamp:* ${formattedDate} at ${formattedTime}\n\n` +
      `*Order Items Summary:*\n${textManifest}\n\n` +
      `*Items Subtotal:* NGN ${calculateSubtotal().toLocaleString()}\n` +
      `*Delivery Fee:* ${deliveryMethod === 'pickup' ? 'FREE' : `NGN ${currentDeliveryFee.toLocaleString()}`}\n` +
      `*Grand Total Due:* NGN ${calculateTotal().toLocaleString()}\n\n` +
      `*Payment Transfer Account:*\nBank: ${BANK_ACCOUNT.bankName}\nAcc No: ${BANK_ACCOUNT.accountNumber}\nAcc Name: ${BANK_ACCOUNT.accountName}\n\n` +
      `(Note: Image invoice receipt generated on device.)`;

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mobileWhatsAppMessage)}`;
  };

  if (siteLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <img src={logoPng} alt="Supreme Chops" className="w-28 h-28 object-contain animate-pulse drop-shadow-2xl" />
      </div>
    );
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      
      {/* PAGE SWITCH TRANSITION OVERLAY */}
      {transitioning && (
        <div className="fixed inset-0 bg-neutral-950/90 backdrop-blur-xl z-[200] flex items-center justify-center transition-opacity duration-300">
          <img src={logoPng} alt="Supreme Chops" className="w-24 h-24 object-contain animate-pulse" />
        </div>
      )}

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
        {/* HEADER BAR WITH HAMBURGER MENU BUTTON */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/40 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            {/* Logo Brand */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img src={logoPng} alt="Supreme Chops Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-lg font-black text-neutral-900 tracking-tight leading-none uppercase">SUPREME CHOPS</h1>
                <p className="text-[9px] font-black tracking-widest text-orange-600 uppercase mt-1">International</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-wider text-neutral-700">
              <button onClick={() => handleNavClick('home')} className="hover:text-orange-600 transition-colors">Home</button>
              <button onClick={() => handleNavClick('menu')} className="hover:text-orange-600 transition-colors">Order Menu</button>
              <button onClick={() => handleNavClick('customize')} className="hover:text-orange-600 transition-colors">Customize Pack</button>
              <button onClick={() => handleNavClick('event')} className="hover:text-orange-600 transition-colors">Events</button>
              <button onClick={() => handleNavClick('gallery')} className="hover:text-orange-600 transition-colors">Gallery</button>
              <button onClick={() => handleNavClick('contact')} className="hover:text-orange-600 transition-colors">Contact</button>
            </nav>

            {/* Header Right Action & Hamburger Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => triggerPageChange('event')}
                className="hidden sm:flex text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border bg-neutral-900 text-white border-neutral-800 hover:bg-orange-600 transition-all duration-300 transform active:scale-95 items-center gap-2"
              >
                <svg className="w-4 h-4 fill-current text-amber-400" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
                </svg>
                <span>Book Events</span>
              </button>

              {/* HAMBURGER BUTTON */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl transition-all duration-200 transform active:scale-90"
                aria-label="Toggle Menu"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  ) : (
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* SLIDE-OVER MOBILE HAMBURGER NAVIGATION DRAWER */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[180] bg-neutral-950/80 backdrop-blur-md flex justify-end animate-fade-in">
            <div className="w-4/5 max-w-sm bg-neutral-950 text-white h-full p-6 space-y-8 flex flex-col justify-between border-l border-neutral-800 shadow-2xl">
              <div>
                <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2">
                    <img src={logoPng} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="font-black text-sm uppercase tracking-wider text-white">Supreme Chops</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 bg-neutral-900 hover:bg-neutral-800 rounded-full text-neutral-400 font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <nav className="space-y-3 pt-6">
                  <button
                    onClick={() => handleNavClick('home')}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-neutral-900 text-sm font-black uppercase tracking-wider text-neutral-200 hover:text-orange-500 transition-colors flex items-center justify-between"
                  >
                    <span>Home</span>
                    <span className="text-neutral-600">→</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('menu')}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-neutral-900 text-sm font-black uppercase tracking-wider text-neutral-200 hover:text-orange-500 transition-colors flex items-center justify-between"
                  >
                    <span>Order Menu</span>
                    <span className="text-neutral-600">→</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('customize')}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-neutral-900 text-sm font-black uppercase tracking-wider text-neutral-200 hover:text-orange-500 transition-colors flex items-center justify-between"
                  >
                    <span>Customize Your Pack</span>
                    <span className="text-neutral-600">→</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('event')}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-neutral-900 text-sm font-black uppercase tracking-wider text-neutral-200 hover:text-orange-500 transition-colors flex items-center justify-between"
                  >
                    <span>Book Us For Events</span>
                    <span className="text-neutral-600">→</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('gallery')}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-neutral-900 text-sm font-black uppercase tracking-wider text-neutral-200 hover:text-orange-500 transition-colors flex items-center justify-between"
                  >
                    <span>Gallery</span>
                    <span className="text-neutral-600">→</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('contact')}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-neutral-900 text-sm font-black uppercase tracking-wider text-neutral-200 hover:text-orange-500 transition-colors flex items-center justify-between"
                  >
                    <span>Contact Us</span>
                    <span className="text-neutral-600">→</span>
                  </button>
                </nav>
              </div>

              <div className="pt-6 border-t border-neutral-900 space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleOpenCartModal();
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <span>View Order Basket ({totalCartCount})</span>
                </button>
                <p className="text-[10px] text-neutral-500 text-center font-medium">Supreme Chops International &copy; 2026</p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DISPLAY CONTENT */}
        {currentPage === 'event' ? (
          <EventBooking onBackToMenu={() => triggerPageChange('menu')} />
        ) : currentPage === 'gallery' ? (
          <Gallery 
            onBackToMenu={() => triggerPageChange('menu')} 
            onOrderNow={() => {
              triggerPageChange('menu', () => {
                document.getElementById('menu-catalog')?.scrollIntoView({ behavior: 'smooth' });
              });
            }} 
          />
        ) : (
          <>
            <HeroSection onNavigateToCustomize={() => {
              setActiveTab('customize');
              document.getElementById('menu-catalog')?.scrollIntoView({ behavior: 'smooth' });
            }} />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative z-10">
              <MenuCatalog onAddToCart={handleAddToCartWithAnimation} activeTab={activeTab} setActiveTab={setActiveTab} />
            </main>
          </>
        )}
      </div>

      {/* FLOATING SOCIALS */}
      <FloatingSocials />

      {/* FLOATING BOTTOM-LEFT CART BUTTON */}
      {currentPage === 'menu' && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={handleOpenCartModal}
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

      {/* COMPONENT-BASED CHECKOUT WIZARD MODAL */}
      {isCartModalOpen && (
        <CheckoutWizard
          cart={cart}
          updateQuantity={updateQuantity}
          handleRemoveItem={handleRemoveItem}
          calculateSubtotal={calculateSubtotal}
          calculateTotal={calculateTotal}
          currentDeliveryFee={currentDeliveryFee}
          deliveryZone={deliveryZone}
          setDeliveryZone={setDeliveryZone}
          detectedKm={detectedKm}
          setDetectedKm={setDetectedKm}
          BANK_ACCOUNT={BANK_ACCOUNT}
          handleDownloadInvoice={handleDownloadInvoice}
          handleForwardToWhatsApp={handleForwardToWhatsApp}
          isForSelf={isForSelf}
          setIsForSelf={setIsForSelf}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          altPhone={altPhone}
          setAltPhone={setAltPhone}
          deliveryAddress={deliveryAddress}
          setDeliveryAddress={setDeliveryAddress}
          deliveryNotes={deliveryNotes}
          setDeliveryNotes={setDeliveryNotes}
          gpsLoading={gpsLoading}
          setGpsLoading={setGpsLoading}
          invoiceGenerated={invoiceGenerated}
          onClose={() => setIsCartModalOpen(false)}
        />
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
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span className="text-neutral-300">supremechops777@gmail.com</span>
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 2.62 4.23 5.45 5.67l2.2-2.23c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.23z"/>
              </svg>
              <span className="text-neutral-300">+234 708 124 1745</span>
            </p>
            <p className="flex items-center gap-2 text-neutral-500">
              <svg className="w-4 h-4 text-orange-500 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>26 Moshalashi Street, Ikoyi Obalende, Lagos</span>
            </p>
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
          <div className="font-black tracking-wider uppercase text-neutral-500 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800/60 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 fill-current text-orange-500" viewBox="0 0 24 24">
              <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
            </svg>
            <span>Engineered by <strong className="text-orange-500">SolutionPRO Technologies</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
