import React from 'react';
import { motion } from 'framer-motion';
import RecentDrawCard from '../../components/home/RecentDrawCard';
import { DUMMY_RECENT_DRAWS } from '../../data/dummyData';

const Winners: React.FC = () => {
    // Use dummy data with champion images
    const allWinners = [
        ...DUMMY_RECENT_DRAWS,
        {
            id: "4",
            winner: "Michael O'Connor",
            location: "Dublin",
            prize: "Bentley Continental GT",
            prizeValue: "£180,000",
            ticketNumber: "8950",
            drawDate: "Fri 17th January 2025 8:00 PM",
            image: "https://res.cloudinary.com/dm3586huj/image/upload/v1762865832/champion1_hjvlqc.jpg",
        },
        {
            id: "5",
            winner: "Lisa Williams",
            location: "Birmingham",
            prize: "Range Rover SV",
            prizeValue: "£120,000",
            ticketNumber: "15680",
            drawDate: "Wed 15th January 2025 8:00 PM",
            image: "https://res.cloudinary.com/dm3586huj/image/upload/v1762865833/champion_2_o6fyvo.jpg",
        },
        {
            id: "6",
            winner: "David Brown",
            location: "Liverpool",
            prize: "Lexus LS 500",
            prizeValue: "£75,000",
            ticketNumber: "19850",
            drawDate: "Mon 13th January 2025 8:00 PM",
            image: "https://res.cloudinary.com/dm3586huj/image/upload/v1762865832/chaampion_3_v6vlgq.jpg",
        },
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
                    <h1 className="text-5xl font-bold text-navy-light mb-4 tracking-tight">
                        Past <span className="text-gold-primary gold-text-glow">Winners</span>
                    </h1>
                    <p className="text-navy-primary text-sm font-medium tracking-wide uppercase">Celebrating Our Champions</p>
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
