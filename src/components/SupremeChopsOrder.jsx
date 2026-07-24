import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import HeroSection from './HeroSection';
import MenuCatalog from './MenuCatalog';
import InteractiveCart from './InteractiveCart';

import logoPng from '../assets/logo.png';

export default function SupremeChopsOrder() {
  const [siteLoading, setSiteLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [animatingCart, setAnimatingCart] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('sc_user')) || null);
  const [token, setToken] = useState(localStorage.getItem('sc_token') || '');
  const [authModal, setAuthModal] = useState(false); 
  const [authView, setAuthView] = useState('login'); // 'login', 'collect-phone', or 'history'
  const [pastOrders, setPastOrders] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [regPhone, setRegPhone] = useState('');
  const [pendingGoogleData, setPendingGoogleData] = useState(null);

  const BACKEND_API_URL = "https://supreme-chops-backend.onrender.com";

  useEffect(() => {
    const timer = setTimeout(() => setSiteLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    } else {
      setEmail('');
    }
  }, [user]);

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

  const fetchOrderHistory = async (currentToken) => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/customer/orders`, {
        headers: { "Authorization": `Bearer ${currentToken || token}` }
      });
      const data = await response.json();
      if (data.success) setPastOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // --- SMART UNIFIED LOGIN & ONBOARDING ROUTE ---
  const handleGoogleAuthSuccess = async (credentialResponse) => {
    const base64Url = credentialResponse.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(window.atob(base64));

    // Store profile info in case we need to register them
    const googleProfile = {
      name: decodedPayload.name,
      email: decodedPayload.email,
      token: credentialResponse.credential
    };

    try {
      // 1. Attempt standard backend direct login
      const response = await fetch(`${BACKEND_API_URL}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: decodedPayload.email, googleIdToken: credentialResponse.credential })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // User exists! Log them in immediately
        localStorage.setItem('sc_token', data.token);
        localStorage.setItem('sc_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setAuthModal(false); 
        fetchOrderHistory(data.token);
      } else if (response.status === 404) {
        // Brand new email! Redirect seamlessly to get their phone number
        setPendingGoogleData(googleProfile);
        setAuthView('collect-phone');
      } else {
        alert("Authentication system sync issue. Please try again.");
      }
    } catch (err) {
      alert("Authentication handshake connection issue.");
    }
  };

  // --- COMPLETE THE AUTOMATIC REGISTRATION AND AUTO-LOGIN ---
  const handleFinishRegistration = async (e) => {
    e.preventDefault();
    if (!regPhone) return;

    try {
      // 1. Submit registration profile schema
      const regResponse = await fetch(`${BACKEND_API_URL}/api/auth/google-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pendingGoogleData.name,
          email: pendingGoogleData.email,
          phoneNumber: regPhone,
          googleIdToken: pendingGoogleData.token
        })
      });

      if (regResponse.ok) {
        // 2. Automatically log them in right away so they don't have to click sign in twice
        const loginResponse = await fetch(`${BACKEND_API_URL}/api/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: pendingGoogleData.email, googleIdToken: pendingGoogleData.token })
        });
        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.success) {
          localStorage.setItem('sc_token', loginData.token);
          localStorage.setItem('sc_user', JSON.stringify(loginData.user));
          setToken(loginData.token);
          setUser(loginData.user);
          setAuthModal(false);
          setRegPhone('');
          setPendingGoogleData(null);
          setAuthView('login');
        }
      } else {
        alert("Could not process phone profile registration mapping.");
      }
    } catch (err) {
      alert("Registration connectivity failure.");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setAuthView('login');
      setAuthModal(true);
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/checkout/initialize-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, items: cart })
      });
      const data = await response.json();
      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Payment initialization issue: " + (data.detail || "Connection failed."));
      }
    } catch (error) {
      alert("Checkout connection issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    setToken('');
    setUser(null);
    setPastOrders([]);
    setAuthView('login');
  };

  const getMilestoneIndex = (status) => {
    const trackingNodes = ["Payment Received", "Processing", "Order on Delivery", "Order Delivered"];
    const idx = trackingNodes.indexOf(status);
    return idx !== -1 ? idx : 0;
  };

  if (siteLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <img src={logoPng} alt="Supreme Chops Loader" className="w-20 h-20 object-contain animate-pulse" />
        <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-orange-600 w-1/2 animate-infinite-loading rounded-full"></div>
        </div>
        <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase">Loading Portal...</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="108012954038-esis454dei0b7k7kfd68agkjvgqptme0.apps.googleusercontent.com">
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
                <button 
                  onClick={() => { setAuthModal(true); if(user) { setAuthView('history'); fetchOrderHistory(token); } else { setAuthView('login'); } }}
                  className="bg-neutral-950 text-white hover:bg-orange-600 font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide transition-all"
                >
                  👤 {user ? `${user.name.split(' ')[0]}` : 'Sign In'}
                </button>
              </div>
            </div>
          </header>

          <HeroSection onNavigateToCustomize={() => {
            setActiveTab('addons');
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

            <div className="hidden lg:block lg:col-span-1">
              <InteractiveCart 
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={handleRemoveItem}
                email={email}
                setEmail={setEmail}
                onCheckout={handleCheckout}
                loading={loading}
                user={user}
              />
            </div>
          </main>
        </div>

        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
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

          <div className="flex gap-2.5">
            <a href="https://www.instagram.com/supreme_chops" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white border border-neutral-200/60 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all text-neutral-800">
              <svg className="w-4 h-4 fill-current text-neutral-800" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@supremechopsintl?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white border border-neutral-200/60 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all text-neutral-800">
              <svg className="w-4 h-4 fill-current text-neutral-800" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.94-1.69-.65-.54-1.2-1.2-1.63-1.94-.07 3.44-.02 6.89-.04 10.33-.04 1.7-.45 3.42-1.35 4.84-1.31 2.11-3.64 3.51-6.14 3.49-2.6-.02-5.11-1.57-6.24-3.93-1.11-2.32-.73-5.26.95-7.2 1.47-1.74 3.88-2.62 6.11-2.2v4.09c-1.39-.46-3.03-.04-3.99 1.05-.85.96-.94 2.47-.22 3.47.67.95 1.89 1.42 3.04 1.25 1.15-.17 2.12-1.12 2.31-2.27.18-1.03.11-2.09.13-3.14l.02-14.16z"/></svg>
            </a>
            <a href="https://www.facebook.com/share/17wu4XyjWv" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white border border-neutral-200/60 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all text-neutral-800">
              <svg className="w-4 h-4 fill-current text-neutral-800" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
          </div>
        </div>

        {mobileCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <div onClick={() => setMobileCartOpen(false)} className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <div className="flex justify-between items-center pb-4 border-b mb-6">
                  <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider">🛒 Your Order Sheet</h3>
                  <button onClick={() => setMobileCartOpen(false)} className="text-neutral-400 font-bold p-2 text-sm">✕ Close</button>
                </div>
                <InteractiveCart 
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={handleRemoveItem}
                  email={email}
                  setEmail={setEmail}
                  onCheckout={handleCheckout}
                  loading={loading}
                  user={user}
                />
              </div>
            </div>
          </div>
        )}

        {authModal && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div onClick={() => setAuthModal(false)} className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider">
                    {authView === 'login' && 'Identity Verification'}
                    {authView === 'collect-phone' && 'Complete Your Profile'}
                    {authView === 'history' && 'Your Order Pipeline'}
                  </h3>
                  <button onClick={() => setAuthModal(false)} className="text-neutral-400 font-bold">✕</button>
                </div>

                {authView === 'login' && (
                  <div className="space-y-6 pt-12 text-center">
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                      Sign in safely with Google to review your checkout preferences and live order pipeline tracking.
                    </p>
                    <div className="flex justify-center">
                      <GoogleLogin onSuccess={handleGoogleAuthSuccess} onError={() => alert('Verification failed')} />
                    </div>
                  </div>
                )}

                {/* 🌟 NEW UNIFIED SEAMLESS PHONE INPUT VIEW */}
                {authView === 'collect-phone' && (
                  <div className="space-y-6 pt-8 text-xs">
                    <form onSubmit={handleFinishRegistration} className="space-y-5">
                      <div className="bg-orange-50 border border-orange-200/60 p-4 rounded-xl text-neutral-700 leading-relaxed">
                        👋 Welcome to Supreme Chops, <strong>{pendingGoogleData?.name}</strong>! Please enter your phone number to complete your registration sheet.
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-black text-neutral-400 text-[10px] uppercase tracking-wider">WhatsApp Contact Number</label>
                        <input 
                          required 
                          type="tel" 
                          placeholder="e.g., 08034567890" 
                          className="w-full border p-3.5 rounded-xl bg-neutral-50 text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500/20" 
                          value={regPhone} 
                          onChange={e => setRegPhone(e.target.value)} 
                        />
                      </div>
                      <button type="submit" className="w-full bg-neutral-950 hover:bg-orange-600 transition-colors text-white font-black p-3.5 rounded-xl uppercase tracking-wider text-xs mt-2">
                        Complete & Log In
                      </button>
                    </form>
                  </div>
                )}

                {authView === 'history' && (
                  <div className="pt-6 space-y-8 max-h-[75vh] overflow-y-auto pr-1">
                    <p className="text-xs text-neutral-400">Live order pipeline tracking for: <strong className="text-neutral-800">{user?.email}</strong></p>
                    
                    {historyLoading ? (
                      <p className="text-xs text-center text-neutral-400 py-6">Syncing pipeline databases...</p>
                    ) : pastOrders.length === 0 ? (
                      <p className="text-xs text-center text-neutral-400 py-6">No payment transactions linked to this profile.</p>
                    ) : (
                      <div className="space-y-8">
                        {pastOrders.map((ord, i) => {
                          const currentStep = getMilestoneIndex(ord.order_status || "Payment Received");
                          const milestones = ["Payment Received", "Processing", "On Delivery", "Delivered"];

                          return (
                            <div key={i} className="bg-neutral-50 border border-neutral-200/60 p-5 rounded-2xl space-y-4 shadow-sm">
                              <div className="flex justify-between items-start text-xs">
                                <div>
                                  <p className="font-black text-neutral-900">Value: ₦{ord.total_bill_with_vat.toLocaleString()}</p>
                                  <span className="text-[10px] text-neutral-400 block mt-0.5">Ref: {ord.reference}</span>
                                </div>
                                <span className="text-[10px] bg-white border px-2 py-0.5 rounded-md text-neutral-500 font-mono">{ord.timestamp.split(' ')[0]}</span>
                              </div>

                              <div className="pt-2">
                                <div className="flex justify-between items-center relative">
                                  <div className="absolute left-0 right-0 top-2 h-0.5 bg-neutral-200 z-0"></div>
                                  <div 
                                    className="absolute left-0 top-2 h-0.5 bg-orange-500 z-0 transition-all duration-500" 
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
                                  ></div>

                                  {milestones.map((label, stepIdx) => (
                                    <div key={stepIdx} className="flex flex-col items-center z-10 relative">
                                      <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] transition-all ${
                                        stepIdx <= currentStep ? 'bg-orange-600 text-white ring-4 ring-orange-100' : 'bg-neutral-200 text-neutral-400'
                                      }`}>
                                        {stepIdx <= currentStep ? '✓' : ''}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="flex justify-between text-[9px] font-black tracking-tight uppercase text-neutral-400 mt-2">
                                  <span className={currentStep >= 0 ? 'text-orange-600' : ''}>Paid</span>
                                  <span className={currentStep >= 1 ? 'text-orange-600' : ''}>Prep</span>
                                  <span className={currentStep >= 2 ? 'text-orange-600' : ''}>Transit</span>
                                  <span className={currentStep >= 3 ? 'text-orange-600' : ''}>Ready</span>
                                </div>
                              </div>

                              <div className="bg-white/60 border rounded-xl p-3 text-[11px] text-neutral-500 divide-y divide-neutral-100">
                                {ord.items?.map((it, itemIdx) => (
                                  <div key={itemIdx} className="py-1 flex justify-between first:pt-0 last:pb-0">
                                    <span>{it.name} <strong className="text-neutral-700">x{it.qty}</strong></span>
                                    <span className="font-medium text-neutral-800">₦{(it.price * it.qty).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {user && (
                <button onClick={handleLogout} className="w-full bg-neutral-100 border font-bold p-3 rounded-xl text-xs hover:text-red-600 transition-colors uppercase mt-4">
                  Log Out
                </button>
              )}
            </div>
          </div>
        )}
        
        <footer className="bg-neutral-950 text-neutral-400 text-xs py-16 mt-32 border-t border-neutral-900 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-4">
              <img src={logoPng} alt="Supreme Chops" className="w-12 h-12 object-contain bg-white rounded-xl p-1" />
              <h4 className="text-white font-black text-base uppercase">Supreme Chops</h4>
              <p className="text-neutral-500 leading-relaxed text-[13px]">
                Premium gourmet catering across Lagos state.
              </p>
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
    </GoogleOAuthProvider>
  );
}