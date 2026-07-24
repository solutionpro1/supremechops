import React, { useState, useEffect } from 'react';

export default function SupremeAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Could not load backend logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Admin Metric Dashboard Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Supreme Control Hub</h2>
            <p className="text-xs text-neutral-400">Live Production Queue Management & Audit Trail Logs</p>
          </div>
          <button onClick={fetchAllOrders} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors">
            🔄 Refresh Feeds
          </button>
        </div>

        {/* Operational Statistics Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Gross Income Summary</span>
            <p className="text-2xl font-black text-neutral-900 mt-1">₦{orders.reduce((sum, o) => sum + o.total_bill_with_vat, 0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Total Active Requests</span>
            <p className="text-2xl font-black text-orange-600 mt-1">{orders.length} Deliveries</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Operational Node</span>
            <p className="text-2xl font-black text-green-600 mt-1">100% Online</p>
          </div>
        </div>

        {/* Comprehensive Requests Table Log */}
        <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">Incoming Order Queue</h3>
          </div>
          
          {loading ? (
            <p className="text-center py-12 text-neutral-400 text-xs animate-pulse">Streaming order history arrays from main infrastructure...</p>
          ) : orders.length === 0 ? (
            <p className="text-center py-12 text-neutral-400 text-xs">No customer payment payloads registered on the system database yet.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {orders.map((ord, i) => (
                <div key={i} className="p-6 flex flex-col md:flex-row justify-between gap-4 hover:bg-neutral-50/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-neutral-400">{ord.reference}</span>
                      <span className="text-[10px] font-bold bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">{ord.timestamp}</span>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">{ord.customer_email}</p>
                    <div className="pt-2 space-y-1">
                      {ord.items?.map((item, idx) => (
                        <span key={idx} className="inline-block bg-orange-50 text-orange-700 font-medium text-[11px] px-2.5 py-1 rounded-lg mr-2 border border-orange-100/60">
                          {item.name} (x{item.qty})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
                      Paid Successfully
                    </span>
                    <p className="text-lg font-black text-neutral-950 mt-2">₦{ord.total_bill_with_vat.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}