import { Outlet } from 'react-router-dom';
import Footer from './Footer/Footer';
import LoginSidebar from './LoginSidebar/LoginSidebar';
import Navbar from './Navbar/Navbar';

export default function AppLayout() {
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
