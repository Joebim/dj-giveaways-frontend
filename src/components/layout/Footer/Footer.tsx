import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaSnapchat,
    FaTiktok,
    FaYoutube,
    FaEnvelope
} from 'react-icons/fa';
import MapSvg from "../../../assets/mckinney-map.svg";
import PaymentMethodsSvg from "../../../assets/payment_methods.svg";
import Fundraiser from "../../../assets/fundraiser.png";
import BeGambleAware from "../../../assets/begambleawareorg_white.png";
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    const socialLinks = [
        { icon: FaFacebookF, href: "#", label: "Facebook" },
        { icon: FaTwitter, href: "#", label: "Twitter" },
        { icon: FaInstagram, href: "#", label: "Instagram" },
        { icon: FaSnapchat, href: "#", label: "Snapchat" },
        { icon: FaTiktok, href: "#", label: "TikTok" },
        { icon: FaYoutube, href: "#", label: "YouTube" },
        { icon: FaEnvelope, href: "#", label: "Email" },
    ];

    return (
        <footer className="bg-black-soft text-white border-t border-gold-primary/10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-0">
                {/* Newsletter Section */}
                <div className="py-[80px] border-b border-gold-primary/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="shrink-0">
                            <h2 className="text-4xl font-light text-white mb-0 ">
                                Subscribe to our <span className="text-gold-primary">Newsletter</span>
                            </h2>
                        </div>
                        <div className="flex-1 max-w-md">
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-black border border-gold-primary/30 rounded-full px-5 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary transition-all"
                                />
                                <button
                                    type="submit"
                                    className="gold-gradient hover:opacity-90 text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer Content */}
                <div className="py-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* About Us */}
                    <div>
                        <h3 className="text-xl font-light mb-6 ">About <span className="text-gold-primary">Us</span></h3>
                        <p className="text-sm text-white/60 leading-relaxed mb-6 font-light">
                            Top Gear Autos NI LTD, trading as McKinney Competitions, Company Number NI667309. McKinney Competitions are the UK and Ireland's leading competition company.
                        </p>
                        <p className="text-sm text-white/60 leading-relaxed mb-6 font-light">
                            This site is for adults 18+. By accessing this website, you confirm that you are over 18 and understand the risks associated with gambling. If you're underage, please leave now. Gamble responsibly. Find out more at{' '}
                            <a href="https://www.gambleaware.org" target="_blank" rel="noopener noreferrer" className="text-gold-primary hover:text-gold-light transition-colors font-medium">
                                www.gambleaware.org
                            </a>.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3 mb-6">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="w-10 h-10 bg-black-soft border border-gold-primary/30 rounded-full hover:bg-gold-primary hover:border-gold-primary transition-all duration-300 flex items-center justify-center group"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="w-4 h-4 text-white/80 group-hover:text-black transition-colors duration-300" />
                                    </motion.a>
                                );
                            })}
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-8">
                            <img src={Fundraiser} alt="Fundraiser" className="h-[47px]" />
                            <img src={BeGambleAware} alt="BeGambleAware" className="h-[20px]" />
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-xl font-light mb-6 ">Useful <span className="text-gold-primary">Links</span></h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            <ul className="space-y-2 text-sm text-white/60">
                                <li><Link to="/terms" className="hover:text-gold-primary transition-colors font-light">Terms & conditions</Link></li>
                                <li><Link to="/terms-of-use" className="hover:text-gold-primary transition-colors font-light">Terms of use</Link></li>
                                <li><Link to="/acceptable-use" className="hover:text-gold-primary transition-colors font-light">Acceptable use</Link></li>
                                <li><Link to="/privacy" className="hover:text-gold-primary transition-colors font-light">Privacy policy</Link></li>
                                <li><Link to="/faq" className="hover:text-gold-primary transition-colors font-light">FAQ's</Link></li>
                            </ul>
                            <ul className="space-y-2 text-sm text-white/60">
                                <li><Link to="/contact" className="hover:text-gold-primary transition-colors font-light">Contact</Link></li>
                                <li><Link to="/draws" className="hover:text-gold-primary transition-colors font-light">Recent Draws</Link></li>
                                <li><Link to="/winners" className="hover:text-gold-primary transition-colors font-light">Champions</Link></li>
                                <li><Link to="/complaints" className="hover:text-gold-primary transition-colors font-light">Complaints</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Get in Touch */}
                    <div>
                        <h3 className="text-xl font-light mb-6 ">Get in <span className="text-gold-primary">Touch</span></h3>
                        <ul className="space-y-3 text-sm text-white/60 font-light">
                            <li>Unit 6, Hamilton Business Park,<br />132 Tamnamore Road.<br />BT716HW</li>
                            <li>info@mckinneycompetitions.com</li>
                            <li>Armagh: +4428 3799 8210</li>
                            <li>Dublin: +353 1521 4063</li>
                            <li>London: +4420 3051 0281</li>
                        </ul>
                    </div>

                    {/* UK & Ireland Map */}
                    <div className="relative">
                        <img src={MapSvg} alt="UK & Ireland Map" className="w-full h-full" />
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gold-primary/10 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-sm text-white/60 text-center md:text-left font-light">
                            © 2025 <span className="text-gold-primary font-medium">McKinney Competitions</span>
                        </div>
                        <div className="text-sm text-white/60 font-light">
                            Powered by <span className="text-gold-primary font-medium">WebsiteNI</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src={PaymentMethodsSvg} alt="Payment Methods" className="h-8 w-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
