import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const contactInfo = [
        {
            icon: FaMapMarkerAlt,
            title: "Address",
            details: [
                "Unit 6, Hamilton Business Park",
                "132 Tamnamore Road",
                "BT716HW"
            ]
        },
        {
            icon: FaEnvelope,
            title: "Email",
            details: ["info@mckinneycompetitions.com"]
        },
        {
            icon: FaPhone,
            title: "Phone",
            details: [
                "Armagh: +4428 3799 8210",
                "Dublin: +353 1521 4063",
                "London: +4420 3051 0281"
            ]
        },
        {
            icon: FaClock,
            title: "Business Hours",
            details: [
                "Monday - Friday: 9:00 AM - 6:00 PM",
                "Saturday: 10:00 AM - 4:00 PM",
                "Sunday: Closed"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="py-32 bg-black-soft border-b border-gold-primary/10">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
                    <motion.h1
                        className="text-6xl font-light text-white mb-6  tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Contact <span className="text-gold-primary">Us</span>
                    </motion.h1>
                    <motion.p
                        className="text-xl text-white/70 font-light max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Get in touch with our team. We're here to help with any questions or concerns.
                    </motion.p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 bg-black">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-light text-white mb-8 ">
                                Send us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Input
                                            name="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Input
                                        name="phone"
                                        type="tel"
                                        placeholder="Your Phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="subject"
                                        placeholder="Subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-3 bg-black border border-gold-primary/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary transition-all font-light"
                                        required
                                    />
                                </div>
                                <Button type="submit" variant="primary" size="lg" fullWidth withBrackets>
                                    Send Message
                                </Button>
                            </form>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-light text-white mb-8 ">
                                Get in Touch
                            </h2>
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    return (
                                        <motion.div
                                            key={index}
                                            className="bg-black-soft border border-gold-primary/20 rounded-lg p-6 hover:border-gold-primary/50 transition-all duration-300"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-6 h-6 text-gold-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-light text-white mb-2 ">
                                                        {info.title}
                                                    </h3>
                                                    {info.details.map((detail, idx) => (
                                                        <p key={idx} className="text-white/70 font-light">
                                                            {detail}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
