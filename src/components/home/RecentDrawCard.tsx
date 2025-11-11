import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTrophy, FaTicketAlt, FaCalendar, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';

export interface RecentDrawCardData {
  id: number | string;
  winner: string;
  location: string;
  prize: string;
  prizeValue?: string;
  ticketNumber: string;
  drawDate: string;
  image: string;
}

interface RecentDrawCardProps {
  draw: RecentDrawCardData;
}

const RecentDrawCard: React.FC<RecentDrawCardProps> = ({ draw }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black-soft border border-gold-primary/30 rounded-lg overflow-hidden hover:shadow-xl hover:border-gold-primary/70 transition-all duration-300 group gold-hover-glow">
        {/* Image */}
        <div className="relative h-[215px] bg-black overflow-hidden">
          <img
            src={draw.image}
            alt={draw.winner}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute top-3 left-3 bg-gold-primary/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-primary gold-glow">
            <span className="text-xs font-bold text-black tracking-widest uppercase">WINNER</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative bg-black-soft border-t border-gold-primary/30">
          {/* Winner Info */}
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold text-navy-light">{draw.winner}</h3>
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-gold-primary" />
              <p className="text-sm font-medium text-navy-primary">{draw.location}</p>
            </div>
          </div>

          {/* Prize Info */}
          <div className="mb-3 flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <FaTrophy className="w-3.5 h-3.5 text-gold-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-navy-light leading-tight">{draw.prize}</p>
              {draw.prizeValue && (
                <p className="text-sm font-bold text-gold-primary mt-1 gold-text-glow">{draw.prizeValue}</p>
              )}
            </div>
          </div>

          {/* Ticket Number */}
          <div className="mb-3 flex items-center gap-3">
            <FaTicketAlt className="w-3.5 h-3.5 text-gold-primary" />
            <p className="text-sm font-medium text-navy-primary">Ticket #{draw.ticketNumber}</p>
          </div>

          {/* Date */}
          <div className="mb-4 flex items-center gap-3">
            <FaCalendar className="w-3.5 h-3.5 text-gold-primary" />
            <p className="text-sm font-medium text-navy-primary">{draw.drawDate}</p>
          </div>

          {/* Watch Live Draw Button */}
          <Link to="/draws" className="block">
            <motion.button
              className="w-full gold-gradient hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider gold-glow hover:gold-glow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlay className="w-3.5 h-3.5" />
              Watch live draw
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentDrawCard;
