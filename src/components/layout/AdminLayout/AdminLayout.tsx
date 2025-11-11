import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaChartBar, 
  FaTrophy, 
  FaGift, 
  FaUsers, 
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome
} from 'react-icons/fa';
import { useAuthStore } from '../../../store/useAuthStore';
import { authService } from '../../../services/authService';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore error
    }
    logout();
    toast.success('You have been logged out successfully.');
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaChartBar },
    { name: 'Competitions', href: '/admin/competitions', icon: FaGift },
    { name: 'Draws', href: '/admin/draws', icon: FaClipboardList },
    { name: 'Champions', href: '/admin/champions', icon: FaTrophy },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-gold-primary/10 transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gold-primary/10">
            <Link to="/admin/dashboard" className="flex items-center">
              <img
                src="https://res.cloudinary.com/dtaegi6gk/image/upload/v1761790589/RC_transp_landsc_tcykeq.png"
                alt="DJ Giveaways Logo"
                className="h-12 object-contain"
              />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white/80 hover:text-gold-primary transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gold-primary/20 text-gold-primary border-l-2 border-gold-primary'
                      : 'text-white/70 hover:bg-gold-primary/10 hover:text-gold-primary'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-light text-sm uppercase tracking-wider">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="px-4 py-4 border-t border-gold-primary/10">
            <div className="flex items-center mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-primary font-bold text-sm">
                {user?.firstName?.[0]?.toUpperCase() || 'A'}
                {user?.lastName?.[0]?.toUpperCase() || 'D'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-light text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gold-primary/70">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 rounded-lg text-white/70 hover:bg-gold-primary/10 hover:text-gold-primary transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4 mr-3" />
              <span className="text-sm font-light">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-black/80 backdrop-blur-md border-b border-gold-primary/10 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-white/80 hover:text-gold-primary transition-colors"
            >
              <FaBars className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-sm text-white/70 hover:text-gold-primary transition-colors font-light"
              >
                <FaHome className="w-4 h-4" />
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8 bg-black min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

