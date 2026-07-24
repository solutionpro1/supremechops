import React from 'react';

export default function InteractiveCart({ cart, onUpdateQuantity, onRemoveItem, onCheckout, loading, user }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-xl space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
        <h2 className="text-xs font-black text-neutral-950 uppercase tracking-wider">Your Selection</h2>
        {cart.length > 0 && (
          <span className="text-[10px] bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-black">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
          </span>
        )}
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 space-y-2">
          <span className="text-2xl block">🍱</span>
          <p className="text-xs">Your basket details are currently empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 divide-y divide-neutral-50">
            {cart.map((item) => (
              <div key={item.uniqueId} className="flex justify-between items-center text-xs pt-3 first:pt-0">
                <div className="flex-1 pr-3">
                  <h4 className="font-bold text-neutral-950 tracking-tight leading-tight">{item.name}</h4>
                  <span className="text-neutral-400 text-[10px] mt-0.5 block">₦{item.price.toLocaleString()} each</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-neutral-50 px-2 py-1 rounded-xl border border-neutral-200">
                    <button 
                      onClick={() => updateQuantity && onUpdateQuantity(item.uniqueId, -1)} 
                      className="text-neutral-400 font-bold px-1 hover:text-neutral-900 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-bold text-neutral-950 text-xs w-4 text-center font-mono">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity && onUpdateQuantity(item.uniqueId, 1)} 
                      className="text-neutral-400 font-bold px-1 hover:text-neutral-900 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => onRemoveItem(item.uniqueId)}
                    className="text-neutral-300 hover:text-red-500 p-1 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
            <div className="flex justify-between font-black text-neutral-950 pt-3 border-t border-dashed border-neutral-200 text-sm">
              <span>Total Invoice:</span>
              <span className="text-orange-600 text-base">₦{total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={onCheckout} 
            disabled={loading} 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg transition-all active:scale-98"
          >
            {loading ? 'Initializing Secure Gateway Link...' : 'Pay For Order Now'}
          </button>
        </>
      )}
    </div>
  );
}
