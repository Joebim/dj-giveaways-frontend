import React from 'react';
import { motion } from 'framer-motion';
import RecentDrawCard from '../../components/home/RecentDrawCard';
import homeData from '../../data/homeData.json';

const Winners: React.FC = () => {
    // Generate more winners by duplicating and varying
    const allWinners = [
        ...homeData.recentDraws,
        ...homeData.recentDraws.map((draw, idx) => ({
            ...draw,
            id: draw.id + idx + 4,
            winner: `Winner ${idx + 4}`,
        })),
        ...homeData.recentDraws.map((draw, idx) => ({
            ...draw,
            id: draw.id + idx + 7,
            winner: `Winner ${idx + 7}`,
        })),
    ];

    return (
        <div className="min-h-screen bg-black py-16">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-light text-white mb-4  tracking-tight">
                        Past <span className="text-gold-primary">Winners</span>
                    </h1>
                    <p className="text-white/60 text-sm font-light tracking-wide uppercase">Celebrating Our Champions</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allWinners.map((draw, index) => (
                        <motion.div
                            key={draw.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                        >
                            <RecentDrawCard draw={draw} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Winners;
