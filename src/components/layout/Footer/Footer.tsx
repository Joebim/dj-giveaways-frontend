import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaInstagram,
} from 'react-icons/fa';
import MapSvg from "../../../assets/mckinney-map.svg";
import PaymentMethodsSvg from "../../../assets/payment_methods.svg";
import Fundraiser from "../../../assets/fundraiser.png";
import BeGambleAware from "../../../assets/begambleawareorg_white.png";
import { motion } from 'framer-motion';
import { SOCIAL_LINKS, CONTACT_INFO } from '../../../utils/constants';

const Footer: React.FC = () => {
    const socialLinks = [
        { icon: FaFacebookF, href: SOCIAL_LINKS.FACEBOOK, label: "Facebook" },
        { icon: FaInstagram, href: SOCIAL_LINKS.INSTAGRAM, label: "Instagram" },
    ];

    return (
        <footer className="bg-black-soft text-navy-primary border-t border-gold-primary/30">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-0">
                {/* Newsletter Section */}
                <div className="py-[80px] border-b border-gold-primary/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="shrink-0">
                            <h2 className="text-4xl font-bold text-navy-light mb-0 ">
                                Subscribe to our <span className="text-gold-primary gold-text-glow">Newsletter</span>
                            </h2>
                        </div>
                        <div className="flex-1 max-w-md">
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-black border border-gold-primary/30 rounded-full px-5 py-3 text-navy-light placeholder-navy-primary/50 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary transition-all"
                                />
                                <button
                                    type="submit"
                                    className="gold-gradient hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 whitespace-nowrap gold-glow"
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
                        <h3 className="text-xl font-bold mb-6 text-navy-light">About <span className="text-gold-primary gold-text-glow">DJ Giveaways</span></h3>
                        <p className="text-sm text-navy-primary leading-relaxed mb-6 font-medium">
                            DJ Giveaways are the UK and Ireland's leading competition company, providing premium prizes and unforgettable experiences.
                        </p>
                        <p className="text-sm text-navy-primary leading-relaxed mb-6 font-medium">
                            This site is for adults 18+. By accessing this website, you confirm that you are over 18 and understand the risks associated with gambling. If you're underage, please leave now. Gamble responsibly. Find out more at{' '}
                            <a href="https://www.gambleaware.org" target="_blank" rel="noopener noreferrer" className="text-gold-primary hover:text-gold-light transition-colors font-semibold gold-link">
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
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="w-10 h-10 bg-black border border-gold-primary/30 rounded-full hover:bg-gold-primary hover:border-gold-primary transition-all duration-300 flex items-center justify-center group gold-hover-glow"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="w-4 h-4 text-navy-primary group-hover:text-black transition-colors duration-300" />
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
                        <h3 className="text-xl font-bold mb-6 text-navy-light">Useful <span className="text-gold-primary gold-text-glow">Links</span></h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            <ul className="space-y-2 text-sm text-navy-primary">
                                <li><Link to="/legal/terms" className="hover:text-gold-primary transition-colors font-medium gold-link">Terms & conditions</Link></li>
                                <li><Link to="/legal/terms-of-use" className="hover:text-gold-primary transition-colors font-medium gold-link">Terms of use</Link></li>
                                <li><Link to="/legal/acceptable-use" className="hover:text-gold-primary transition-colors font-medium gold-link">Acceptable use</Link></li>
                                <li><Link to="/legal/privacy" className="hover:text-gold-primary transition-colors font-medium gold-link">Privacy policy</Link></li>
                                <li><Link to="/support/faq" className="hover:text-gold-primary transition-colors font-medium gold-link">FAQ's</Link></li>
                            </ul>
                            <ul className="space-y-2 text-sm text-navy-primary">
                                <li><Link to="/contact" className="hover:text-gold-primary transition-colors font-medium gold-link">Contact</Link></li>
                                <li><Link to="/draws" className="hover:text-gold-primary transition-colors font-medium gold-link">Recent Draws</Link></li>
                                <li><Link to="/winners" className="hover:text-gold-primary transition-colors font-medium gold-link">Champions</Link></li>
                                <li><Link to="/support/complaints" className="hover:text-gold-primary transition-colors font-medium gold-link">Complaints</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Get in Touch */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-navy-light">Get in <span className="text-gold-primary gold-text-glow">Touch</span></h3>
                        <ul className="space-y-3 text-sm text-navy-primary font-medium">
                            <li>{CONTACT_INFO.ADDRESS.LINE1}<br />{CONTACT_INFO.ADDRESS.CITY}<br />{CONTACT_INFO.ADDRESS.POSTCODE}</li>
                            <li><a href={`mailto:${CONTACT_INFO.EMAIL}`} className="text-gold-primary hover:text-gold-light transition-colors gold-link">{CONTACT_INFO.EMAIL}</a></li>
                            <li>Phone: {CONTACT_INFO.PHONE}</li>
                        </ul>
                    </div>

                    {/* UK & Ireland Map */}
                    <div className="relative">
                        <img src={MapSvg} alt="UK & Ireland Map" className="w-full h-full" />
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gold-primary/30 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-sm text-navy-primary text-center md:text-left font-medium">
                            © 2025 <span className="text-gold-primary font-bold gold-text-glow">DJ Giveaways</span>
                        </div>
                        <div className="text-sm text-navy-primary font-medium">
                            Domain: <span className="text-gold-primary font-semibold">{CONTACT_INFO.DOMAIN}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src={PaymentMethodsSvg} alt="Payment Methods" className="h-8 w-auto opacity-80" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
