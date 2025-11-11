import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaHeart, FaAward } from 'react-icons/fa';

const About: React.FC = () => {
    const features = [
        {
            icon: FaTrophy,
            title: "Premium Prizes",
            description: "We offer the most luxurious and exciting prizes in the UK and Ireland."
        },
        {
            icon: FaUsers,
            title: "Trusted by Thousands",
            description: "Join over 500,000 satisfied customers who trust DJ Giveaways."
        },
        {
            icon: FaHeart,
            title: "Charity Support",
            description: "We've donated over £550,000 to charitable causes across the UK."
        },
        {
            icon: FaAward,
            title: "Award Winning",
            description: "Recognized as the UK and Ireland's leading competition company."
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="py-32 bg-black border-b border-gold-primary/20">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
                    <motion.h1
                        className="text-6xl font-light text-navy-light mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        About <span className="text-gold-primary">DJ Giveaways</span>
                    </motion.h1>
                    <motion.p
                        className="text-xl text-white/80 font-light max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        The UK and Ireland's leading competition company, providing premium prizes and unforgettable experiences.
                    </motion.p>
                </div>
            </section>

            {/* About Content */}
            <section className="py-20 bg-black">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-light text-navy-light mb-6 tracking-tight">
                                Our Story
                            </h2>
                            <p className="text-white/80 leading-relaxed mb-4 font-light">
                                Top Gear Autos NI LTD, trading as McKinney Competitions, Company Number NI667309. We are the UK and Ireland's leading competition company, dedicated to providing exciting and fair competitions with premium prizes.
                            </p>
                            <p className="text-white/80 leading-relaxed mb-4 font-light">
                                Since our inception, we've awarded over £65 million in prizes and created thousands of happy winners. Our commitment to transparency, fairness, and customer satisfaction has made us a trusted name in the competition industry.
                            </p>
                            <p className="text-white/70 leading-relaxed font-light">
                                We believe in giving back, which is why we've donated over £550,000 to charitable causes across the UK and Ireland, supporting communities and making a positive impact.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-black-soft border border-gold-primary/30 rounded-lg p-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="text-2xl font-light text-navy-light mb-6 tracking-tight">Company Details</h3>
                            <ul className="space-y-4 text-white/80 font-light">
                                <li><strong className="text-gold-primary">Company Name:</strong> Top Gear Autos NI LTD</li>
                                <li><strong className="text-gold-primary">Trading As:</strong> McKinney Competitions</li>
                                <li><strong className="text-gold-primary">Company Number:</strong> NI667309</li>
                                <li><strong className="text-gold-primary">Location:</strong> UK & Ireland</li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="bg-black-soft border border-gold-primary/30 rounded-lg p-6 text-center hover:border-gold-primary/50 transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="w-16 h-16 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-gold-primary" />
                                    </div>
                                    <h3 className="text-xl font-light text-navy-light mb-3 tracking-tight">{feature.title}</h3>
                                    <p className="text-white/70 text-sm font-light">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Responsible Gambling */}
            <section className="py-20 bg-black-soft border-t border-gold-primary/30">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-light text-navy-light mb-6 tracking-tight">
                            Responsible <span className="text-gold-primary">Gambling</span>
                        </h2>
                        <p className="text-white/80 leading-relaxed mb-6 font-light">
                            This site is for adults 18+. By accessing this website, you confirm that you are over 18 and understand the risks associated with gambling. If you're underage, please leave now.
                        </p>
                        <p className="text-white/70 leading-relaxed mb-6 font-light">
                            Gamble responsibly. Find out more at{' '}
                            <a href="https://www.gambleaware.org" target="_blank" rel="noopener noreferrer" className="text-gold-primary hover:text-gold-light transition-colors font-medium underline">
                                www.gambleaware.org
                            </a>.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
