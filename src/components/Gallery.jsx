import React, { useState } from 'react';

export default function Gallery({ onBackToMenu, onOrderNow }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // PASTE YOUR CLIENT'S NEW SOCIAL MEDIA IMAGE LINKS DIRECTLY IN THE 'image' FIELDS BELOW
  const galleryImages = [
    {
      id: 1,
      title: 'Supreme Platter Display',
      category: 'Platters',
      image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
      desc: 'Freshly prepared finger food platter with Spring Rolls, Samosas, Mosa, and Peppered Snails.'
    },
    {
      id: 2,
      title: 'VIP Party Box',
      category: 'Platters',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      desc: 'Executive platter with Prawn Rolls, Chicken Samosas, and Peppered Chicken.'
    },
    {
      id: 3,
      title: 'Golden Crispy Fried Chicken',
      category: 'Chicken & Grill',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
      desc: 'Crispy double-breaded fried chicken prepared fresh to order.'
    },
    {
      id: 4,
      title: 'Spicy Peppered Snail & Gizzard',
      category: 'Grill & Peppered',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      desc: 'Tender jumbo snails coated in rich pepper sauce.'
    },
    {
      id: 5,
      title: 'Piping Hot Puff Puff & Mosa',
      category: 'Snacks',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      desc: 'Sweet fried puff puff and plantain mosa balls.'
    },
    {
      id: 6,
      title: 'Crispy Meat Samosas',
      category: 'Finger Foods',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      desc: 'Golden flaky samosas packed with spiced minced meat.'
    },
    {
      id: 7,
      title: 'Golden Spring Rolls',
      category: 'Finger Foods',
      image: 'https://images.unsplash.com/photo-1548365328-8c6db4b63388?auto=format&fit=crop&w=800&q=80',
      desc: 'Crunchy spring rolls stuffed with seasoned vegetables and chicken.'
    },
    {
      id: 8,
      title: 'Specialty Corndogs & Snacks',
      category: 'Specialties',
      image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
      desc: 'Delicious sausage corndogs and savory moneybags.'
    },
    {
      id: 9,
      title: 'Flame-Grilled Chicken Kebabs',
      category: 'Grill',
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
      desc: 'Skewered marinated chicken grilled over charcoal.'
    },
    {
      id: 10,
      title: 'Live Event Catering Setup',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      desc: 'Small Chops catering station setup for Lagos parties and corporate events.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-neutral-950 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden text-center space-y-4 border border-neutral-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-block bg-orange-500/20 border border-orange-500/40 text-orange-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
          Photo Showcase
        </span>
        
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
          Supreme Chops <span className="text-orange-500">Gallery</span>
        </h2>
        
        <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
          Explore our freshly prepared finger food platters, grilled delicacies, and party event setups across Lagos.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onOrderNow}
            className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-orange-600/30"
          >
            Order These Now
          </button>
          <button
            onClick={onBackToMenu}
            className="bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all"
          >
            ← Back to Menu
          </button>
        </div>
      </div>

      {/* Grid of Pictures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="h-56 w-full relative overflow-hidden bg-neutral-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl border border-white/10">
                  {item.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-neutral-950 font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  View Image
                </span>
              </div>
            </div>

            <div className="p-5 space-y-1.5">
              <h4 className="font-extrabold text-sm text-neutral-900 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX PREVIEW MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-neutral-950/80 hover:bg-orange-600 text-white font-bold rounded-full text-sm flex items-center justify-center backdrop-blur-md transition-colors"
            >
              ✕
            </button>

            <div className="h-72 sm:h-96 w-full bg-neutral-950 relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-3">
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                {selectedImage.category}
              </span>
              <h3 className="text-xl font-black text-neutral-900 uppercase">
                {selectedImage.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                {selectedImage.desc}
              </p>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    onOrderNow();
                  }}
                  className="flex-1 bg-neutral-950 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors"
                >
                  Order This Item
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-5 bg-neutral-100 text-neutral-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
