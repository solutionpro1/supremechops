import React, { useState, useEffect } from 'react';
import logoPng from '../assets/logo.png';

export default function SupremeChopsAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingRef, setUpdatingRef] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const BACKEND_API_URL = "https://supreme-chops-backend.onrender.com";
  const milestones = ["Payment Received", "Processing", "Order on Delivery", "Order Delivered"];

  const fetchAllAdminOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/admin/orders`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to sync admin order bank:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminOrders();
    // Poll for new orders every 30 seconds automatically
    const interval = setInterval(fetchAllAdminOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (reference, currentStatus) => {
    const currentIndex = milestones.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === milestones.length - 1) return; // Already delivered
    
    const nextStatus = milestones[currentIndex + 1];
    setUpdatingRef(reference);

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/admin/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, new_status: nextStatus })
      });
      const data = await response.json();
      if (data.success) {
        // Update local state smoothly
        setOrders(orders.map(o => o.reference === reference ? { ...o, order_status: nextStatus } : o));
      } else {
        alert("Pipeline error: " + data.detail);
      }
    } catch (err) {
      alert("Failed to communicate milestone shift with backend.");
    } finally {
      setUpdatingRef(null);
    }
  };

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.order_status === filterStatus);

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans antialiased p-6">
      {/* Header Deck */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div className="flex items-center gap-4">
          <img src={logoPng} alt="Supreme Chops Core" className="w-14 h-14 object-contain bg-white rounded-xl p-1" />
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">Supreme Chops Control Deck</h1>
            <p className="text-xs text-orange-500 font-bold tracking-widest uppercase">Operations & Order Fulfillment</p>
          </div>
        </div>
        <button 
          onClick={fetchAllAdminOrders} 
          className="bg-neutral-800 hover:bg-neutral-700 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all border border-neutral-700"
        >
          🔄 Refresh Log Engine
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 mb-6">
        {['All', ...milestones].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filterStatus === status 
                ? 'bg-orange-600 text-white' 
                : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Main Order Queue Layout */}
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-neutral-500 text-xs font-bold uppercase tracking-widest animate-pulse">
            Syncing operational metrics...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-xs font-bold uppercase border-2 border-dashed border-neutral-800 rounded-2xl">
            No orders found under this sorting category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order, idx) => {
              const currentStep = milestones.indexOf(order.order_status);
              
              return (
                <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl space-y-6">
                  {/* Card Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                        Ref: {order.reference}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {order.timestamp}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-neutral-200 truncate">{order.customer_email}</h3>
                    <div className="text-[11px] font-bold text-orange-500">
                      Total Bill: ₦{order.total_bill_with_vat.toLocaleString()}
                    </div>
                  </div>

                  {/* Item Basket Breakdown */}
                  <div className="bg-neutral-900 border border-neutral-800/60 rounded-xl p-4 text-xs text-neutral-400 divide-y divide-neutral-800">
                    {order.items?.map((it, itemIdx) => (
                      <div key={itemIdx} className="py-2 flex justify-between first:pt-0 last:pb-0">
                        <span>{it.name} <strong className="text-white">x{it.qty}</strong></span>
                        <span className="font-mono text-neutral-300">₦{(it.price * it.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Visual Nodes */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[9px] font-black tracking-tight uppercase text-neutral-500 mb-2">
                      <span className={currentStep >= 0 ? 'text-orange-500' : ''}>Paid</span>
                      <span className={currentStep >= 1 ? 'text-orange-500' : ''}>Processing</span>
                      <span className={currentStep >= 2 ? 'text-orange-500' : ''}>Transit</span>
                      <span className={currentStep >= 3 ? 'text-green-500' : ''}>Delivered</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${currentStep === 3 ? 'bg-green-500' : 'bg-orange-500'}`}
                        style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  {currentStep < milestones.length - 1 ? (
                    <button
                      disabled={updatingRef === order.reference}
                      onClick={() => handleUpdateStatus(order.reference, order.order_status)}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-black text-xs uppercase tracking-wider p-3 rounded-xl transition-colors mt-2"
                    >
                      {updatingRef === order.reference ? 'Advancing Stage...' : `Move to: ${milestones[currentStep + 1]}`}
                    </button>
                  ) : (
                    <div className="w-full bg-green-950/40 border border-green-800/40 text-green-400 text-center font-black text-xs uppercase tracking-wider p-3 rounded-xl">
                      ✓ Order Fulfilled Completely
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}