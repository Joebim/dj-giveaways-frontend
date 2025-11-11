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
      className="bg-black-soft border border-gold-primary/30 rounded-lg p-6 hover:border-gold-primary/70 transition-all duration-300 h-full flex flex-col gold-hover-glow"
    >
      {/* Star Rating */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <FaStar key={i} className="w-4 h-4 text-gold-primary fill-current" />
          ))}
        </div>
        {review.verified && (
          <div className="flex items-center gap-1 bg-black border border-gold-primary/50 rounded-full px-2 py-1">
            <FaCheck className="w-3 h-3 text-gold-primary" />
            <span className="text-xs text-gold-primary font-semibold">Verified</span>
          </div>
        )}
      </div>

      {/* Review Title */}
      <h3 className="text-base font-bold text-navy-light mb-2">
        {review.title}
      </h3>

      {/* Review Body */}
      <p className="text-sm text-navy-primary leading-relaxed mb-4 font-medium flex-grow">
        {review.body}
      </p>

      {/* Reviewer Info */}
      <div className="mt-auto pt-4 border-t border-gold-primary/30">
        <p className="text-xs text-navy-primary font-medium">
          {review.reviewer}, {review.timeAgo}
        </p>
      </div>
    </motion.div>
  );
};

export default ReviewCard;

