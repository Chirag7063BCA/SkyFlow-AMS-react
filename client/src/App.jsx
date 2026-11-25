import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Navbar from './components/globalcomp/Navbar';
import LandingPage from './Pages/LandingPage';
import FlightsPage from './Pages/FlightsPage';
import Footer from './components/globalcomp/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#001D39]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
