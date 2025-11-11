import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SharedSections from './SharedSections';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    
    // Show shared sections on all pages except home (which has its own), auth, and admin pages
    const shouldShowSharedSections = 
        location.pathname !== '/' &&
        !location.pathname.startsWith('/auth') &&
        !location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen flex flex-col bg-black">
            <Header />
            <main className="flex-1 pt-20">
                {children}
                {/* Show shared sections on all user pages (logged in or not) except home and auth/admin */}
                {shouldShowSharedSections && <SharedSections />}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
