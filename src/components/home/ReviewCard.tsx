import React from 'react';
import { FaStar, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

export interface ReviewCardData {
  id: string;
  title: string;
  body: string;
  rating: number;
  reviewer: string;
  timeAgo: string;
  verified: boolean;
}

interface ReviewCardProps {
  review: ReviewCardData;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-black border border-gold-primary/20 rounded-lg p-6 hover:border-gold-primary/50 transition-all duration-300 h-full flex flex-col"
    >
      {/* Star Rating */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <FaStar key={i} className="w-4 h-4 text-gold-primary fill-current" />
          ))}
        </div>
        {review.verified && (
          <div className="flex items-center gap-1 bg-black border border-gold-primary/30 rounded-full px-2 py-1">
            <FaCheck className="w-3 h-3 text-gold-primary" />
            <span className="text-xs text-gold-primary font-light">Verified</span>
          </div>
        )}
      </div>

      {/* Review Title */}
      <h3 className="text-base font-semibold text-white mb-2 font-['Inter']">
        {review.title}
      </h3>

      {/* Review Body */}
      <p className="text-sm text-white/70 leading-relaxed mb-4 font-light flex-grow">
        {review.body}
      </p>

      {/* Reviewer Info */}
      <div className="mt-auto pt-4 border-t border-gold-primary/10">
        <p className="text-xs text-white/50 font-light">
          {review.reviewer}, {review.timeAgo}
        </p>
      </div>
    </motion.div>
  );
};

export default ReviewCard;

