import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminSidebar from '../components/LocalComp/AdminComp/AdminSidebar';
import AdminDashboard from '../components/LocalComp/AdminComp/AdminDashboard';
import AdminFlights from '../components/LocalComp/AdminComp/AdminFlights';
import AdminBookings from '../components/LocalComp/AdminComp/AdminBookings';
import AdminPassengers from '../components/LocalComp/AdminComp/AdminPassengers';
import AdminSettings from '../components/LocalComp/AdminComp/AdminSettings';
import AdminFlightBoard from '../components/LocalComp/AdminComp/AdminFlightBoard';
import AdminExportReport from '../components/LocalComp/AdminComp/AdminExportReport';
import AdminNewFlight from '../components/LocalComp/AdminComp/AdminNewFlight';
import AdminAlerts from '../components/LocalComp/AdminComp/AdminAlerts';
import '../components/LocalComp/AdminComp/Admin.css';

const INITIAL_FLIGHTS = [
  {
    flightNumber: 'SF 218',
    origin: 'Dubai (DXB)',
    destination: 'London (LHR)',
    departureTime: '10:45 AM',
    status: 'On Time',
    chipClass: 'on-time',
    aircraft: 'Boeing 777',
  },
  {
    flightNumber: 'SF 405',
    origin: 'New York (JFK)',
    destination: 'Toronto (YYZ)',
    departureTime: '11:20 AM',
    status: 'Delayed',
    chipClass: 'delayed',
    aircraft: 'Airbus A320',
  },
  {
    flightNumber: 'SF 774',
    origin: 'Singapore (SIN)',
    destination: 'Mumbai (BOM)',
    departureTime: '01:15 PM',
    status: 'Boarding',
    chipClass: 'boarding',
    aircraft: 'Boeing 787',
  },
  {
    flightNumber: 'SF 109',
    origin: 'Paris (CDG)',
    destination: 'Berlin (BER)',
    departureTime: '03:00 PM',
    status: 'Scheduled',
    chipClass: 'on-time',
    aircraft: 'Airbus A350',
  },
  {
    flightNumber: 'SF 992',
    origin: 'Tokyo (HND)',
    destination: 'Seoul (ICN)',
    departureTime: '04:30 PM',
    status: 'Scheduled',
    chipClass: 'on-time',
    aircraft: 'Boeing 737',
  },
];

export default function AdminPage() {
  const [adminFlights, setAdminFlights] = useState(INITIAL_FLIGHTS);

  const handleAddFlight = (newFlight) => {
    setAdminFlights((prev) => [newFlight, ...prev]);
  };

  return (
    <div className="admin-page">
      <div className="app-shell">
        <AdminSidebar />
        <main className="main-panel">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route
              path="flights"
              element={<AdminFlights flights={adminFlights} />}
            />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="passengers" element={<AdminPassengers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="flight-board" element={<AdminFlightBoard />} />
            <Route path="export-report" element={<AdminExportReport />} />
            <Route
              path="new-flight"
              element={<AdminNewFlight onAddFlight={handleAddFlight} />}
            />
            <Route path="alerts" element={<AdminAlerts />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
