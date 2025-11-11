import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

export interface ChampionCardData {
  id: string;
  name: string;
  image: string;
  quote: string;
}

interface ChampionCardProps {
  champion: ChampionCardData;
}

const ChampionCard: React.FC<ChampionCardProps> = ({ champion }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black-soft border border-gold-primary/30 rounded-lg overflow-hidden hover:shadow-xl hover:border-gold-primary/70 transition-all duration-300 group gold-hover-glow">
      <div className="relative h-[292px] overflow-hidden">
        <img
          src={champion.image}
          alt={champion.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
      </div>
        <div className="p-6 bg-black-soft border-t border-gold-primary/30">
        <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-primary/20 border border-gold-primary/50 mb-2 gold-hover-glow">
              <FaQuoteLeft className="w-5 h-5 text-gold-primary" />
            </div>
          </div>
          <p className="text-navy-primary text-sm leading-relaxed italic font-medium">
          {champion.quote}
        </p>
          <div className="mt-4 pt-4 border-t border-gold-primary/30">
            <p className="text-sm font-bold text-gold-primary gold-text-glow">— {champion.name}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChampionCard;
