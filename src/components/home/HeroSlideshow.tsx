import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaClock, FaTicketAlt } from 'react-icons/fa';
import Button from '../common/Button/Button';

interface FeaturedCompetition {
  id: string;
  title: string;
  image: string;
  price: number;
  soldTickets: number;
  maxTickets: number;
  endDate?: string;
  description?: string;
}

interface HeroSlideshowProps {
  competitions: FeaturedCompetition[];
  autoSlideInterval?: number;
}

const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ 
  competitions, 
  autoSlideInterval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (competitions.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % competitions.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [competitions.length, autoSlideInterval]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + competitions.length) % competitions.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % competitions.length);
  };

  if (!competitions || competitions.length === 0) {
    return null;
  }

  const currentCompetition = competitions[currentIndex];
  const progress = (currentCompetition.soldTickets / currentCompetition.maxTickets) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-[700px] overflow-hidden bg-black">
      {/* Slide Container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={currentCompetition.image}
                alt={currentCompetition.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://res.cloudinary.com/dtaegi6gk/image/upload/v1761794213/2197_zwopny.jpg';
                }}
              />
              {/* Dark Overlay with Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-2xl">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block mb-4"
                  >
                    <span className="px-4 py-2 bg-gold-primary/20 border border-gold-primary/50 rounded-full text-gold-primary text-sm font-semibold neon-orange-text">
                      Featured Competition
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                  >
                    <span className="gold-text-glow">{currentCompetition.title}</span>
                  </motion.h1>

                  {/* Description */}
                  {currentCompetition.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-navy-primary mb-8 leading-relaxed"
                    >
                      {currentCompetition.description}
                    </motion.p>
                  )}

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-6 mb-8"
                  >
                    <div className="flex items-center gap-2">
                      <FaTicketAlt className="text-gold-primary w-5 h-5" />
                      <span className="text-white font-semibold">
                        £{currentCompetition.price.toFixed(2)} per ticket
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="w-5 h-5" style={{ color: '#FF9500' }} />
                      <span className="text-white font-semibold">
                        {currentCompetition.soldTickets.toLocaleString()} / {currentCompetition.maxTickets.toLocaleString()} sold
                      </span>
                    </div>
                  </motion.div>

                  {/* Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                  >
                    <div className="w-full h-2 bg-black-soft rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-full gold-gradient"
                        style={{ boxShadow: '0 0 10px rgba(0, 112, 243, 0.6)' }}
                      />
                    </div>
                    <p className="text-sm text-navy-primary mt-2">
                      {progress.toFixed(1)}% sold • {currentCompetition.maxTickets - currentCompetition.soldTickets} tickets remaining
                    </p>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-4"
                  >
                    <Link to={`/competitions/${currentCompetition.id}`}>
                      <Button
                        variant="enter"
                        size="lg"
                        className="led-button"
                      >
                        Enter Now
                      </Button>
                    </Link>
                    <Link to="/competitions">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-gold-primary text-white hover:bg-gold-primary/10"
                      >
                        View All Competitions
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {competitions.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-black-soft/80 backdrop-blur-sm border border-gold-primary/30 rounded-full text-gold-primary hover:bg-gold-primary/20 hover:border-gold-primary transition-all gold-hover-glow"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-black-soft/80 backdrop-blur-sm border border-gold-primary/30 rounded-full text-gold-primary hover:bg-gold-primary/20 hover:border-gold-primary transition-all gold-hover-glow"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {competitions.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {competitions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-gold-primary gold-glow w-8'
                  : 'bg-navy-primary/50 hover:bg-gold-primary/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Waveform Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 waveform-bg opacity-20 pointer-events-none" />
    </div>
  );
};

export default HeroSlideshow;

