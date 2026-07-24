import React from 'react';

export default function PaymentSuccess() {
  // Extract the Paystack transaction reference from the URL query string
  const queryParams = new URLSearchParams(window.location.search);
  const reference = queryParams.get('trxref') || 'SP-CONFIRMED';

  return (
    <div className="min-h-screen bg-amber-50/40 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-100 max-w-md w-full text-center">
        {/* Animated Checkmark Badge */}
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-inner">
          ✓
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Order Confirmed!</h2>
        <p className="text-xs text-amber-600 font-bold mt-1 tracking-wide uppercase">Supreme Chops International</p>
        
        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          Thank you for your payment! Your order has been securely transmitted to our kitchen team. Production is starting immediately.
        </p>

        {/* Transaction Reference Box */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 my-5 text-left">
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Payment Reference</span>
          <span className="text-xs font-mono font-bold text-gray-700 break-all">{reference}</span>
        </div>

        <p className="text-[11px] text-gray-400 italic mb-6">
          🛵 Note: A dispatch rider will contact you upon arrival. Delivery logistics are settled directly with the rider.
        </p>

        <button 
          onClick={() => window.location.href = '/'}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
}