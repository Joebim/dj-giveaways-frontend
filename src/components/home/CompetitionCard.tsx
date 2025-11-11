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
      <div className="overflow-hidden bg-black border border-gold-primary/20 rounded-lg transition-all duration-300 hover:border-gold-primary/50 hover:shadow-xl hover:shadow-gold-primary/10 group">
        <div className="relative h-56 bg-gray-900 overflow-hidden">
          <img
            src={competition.image}
            alt="Competition Prize"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute top-3 right-3 bg-gold-primary/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-primary">
            <span className="text-xs font-light text-black tracking-widest uppercase">LIVE</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-light text-white mb-2  tracking-tight drop-shadow-lg">
              {competition.title}
            </h3>
          </div>
        </div>
        <div className="p-6 bg-black border-t border-gold-primary/10">
          <div className="border-t border-gold-primary/10 pt-4 mb-4">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-3xl font-light text-gold-primary ">
                  £{competition.price.toFixed(2)}
                </span>
                <span className="text-xs text-gold-primary/60 ml-1 font-light">per entry</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gold-primary/60 uppercase tracking-widest font-light">Entries</div>
                <div className="text-sm font-light text-white/90">
                  {competition.soldTickets.toLocaleString()} / {competition.maxTickets.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-3 w-full bg-black border border-gold-primary/20 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="gold-gradient h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${competition.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              ></motion.div>
            </div>
          </div>
          <Link to={`/competitions/${competition.id}`} className="block">
            <motion.button
              className="w-full gold-gradient hover:opacity-90 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg uppercase tracking-wider text-sm"
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
