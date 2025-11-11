import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface CompetitionCardData {
  id: string;
  title: string;
  image: string;
  price: number;
  soldTickets: number;
  maxTickets: number;
  progress: number;
}

interface CompetitionCardProps {
  competition: CompetitionCardData;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-hidden bg-black-soft border border-gold-primary/30 rounded-lg transition-all duration-300 hover:border-gold-primary/70 hover:shadow-xl gold-hover-glow group">
        <div className="relative h-56 bg-black overflow-hidden">
          <img
            src={competition.image}
            alt="Competition Prize"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute top-3 right-3 bg-[#00FF85] backdrop-blur-sm px-3 py-1 rounded-full border border-[#00FF85] electric-green-glow">
            <span className="text-xs font-bold text-black tracking-widest uppercase">LIVE</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-navy-light mb-2 tracking-tight drop-shadow-lg gold-text-glow">
              {competition.title}
            </h3>
          </div>
        </div>
        <div className="p-6 bg-black-soft border-t border-gold-primary/30">
          <div className="border-t border-gold-primary/30 pt-4 mb-4">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-3xl font-bold text-gold-primary gold-text-glow">
                  £{competition.price.toFixed(2)}
                </span>
                <span className="text-xs text-navy-primary ml-1 font-medium">per entry</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-navy-primary uppercase tracking-widest font-medium">Entries</div>
                <div className="text-sm font-semibold text-navy-light">
                  {competition.soldTickets.toLocaleString()} / {competition.maxTickets.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-3 w-full bg-black border border-gold-primary/30 rounded-full h-2 overflow-hidden">
              <motion.div
                className="gold-gradient h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${competition.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ boxShadow: '0 0 6px rgba(0, 112, 243, 0.6)' }}
              ></motion.div>
            </div>
          </div>
          <Link to={`/competitions/${competition.id}`} className="block">
            <motion.button
              className="w-full bg-[#00FF85] hover:bg-[#00E677] text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm electric-green-glow hover:electric-green-glow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Now →
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CompetitionCard;
