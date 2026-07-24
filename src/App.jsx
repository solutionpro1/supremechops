import React from 'react';
import SupremeChopsOrder from './components/SupremeChopsOrder';
import PaymentSuccess from './components/PaymentSuccess';
import SupremeAdmin from './components/SupremeAdmin';

function App() {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <SupremeAdmin />;
  }
  if (path === '/payment-success') {
    return <PaymentSuccess />;
  }

  return <SupremeChopsOrder />;
}

export default App;