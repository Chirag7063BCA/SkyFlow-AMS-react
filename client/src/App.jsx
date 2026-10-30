import React from 'react';
import Navbar from './components/globalcomp/Navbar';
import LandingPage from './Pages/LandingPage';
import Footer from './components/globalcomp/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#001D39]">
      <Navbar />

      <main className="flex-1">
        <LandingPage />
      </main>

      <Footer />
    </div>
  );
}

export default App;
