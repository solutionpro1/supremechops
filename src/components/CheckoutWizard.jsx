import React, { useState, useRef } from 'react';
import { DeliveryScheduling } from './DeliveryScheduling';

export default function CheckoutWizard({
  cart = [],
  updateQuantity,
  handleRemoveItem,
  calculateSubtotal,
  calculateTotal,
  currentDeliveryFee = 0,
  deliveryZone,
  setDeliveryZone,
  detectedKm,
  setDetectedKm,
  BANK_ACCOUNT = { bankName: 'Access Bank', accountNumber: '1411762017', accountName: 'Olamide Adekeye' },
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
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [showInvoiceNotification, setShowInvoiceNotification] = useState(false);
  const debounceRef = useRef(null);

  const [orderSchedule, setOrderSchedule] = useState({ type: 'asap' });

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

  const handleAutoDetectFeeOnly = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please search your area manually.");
      return;
    }

    setGpsLoading(true);

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
        setGpsLoading(false);
        alert("Unable to fetch GPS automatically. Please type your area name in the search bar.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCopyBankAccount = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigator.clipboard.writeText(BANK_ACCOUNT.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleCopyDepotAddress = (e) => {
    if (e && e.preventDefault) e.preventDefault();
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
        console.error(err);
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

  const generateAndDownloadInvoice = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDownloadingInvoice(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 800, 1100);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, 0, 800, 14);
      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText('SUPREME CHOPS INTERNATIONAL', 50, 70);
      ctx.fillStyle = '#a3a3a3';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText('Fresh Small Chops & Finger Foods | Lagos, Nigeria', 50, 100);
      ctx.fillText('Phone: +234 708 124 1745 | www.supremechops.ng', 50, 122);
      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 145);
      ctx.lineTo(750, 145);
      ctx.stroke();

      const orderDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillText('OFFICIAL ORDER INVOICE', 50, 180);
      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = '#d4d4d4';
      ctx.fillText(`Date: ${orderDate}`, 50, 210);
      ctx.fillText(`Customer: ${customerName || 'Valued Customer'}`, 50, 235);
      ctx.fillText(`Phone: ${customerPhone || 'N/A'}`, 50, 260);

      const scheduleInfo = orderSchedule.type === 'scheduled' && orderSchedule.date
        ? `Scheduled: ${orderSchedule.date} (${orderSchedule.time || '09:00 AM - 11:00 AM'})`
        : 'ASAP Dispatch (Mon - Sat 9:00 AM - 5:00 PM)';

      ctx.fillText(`Fulfillment: ${deliveryMethod === 'pickup' ? 'Self Pickup (Obalende Depot)' : 'Doorstep Delivery'}`, 420, 210);
      ctx.fillText(`Timing: ${scheduleInfo}`, 420, 235);
      if (deliveryMethod === 'dispatch' && deliveryAddress) {
        ctx.fillText(`Address: ${deliveryAddress.substring(0, 35)}...`, 420, 260);
      }

      ctx.fillStyle = '#171717';
      ctx.fillRect(50, 290, 700, 36);
      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 13px Arial, sans-serif';
      ctx.fillText('ITEM DESCRIPTION', 65, 313);
      ctx.fillText('QTY', 520, 313);
      ctx.fillText('PRICE (NGN)', 620, 313);

      let currentY = 350;
      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';

      cart.forEach((item) => {
        ctx.fillText(item.name, 65, currentY);
        ctx.fillText(`${item.quantity}`, 530, currentY);
        const itemTotal = (item.price * item.quantity).toLocaleString();
        ctx.fillText(`N${itemTotal}`, 620, currentY);
        currentY += 32;
      });

      const subtotalVal = typeof calculateSubtotal === 'function' ? calculateSubtotal() : 0;
      const totalVal = typeof calculateTotal === 'function' ? calculateTotal() : 0;
      const feeVal = deliveryMethod === 'pickup' ? 0 : currentDeliveryFee;

      ctx.strokeStyle = '#262626';
      ctx.beginPath();
      ctx.moveTo(50, currentY + 10);
      ctx.lineTo(750, currentY + 10);
      ctx.stroke();

      currentY += 45;
      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = '#a3a3a3';
      ctx.fillText('Items Subtotal:', 480, currentY);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`N${subtotalVal.toLocaleString()}`, 640, currentY);
      currentY += 28;
      ctx.fillStyle = '#a3a3a3';
      ctx.fillText('Fulfillment Fee:', 480, currentY);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(deliveryMethod === 'pickup' ? 'FREE' : `N${feeVal.toLocaleString()}`, 640, currentY);
      currentY += 32;
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(460, currentY - 20, 290, 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillText('TOTAL DUE:', 480, currentY + 6);
      ctx.fillText(`N${totalVal.toLocaleString()}`, 630, currentY + 6);

      currentY += 70;
      ctx.fillStyle = '#171717';
      ctx.fillRect(50, currentY, 700, 100);
      ctx.strokeStyle = '#ea580c';
      ctx.strokeRect(50, currentY, 700, 100);
      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 13px Arial, sans-serif';
      ctx.fillText('OFFICIAL PAYMENT BANK ACCOUNT (DIRECT TRANSFER)', 70, currentY + 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Arial, sans-serif';
      ctx.fillText(`Bank: ${BANK_ACCOUNT.bankName} | Account No: ${BANK_ACCOUNT.accountNumber}`, 70, currentY + 58);
      ctx.font = '13px Arial, sans-serif';
      ctx.fillStyle = '#a3a3a3';
      ctx.fillText(`Account Name: ${BANK_ACCOUNT.accountName}`, 70, currentY + 82);

      ctx.fillStyle = '#737373';
      ctx.font = '12px Arial, sans-serif';
      ctx.fillText('Thank you for choosing Supreme Chops International! Your satisfaction is our priority.', 50, 1040);
      ctx.fillText('Please forward payment confirmation receipt on WhatsApp to confirm delivery.', 50, 1062);

      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = `SupremeChops_Invoice_${Date.now()}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        }
        setShowInvoiceNotification(true);
        setDownloadingInvoice(false);
      }, 'image/png');

    } catch (err) {
      console.error("Canvas Invoice generation error:", err);
      setDownloadingInvoice(false);
    }
  };

  const onWhatsAppSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!customerName?.trim() || !customerPhone?.trim()) {
      alert("Please enter your name and contact phone number before submitting.");
      return;
    }

    if (deliveryMethod === 'dispatch' && !deliveryAddress?.trim()) {
      alert("Please enter your full delivery address.");
      return;
    }

    const scheduleStr = orderSchedule.type === 'scheduled' && orderSchedule.date
      ? `Scheduled: ${orderSchedule.date} (${orderSchedule.time || '09:00 AM - 11:00 AM'})`
      : 'ASAP Dispatch (Mon - Sat 9:00 AM - 5:00 PM)';

    const itemsText = cart.map(item => `• ${item.name} x${item.quantity} (N${(item.price * item.quantity).toLocaleString()})`).join('\n');
    const subtotalVal = typeof calculateSubtotal === 'function' ? calculateSubtotal() : 0;
    const totalVal = typeof calculateTotal === 'function' ? calculateTotal() : 0;

    const msg = `*NEW ORDER - Supreme Chops International*\n` +
      `------------------------------------\n` +
      `*Name:* ${customerName}\n` +
      `*Phone:* ${customerPhone}\n` +
      `*Fulfillment:* ${deliveryMethod === 'pickup' ? 'Self Pickup (Obalende Depot)' : `Delivery to: ${deliveryAddress}`}\n` +
      `*Timing:* ${scheduleStr}\n\n` +
      `*ITEMS:*\n${itemsText}\n\n` +
      `*Subtotal:* N${subtotalVal.toLocaleString()}\n` +
      `*Fulfillment Fee:* ${deliveryMethod === 'pickup' ? 'FREE' : `N${currentDeliveryFee.toLocaleString()}`}\n` +
      `*GRAND TOTAL:* N${totalVal.toLocaleString()}\n` +
      (deliveryNotes ? `*Notes:* ${deliveryNotes}\n` : '') +
      `------------------------------------\n` +
      `_Order submitted via www.supremechops.ng_`;

    window.open(`https://wa.me/2347081241745?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-neutral-950/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5 relative flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                Step {step} of 3
              </span>
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                {step === 1 && "Confirm Order Items"}
                {step === 2 && "Recipient Selection"}
                {step === 3 && (deliveryMethod === 'pickup' ? "Pickup Logistics" : "Delivery Coordinates & Schedule")}
              </h3>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-full font-bold text-neutral-600 text-sm flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 pt-3">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-orange-600' : 'bg-neutral-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-orange-600' : 'bg-neutral-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-orange-600' : 'bg-neutral-200'}`} />
          </div>
        </div>

        {/* Live Order Strip */}
        {step > 1 && (
          <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-2 border border-neutral-800 shadow-md">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
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
                <span>₦{typeof calculateSubtotal === 'function' ? calculateSubtotal().toLocaleString() : 0}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>
                  {deliveryMethod === 'pickup' ? 'Fulfillment:' : `Delivery Fee ${detectedKm ? `(${detectedKm}km)` : ''}:`}
                </span>
                <span className={deliveryMethod === 'pickup' ? "text-emerald-400 font-bold" : (deliveryZone === 'outOfRange' ? "text-red-400 font-bold uppercase" : "text-orange-300 font-bold")}>
                  {deliveryMethod === 'pickup' ? "FREE (Self Pickup)" : (deliveryZone === 'outOfRange' ? "Out of Range" : `₦${currentDeliveryFee.toLocaleString()}`)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-white pt-1">
                <span>Grand Total:</span>
                <span className="text-orange-400 font-extrabold text-sm">₦{typeof calculateTotal === 'function' ? calculateTotal().toLocaleString() : 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: ORDER ITEMS */}
        {step === 1 && (
          <div className="space-y-5 py-1">
            {cart.length === 0 ? (
              <p className="text-xs text-neutral-400 py-12 text-center font-medium">Your basket is empty. Select items to construct your pack.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.uniqueId || item.id} className="flex justify-between items-center text-xs border-b border-neutral-100 pb-3">
                      <div className="space-y-0.5 max-w-[65%]">
                        <p className="font-bold text-neutral-800 truncate">{item.name}</p>
                        <p className="text-neutral-400 font-mono">₦{item.price?.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center bg-neutral-100 rounded-lg">
                          <button type="button" onClick={() => updateQuantity && updateQuantity(item.uniqueId, -1)} className="px-2.5 py-1 font-bold text-neutral-500 text-sm">-</button>
                          <span className="px-1 text-xs font-black font-mono text-neutral-800">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity && updateQuantity(item.uniqueId, 1)} className="px-2.5 py-1 font-bold text-neutral-500 text-sm">+</button>
                        </div>
                        <button type="button" onClick={() => handleRemoveItem && handleRemoveItem(item.uniqueId)} className="text-neutral-300 hover:text-red-500 text-sm font-medium">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-neutral-500">
                    <span>Items Subtotal:</span>
                    <span className="font-mono">₦{typeof calculateSubtotal === 'function' ? calculateSubtotal().toLocaleString() : 0}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-neutral-500">
                    <span>Estimated Fulfillment:</span>
                    <span className="font-mono">{deliveryMethod === 'pickup' ? "FREE (Self Pickup)" : `₦${currentDeliveryFee.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-neutral-900 pt-1.5 border-t">
                    <span>Grand Total:</span>
                    <span className="font-mono text-orange-600">₦{typeof calculateTotal === 'function' ? calculateTotal().toLocaleString() : 0}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-neutral-950 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest p-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Confirm Order & Proceed</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 2: RECIPIENT */}
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
                  setStep(3);
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${isForSelf ? 'border-orange-500 bg-orange-50/40' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div>
                  <p className="font-extrabold text-sm text-neutral-900 uppercase">For Myself</p>
                  <p className="text-[11px] text-neutral-500 font-medium">Deliver or pick up for myself</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-600 font-bold text-xs">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForSelf(false);
                  setStep(3);
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${!isForSelf ? 'border-orange-500 bg-orange-50/40' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div>
                  <p className="font-extrabold text-sm text-neutral-900 uppercase">For Someone Else</p>
                  <p className="text-[11px] text-neutral-500 font-medium">Send as a gift or dispatch to another recipient</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-600 font-bold text-xs">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76V8h2v.76L15.38 12 17 10.83 14.92 8H20v6z"/></svg>
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

        {/* STEP 3: LOGISTICS & ACTIONS */}
        {step === 3 && (
          <div className="space-y-4 py-1">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Fulfillment Method</label>
              <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl border">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('dispatch')}
                  className={`text-center py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${deliveryMethod === 'dispatch' ? 'bg-white text-orange-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-4-4zM7 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm11 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                  <span>Doorstep Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod('pickup');
                    setDeliveryZone('none');
                    setDetectedKm(null);
                    setDeliveryAddress(DEPOT_ADDRESS);
                  }}
                  className={`text-center py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${deliveryMethod === 'pickup' ? 'bg-white text-orange-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>
                  <span>Self Pickup (Depot)</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                {isForSelf ? 'Full Name' : "Recipient's Full Name"}
              </label>
              <input 
                required
                type="text" 
                placeholder="Enter full name..." 
                className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none font-medium"
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
                  placeholder="Enter phone number..." 
                  className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none font-medium"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Alternative No</label>
                <input 
                  type="tel" 
                  placeholder="Optional" 
                  className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none font-medium"
                  value={altPhone}
                  onChange={e => setAltPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Delivery Timing */}
            <DeliveryScheduling onScheduleChange={(schedule) => setOrderSchedule(schedule)} />

            {/* Location */}
            {deliveryMethod === 'pickup' ? (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    Self Pickup Depot Address
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDepotAddress}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg"
                  >
                    {copiedDepot ? "Copied!" : "Copy Address"}
                  </button>
                </div>
                <p className="text-xs font-extrabold text-neutral-800">
                  {DEPOT_ADDRESS}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  
                  {isForSelf && (
                    <button 
                      type="button"
                      onClick={handleAutoDetectFeeOnly}
                      className="w-full border border-orange-500 bg-orange-50/50 hover:bg-orange-50 text-orange-600 font-black text-[11px] uppercase p-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
                      <span>{gpsLoading ? 'Pinning Location Coordinates...' : 'Pin My Live Location for Delivery'}</span>
                    </button>
                  )}

                  <div className="space-y-1 relative">
                    {!isForSelf && (
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Search Recipient's Area for Delivery Fee</label>
                    )}
                    <input 
                      type="text" 
                      placeholder={isForSelf ? "Or search area name (e.g. Lekki, Ikeja, Ikoyi)..." : "Search recipient's area (e.g. Lekki, Ikeja)..."}
                      className="w-full border border-orange-200 bg-orange-50/20 text-xs p-2.5 rounded-xl focus:outline-none"
                      value={searchQuery}
                      onChange={e => handleAddressSearch(e.target.value)}
                    />

                    {addressSuggestions.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 top-[100%] mt-1 bg-white border border-neutral-200 rounded-xl shadow-2xl max-h-[160px] overflow-y-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="p-2.5 text-[11px] font-medium text-neutral-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer border-b last:border-b-0 truncate"
                          >
                            {suggestion.display_name.replace(', Nigeria', '').replace(', West Africa', '')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {detectedKm && (
                    deliveryZone === 'outOfRange' ? (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-center space-y-1 mt-2">
                        <p className="text-xs font-black uppercase">Out of Delivery Range ({detectedKm} km)</p>
                        <p className="text-[10px] font-medium leading-relaxed text-red-600">
                          Selected area exceeds 40 km from our Obalende depot. Please choose an address within Lagos or switch to <strong>"Self Pickup"</strong>.
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-green-600 font-bold text-center bg-green-50 py-1.5 rounded-lg border border-green-200">
                        {isForSelf ? 'Location Pinned:' : 'Recipient Area Found:'} {detectedKm} km from Depot (Fee: ₦{currentDeliveryFee.toLocaleString()})
                      </p>
                    )
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                    Full Delivery Street Address <span className="text-orange-500">*</span>
                  </label>
                  <textarea 
                    required
                    rows="2"
                    placeholder="Enter street name, house/flat number, estate..." 
                    className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none font-medium resize-none"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                Special Delivery Notes
              </label>
              <input 
                type="text" 
                placeholder="e.g. Call when outside, leave at gate" 
                className="w-full border border-neutral-200/80 bg-neutral-50 text-xs p-3 rounded-xl focus:outline-none font-medium"
                value={deliveryNotes}
                onChange={e => setDeliveryNotes(e.target.value)}
              />
            </div>

            {/* Bank Transfer Details */}
            <div className="bg-orange-50/90 border border-orange-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-orange-700 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M4 10h16v2H4zm0 4h16v2H4zm0-8h16v2H4zm-2 14h20V4H2v16zm2-14h16v12H4V6z"/></svg>
                  Bank Transfer Account
                </span>
                <span className="text-[10px] font-black text-neutral-600 uppercase">{BANK_ACCOUNT?.bankName}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <div>
                  <p className="text-base font-mono font-black text-neutral-900">{BANK_ACCOUNT?.accountNumber}</p>
                  <p className="text-[11px] font-bold text-neutral-700 uppercase">{BANK_ACCOUNT?.accountName}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBankAccount}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-2 rounded-xl"
                >
                  {copiedBank ? "Copied!" : "Copy Acc"}
                </button>
              </div>
            </div>

            {/* INVOICE DOWNLOADED NOTIFICATION TOAST */}
            {showInvoiceNotification && (
              <div className="bg-emerald-950/90 border border-emerald-500/50 rounded-2xl p-4 text-white shadow-xl space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <p className="text-xs font-bold text-emerald-300">Invoice Image Downloaded Successfully!</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowInvoiceNotification(false)}
                    className="text-neutral-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  The invoice has been saved to your device downloads. Please <strong>attach this downloaded invoice</strong> when sending your WhatsApp message to verify payment.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    setShowInvoiceNotification(false);
                    onWhatsAppSubmit(e);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M2.004 22l1.352-4.968A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.952 9.952 0 01-5.032-1.356L2.004 22zM8.391 7.308c-.18-.024-.361-.024-.541 0a1.05 1.05 0 00-.735.418c-.287.391-.818 1.341-.818 2.651 0 1.31.848 2.576.965 2.736.118.16 1.668 2.684 4.092 3.633 2.02.791 2.433.633 2.875.592.441-.04 1.418-.58 1.618-1.141.2-.56.2-1.041.14-1.141-.06-.1-.22-.16-.46-.281-.24-.12-1.015-.374-1.933-1.193-.715-.638-1.198-1.426-1.338-1.666-.14-.24-.015-.37.105-.49.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.781-.195-.468-.396-.404-.543-.411z"/></svg>
                  <span>Open WhatsApp & Attach Invoice</span>
                </button>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 gap-2 pt-2">
              <button 
                type="button"
                onClick={generateAndDownloadInvoice}
                disabled={downloadingInvoice}
                className="w-full font-black text-xs uppercase tracking-widest p-4 rounded-xl border-2 bg-white border-neutral-950 text-neutral-950 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                <span>{downloadingInvoice ? 'Generating Image Invoice...' : 'Download Image Invoice'}</span>
              </button>

              <button 
                type="button"
                onClick={onWhatsAppSubmit}
                className="w-full font-black text-xs uppercase tracking-widest p-4 rounded-xl bg-neutral-950 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
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
