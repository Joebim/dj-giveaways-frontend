import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCartStore } from '../../../store/useCartStore';
import { authService } from '../../../services/authService';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const { itemCount } = useCartStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
            toast.success('You have been logged out successfully.');
            navigate('/');
            setIsMobileMenuOpen(false);
        } catch {
            logout();
            toast.success('You have been logged out successfully.');
            navigate('/');
            setIsMobileMenuOpen(false);
        }
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gold-primary/30 shadow-lg">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
                <div className="flex justify-between items-center h-20">
                    {/* Logo - Bigger */}
                    <Link to="/" className="flex items-center group">
                        <img
                            src="https://res.cloudinary.com/dm3586huj/image/upload/v1762851347/logo_yivjk7.png"
                            alt="DJ Giveaways Logo"
                            className="h-14 object-contain transition-opacity duration-300 group-hover:opacity-80"
                        />
                    </Link>

                    {/* Desktop Navigation - Elegant and Minimal - Bigger */}
                    <nav className="hidden md:flex items-center gap-10">
                        <Link
                            to="/"
                            className={`relative text-base font-semibold tracking-wider uppercase transition-all duration-300 ${isActive('/')
                                ? 'text-gold-primary gold-text-glow'
                                : 'text-navy-primary hover:text-gold-primary'
                                }`}
                        >
                            Home
                            {isActive('/') && (
                                <motion.div
                                    className="absolute -bottom-1 left-0 right-0 h-px gold-gradient"
                                    layoutId="activeTab"
                                    initial={false}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </Link>
                        <Link
                            to="/competitions"
                            className={`relative text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${isActive('/competitions')
                                ? 'text-gold-primary gold-text-glow'
                                : 'text-navy-primary hover:text-gold-primary'
                                }`}
                        >
                            Live Competitions
                            {isActive('/competitions') && (
                                <motion.div
                                    className="absolute -bottom-1 left-0 right-0 h-px gold-gradient"
                                    layoutId="activeTab"
                                    initial={false}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </Link>
                        <Link
                            to="/winners"
                            className={`relative text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${isActive('/winners')
                                ? 'text-gold-primary gold-text-glow'
                                : 'text-navy-primary hover:text-gold-primary'
                                }`}
                        >
                            Past Winners
                            {isActive('/winners') && (
                                <motion.div
                                    className="absolute -bottom-1 left-0 right-0 h-px gold-gradient"
                                    layoutId="activeTab"
                                    initial={false}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </Link>
                        <Link
                            to="/about"
                            className={`relative text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${isActive('/about')
                                ? 'text-gold-primary gold-text-glow'
                                : 'text-navy-primary hover:text-gold-primary'
                                }`}
                        >
                            About
                            {isActive('/about') && (
                                <motion.div
                                    className="absolute -bottom-1 left-0 right-0 h-px gold-gradient"
                                    layoutId="activeTab"
                                    initial={false}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </Link>
                        <Link
                            to="/contact"
                            className={`relative text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${isActive('/contact')
                                ? 'text-gold-primary gold-text-glow'
                                : 'text-navy-primary hover:text-gold-primary'
                                }`}
                        >
                            Contact
                            {isActive('/contact') && (
                                <motion.div
                                    className="absolute -bottom-1 left-0 right-0 h-px gold-gradient"
                                    layoutId="activeTab"
                                    initial={false}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </Link>
                    </nav>

                    {/* User Actions - Minimalist - Bigger */}
                    <div className="flex items-center gap-5">
                        {/* Cart Icon - Always Visible */}
                        <Link to="/cart" className="relative p-2.5 text-navy-primary hover:text-gold-primary transition-colors group">
                            <FaShoppingCart className="w-6 h-6" />
                            {itemCount > 0 && (
                                <motion.span
                                    className="absolute -top-1 -right-1 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-black neon-orange-glow"
                                    style={{ backgroundColor: '#FF9500' }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="p-2.5 text-navy-primary hover:text-gold-primary transition-colors">
                                    <FaUser className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-navy-primary hover:text-gold-primary transition-colors"
                                    aria-label="Logout"
                                >
                                    <FaSignOutAlt className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 border-l border-gold-primary/30 pl-5">
                                <Link to="/auth/login">
                                    <button className="text-sm font-semibold tracking-wider uppercase text-navy-primary hover:text-gold-primary transition-colors">
                                        Sign In
                                    </button>
                                </Link>
                                <Link to="/auth/register">
                                    <button className="text-sm font-semibold tracking-wider uppercase px-6 py-2 border border-gold-primary/50 text-gold-primary hover:bg-gold-primary/10 hover:border-gold-primary transition-all duration-300 bg-transparent gold-hover-glow">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 text-navy-primary hover:text-gold-primary transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        className="md:hidden bg-black-soft/98 backdrop-blur-md border-t border-gold-primary/30 py-4 shadow-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <nav className="flex flex-col gap-1">
                            {[
                                { path: '/', label: 'Home' },
                                { path: '/competitions', label: 'Live Competitions' },
                                { path: '/winners', label: 'Past Winners' },
                                { path: '/about', label: 'About' },
                                { path: '/contact', label: 'Contact' },
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2.5 text-sm font-semibold tracking-wider uppercase transition-colors ${isActive(item.path)
                                        ? 'text-gold-primary bg-gold-primary/20 gold-text-glow'
                                        : 'text-navy-primary hover:text-gold-primary hover:bg-gold-primary/10'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Auth Actions */}
                        <div className="border-t border-gold-primary/10 mt-4 pt-4">
                            {isAuthenticated ? (
                                <div className="flex flex-col gap-1 px-4">
                                    <Link
                                        to="/cart"
                                        className="px-4 py-2.5 text-sm font-semibold tracking-wider uppercase text-navy-primary hover:text-gold-primary transition-colors flex items-center gap-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaShoppingCart className="w-3.5 h-3.5" />
                                        Cart {itemCount > 0 && `(${itemCount})`}
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="px-4 py-2.5 text-sm font-semibold tracking-wider uppercase text-navy-primary hover:text-gold-primary transition-colors flex items-center gap-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaUser className="w-3.5 h-3.5" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2.5 text-sm font-semibold tracking-wider uppercase text-navy-primary hover:text-red-400 transition-colors flex items-center gap-2 text-left"
                                    >
                                        <FaSignOutAlt className="w-3.5 h-3.5" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 px-4">
                                    <Link
                                        to="/auth/login"
                                        className="px-4 py-2.5 text-sm font-semibold tracking-wider uppercase text-navy-primary hover:text-gold-primary transition-colors text-center border border-gold-primary/30 bg-transparent"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/auth/register"
                                        className="px-4 py-2.5 text-sm font-semibold tracking-wider uppercase text-gold-primary hover:bg-gold-primary/10 transition-colors text-center border border-gold-primary/50 bg-transparent gold-hover-glow"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
};

export default Header;
