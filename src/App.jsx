import React from 'react';
import SupremeChopsOrder from './components/SupremeChopsOrder';
import SupremeChopsAdmin from './components/SupremeChopsAdmin';

function App() {
  // Simple check if URL contains '/admin' or path toggle parameters
  const isAdminView = window.location.pathname === '/admin';

  return isAdminView ? <SupremeChopsAdmin /> : <SupremeChopsOrder />;
}

export default App;