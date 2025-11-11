import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaTrophy, FaTicketAlt, FaPoundSign, FaEdit, FaCheck, FaTimes, FaShoppingBag, FaHistory, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/common/Button/Button';

const Profile: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        subscribedToNewsletter: user?.subscribedToNewsletter || false,
    });

    // Mock stats - in real app, these would come from API
    const stats = {
        totalEntries: 45,
        totalSpent: 134.55,
        wins: 0,
        activeEntries: 12,
        competitionsEntered: 23,
    };

    // Mock recent entries
    const recentEntries = [
        {
            id: '1',
            competition: '£500 ASOS Voucher',
            tickets: 5,
            date: '2025-01-15',
            status: 'active',
        },
        {
            id: '2',
            competition: 'Luxury Car Giveaway',
            tickets: 3,
            date: '2025-01-14',
            status: 'active',
        },
        {
            id: '3',
            competition: 'Dream Vacation Package',
            tickets: 2,
            date: '2025-01-13',
            status: 'ended',
        },
    ];

    const handleEdit = () => {
        setEditForm({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
            subscribedToNewsletter: user?.subscribedToNewsletter || false,
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (user) {
            updateUser(editForm);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <h2 className="text-3xl font-light text-white mb-4 ">
                            Please log in to view your profile
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-black py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-light text-white mb-2  gold-text-glow">
                        My Profile
                    </h1>
                    <p className="text-white/60 text-sm font-light uppercase tracking-wider">
                        Manage your account and entries
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-black border border-gold-primary/20 rounded-lg p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-24 h-24 rounded-full bg-gold-primary/20 border-2 border-gold-primary/30 flex items-center justify-center">
                                    <FaUser className="w-12 h-12 text-gold-primary" />
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={handleEdit}
                                        className="p-2 text-gold-primary hover:bg-gold-primary/10 rounded-lg transition-colors"
                                        title="Edit Profile"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white/70 text-xs font-light mb-2 uppercase tracking-wider">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.firstName}
                                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/70 text-xs font-light mb-2 uppercase tracking-wider">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.lastName}
                                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/70 text-xs font-light mb-2 uppercase tracking-wider">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="newsletter"
                                            checked={editForm.subscribedToNewsletter}
                                            onChange={(e) => setEditForm({ ...editForm, subscribedToNewsletter: e.target.checked })}
                                            className="w-5 h-5 text-gold-primary bg-black border-gold-primary/30 rounded focus:ring-gold-primary/50"
                                        />
                                        <label htmlFor="newsletter" className="text-white/70 text-sm font-light">
                                            Subscribe to newsletter
                                        </label>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={handleSave}
                                            className="flex-1"
                                        >
                                            <FaCheck className="w-3.5 h-3.5 mr-2" />
                                            Save
                                        </Button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 px-4 py-2 border border-gold-primary/30 rounded-lg text-gold-primary hover:bg-gold-primary/10 transition-colors text-sm font-light flex items-center justify-center gap-2"
                                        >
                                            <FaTimes className="w-3.5 h-3.5" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-light text-white mb-1 ">
                                            {user.firstName} {user.lastName}
                                        </h2>
                                        <p className="text-white/60 text-sm font-light">
                                            {user.role === 'admin' ? 'Administrator' : 'Member'}
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gold-primary/10">
                                        <div className="flex items-center gap-3 text-white/70">
                                            <FaEnvelope className="w-4 h-4 text-gold-primary" />
                                            <span className="text-sm font-light">{user.email}</span>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-3 text-white/70">
                                                <FaPhone className="w-4 h-4 text-gold-primary" />
                                                <span className="text-sm font-light">{user.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-white/70">
                                            <FaCalendarAlt className="w-4 h-4 text-gold-primary" />
                                            <span className="text-sm font-light">
                                                Member since {formatDate(user.createdAt)}
                                            </span>
                                        </div>
                                        {user.isVerified && (
                                            <div className="flex items-center gap-2 pt-2">
                                                <span className="px-3 py-1 rounded-full text-xs font-light bg-green-500/20 text-green-400 border border-green-500/30">
                                                    Verified Account
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-black border border-gold-primary/20 rounded-lg p-6"
                        >
                            <h3 className="text-xl font-light text-white mb-6 ">
                                Your Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center">
                                            <FaTicketAlt className="w-5 h-5 text-gold-primary" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-light uppercase tracking-wider">Total Entries</p>
                                            <p className="text-gold-primary text-lg font-light">{stats.totalEntries}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center">
                                            <FaPoundSign className="w-5 h-5 text-gold-primary" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-light uppercase tracking-wider">Total Spent</p>
                                            <p className="text-gold-primary text-lg font-light">£{stats.totalSpent.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center">
                                            <FaTrophy className="w-5 h-5 text-gold-primary" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-light uppercase tracking-wider">Wins</p>
                                            <p className="text-gold-primary text-lg font-light">{stats.wins}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center">
                                            <FaShoppingBag className="w-5 h-5 text-gold-primary" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-light uppercase tracking-wider">Active Entries</p>
                                            <p className="text-gold-primary text-lg font-light">{stats.activeEntries}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Activity & Recent Entries */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-black border border-gold-primary/20 rounded-lg p-6"
                        >
                            <h3 className="text-xl font-light text-white mb-4 ">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="p-4 bg-black border border-gold-primary/20 rounded-lg hover:border-gold-primary/50 transition-all duration-300 text-left group">
                                    <FaTicketAlt className="w-5 h-5 text-gold-primary mb-2" />
                                    <p className="text-white font-light text-sm mb-1">My Entries</p>
                                    <p className="text-white/60 text-xs font-light">View all entries</p>
                                </button>
                                <button className="p-4 bg-black border border-gold-primary/20 rounded-lg hover:border-gold-primary/50 transition-all duration-300 text-left group">
                                    <FaHistory className="w-5 h-5 text-gold-primary mb-2" />
                                    <p className="text-white font-light text-sm mb-1">Order History</p>
                                    <p className="text-white/60 text-xs font-light">View past orders</p>
                                </button>
                                <button className="p-4 bg-black border border-gold-primary/20 rounded-lg hover:border-gold-primary/50 transition-all duration-300 text-left group">
                                    <FaCog className="w-5 h-5 text-gold-primary mb-2" />
                                    <p className="text-white font-light text-sm mb-1">Settings</p>
                                    <p className="text-white/60 text-xs font-light">Account settings</p>
                                </button>
                            </div>
                        </motion.div>

                        {/* Recent Entries */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-black border border-gold-primary/20 rounded-lg p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-light text-white ">
                                    Recent Entries
                                </h3>
                                <button className="text-gold-primary text-sm font-light hover:text-gold-light transition-colors">
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentEntries.map((entry, index) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-black border border-gold-primary/10 rounded-lg hover:border-gold-primary/30 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="text-white font-light mb-1">{entry.competition}</h4>
                                            <div className="flex items-center gap-4 text-sm text-white/60">
                                                <span className="font-light">{entry.tickets} ticket{entry.tickets > 1 ? 's' : ''}</span>
                                                <span className="font-light">•</span>
                                                <span className="font-light">{formatDate(entry.date)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-light border ${entry.status === 'active'
                                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                                }`}>
                                                {entry.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                                {recentEntries.length === 0 && (
                                    <p className="text-white/60 text-sm font-light text-center py-8">
                                        No entries yet. Start entering competitions!
                                    </p>
                                )}
                            </div>
                        </motion.div>

                        {/* Account Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-black border border-gold-primary/20 rounded-lg p-6"
                        >
                            <h3 className="text-xl font-light text-white mb-4 ">
                                Account Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-gold-primary/10">
                                    <span className="text-white/60 text-sm font-light">Account Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-light border ${user.isActive
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                                        }`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gold-primary/10">
                                    <span className="text-white/60 text-sm font-light">Email Verified</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-light border ${user.isVerified
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                        }`}>
                                        {user.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gold-primary/10">
                                    <span className="text-white/60 text-sm font-light">Newsletter</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-light border ${user.subscribedToNewsletter
                                        ? 'bg-gold-primary/20 text-gold-primary border-gold-primary/30'
                                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                        }`}>
                                        {user.subscribedToNewsletter ? 'Subscribed' : 'Not Subscribed'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-white/60 text-sm font-light">Member Since</span>
                                    <span className="text-white text-sm font-light">{formatDate(user.createdAt)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
