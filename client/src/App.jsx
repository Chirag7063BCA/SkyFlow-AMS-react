import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './Pages/AdminPage';
import FlightsPage from './Pages/FlightsPage';
import HelpPage from './Pages/Help/HelpPage';
import LandingPage from './Pages/LandingPage';
import NotFoundPage from './Pages/NotFoundPage';
import TrackFlightPage from './Pages/TrackFlightPage';
import AppLayout from './components/globalcomp/AppLayout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="flights" element={<FlightsPage />} />
            <Route path="track" element={<TrackFlightPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
