import React from 'react';
import SupremeChopsOrder from './components/SupremeChopsOrder';
import { HoursNoticeModal } from './components/HoursNoticeModal';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Site Entrance Operating Hours Popup */}
      <HoursNoticeModal />

      {/* Main Supreme Chops Application */}
      <SupremeChopsOrder />
    </div>
  );
}
