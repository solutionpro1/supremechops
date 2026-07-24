import React from 'react';
import SupremeChopsOrder from './components/SupremeChopsOrder';
import SupremeAdmin from './components/SupremeAdmin'; // Match your actual file name!

function App() {
  // Check if URL path routes to /admin
  const isAdminView = window.location.pathname === '/admin';

  return isAdminView ? <SupremeAdmin /> : <SupremeChopsOrder />;
}

export default App;