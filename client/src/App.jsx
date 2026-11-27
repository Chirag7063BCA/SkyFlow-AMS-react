import { useEffect } from 'react';
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './Pages/AdminPage';
import FlightsPage from './Pages/FlightsPage';
import HelpPage from './Pages/Help/HelpPage';
import LandingPage from './Pages/LandingPage';
import MyBookingsPage from './Pages/MyBookingsPage';
import NotFoundPage from './Pages/NotFoundPage';
import TrackFlightPage from './Pages/TrackFlightPage';
import Footer from './components/globalcomp/Footer/Footer';
import LoginSidebar from './components/globalcomp/LoginSidebar/LoginSidebar';
import Navbar from './components/globalcomp/Navbar/Navbar';
import { scrollToTop } from './utils/scrollToTop';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop(220);
  }, [pathname]);

  return null;
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#001D39]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LoginSidebar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="flights" element={<FlightsPage />} />
            <Route path="track" element={<TrackFlightPage />} />
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
