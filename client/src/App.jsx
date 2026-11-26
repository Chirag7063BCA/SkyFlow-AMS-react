import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/globalcomp/Navbar';
import LandingPage from './Pages/LandingPage';
import FlightsPage from './Pages/FlightsPage';
import HelpPage from './Pages/HelpPage';
import Footer from './components/globalcomp/Footer';
import LoginSidebar from './components/globalcomp/loginsidebar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-[#001D39]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <LoginSidebar />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
