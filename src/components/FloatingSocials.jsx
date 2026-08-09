import React from 'react';

export default function FloatingSocials() {
  const socials = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/supremechopsintl?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      bgGradient: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
      hoverGlow: 'hover:shadow-rose-500/40',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@olamilekan36888?is_from_webapp=1&sender_device=pc',
      bgGradient: 'bg-black border border-neutral-800',
      hoverGlow: 'hover:shadow-cyan-500/40',
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .56.05.82.13V9.4a6.84 6.84 0 00-1-.07A6.33 6.33 0 003 15.66 6.33 6.33 0 009.33 22a6.33 6.33 0 006.33-6.33V9.28a8.16 8.16 0 004.8 1.55V7.37a4.85 4.85 0 01-.87-.68z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/supremechopsintl',
      bgGradient: 'bg-[#1877F2]',
      hoverGlow: 'hover:shadow-blue-500/40',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className={`w-11 h-11 rounded-full text-white ${social.bgGradient} flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-90 hover:shadow-xl ${social.hoverGlow}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
