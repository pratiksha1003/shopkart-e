import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CategoryNav from '../categories/CategoryNav';
import Footer from './Footer';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
    <Navbar />
    <CategoryNav />
    <main className="flex-1 animate-fade-in">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
