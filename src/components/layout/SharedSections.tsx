import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import RecentDrawCard from '../home/RecentDrawCard';
import ReviewCard from '../home/ReviewCard';
import homeData from '../../data/homeData.json';
import Button from '../common/Button/Button';

const SharedSections: React.FC = () => {
    const recentDraws = homeData.recentDraws;
    const reviews = homeData.reviews || [];
    const normalizedReviews = reviews.map((review: any) => ({
        ...review,
        id: String(review.id),
    }));

    return (
        <>
            {/* We are Trusted - Reviews Section */}
            <section className="py-[100px] bg-black-soft border-t border-gold-primary/10">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <motion.div
                        className="mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-light text-white mb-4  tracking-tight">
                            We are <span className="text-gold-primary">Trusted</span>
                        </h2>
                        <p className="text-white/60 text-sm font-light tracking-wide uppercase">Customer Reviews</p>
                    </motion.div>

                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {normalizedReviews.map((review) => (
                                <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <ReviewCard review={review} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <p className="text-white/60 text-sm font-light mb-2">
                            Rated <span className="font-semibold text-white">4.8</span> / 5 based on <span className="font-semibold text-white">30,943 reviews</span>. Showing our 5 star reviews.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="w-4 h-4 text-gold-primary fill-current" />
                                ))}
                            </div>
                            <span className="text-gold-primary font-semibold text-sm">Trustpilot</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Recent Draws Section */}
            <section className="py-[80px] bg-black">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-light text-white  tracking-tight mb-2">
                                Recent <span className="text-gold-primary">Draws</span>
                            </h2>
                            <p className="text-white/60 text-sm font-light tracking-wide uppercase">Latest Winners</p>
                        </motion.div>
                        <div>
                            <Link to="/winners">
                                <Button variant="outline" size="md">
                                    More recent draws
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentDraws.map((draw, index) => (
                            <motion.div
                                key={draw.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <RecentDrawCard draw={draw} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-[100px] bg-black border-t border-gold-primary/10">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-xs text-gold-primary font-light mb-4 uppercase tracking-widest">How to play</p>
                        <h2 className="text-5xl font-light text-white  tracking-tight">
                            It's as simple as
                        </h2>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row items-start justify-center gap-12 mb-16">
                        {/* Step 1 */}
                        <motion.div
                            className="flex flex-col items-center text-center max-w-xs group flex-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-20 h-20 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center shrink-0 group-hover:bg-gold-primary/20 transition-all duration-300 mb-6">
                                <span className="text-4xl font-light text-gold-primary ">1</span>
                            </div>
                            <h3 className="text-xl font-light text-white mb-4  group-hover:text-gold-primary transition-colors">Choose Your Competition</h3>
                            <p className="text-white/60 text-sm leading-relaxed font-light">
                                Browse our collection of premium prizes and select the competition that excites you most
                            </p>
                        </motion.div>

                        {/* Arrow */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="w-12 h-px bg-gold-primary/30 relative">
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gold-primary/50 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <motion.div
                            className="flex flex-col items-center text-center max-w-xs group flex-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-20 h-20 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center shrink-0 group-hover:bg-gold-primary/20 transition-all duration-300 mb-6">
                                <span className="text-4xl font-light text-gold-primary ">2</span>
                            </div>
                            <h3 className="text-xl font-light text-white mb-4  group-hover:text-gold-primary transition-colors">Answer the Question</h3>
                            <p className="text-white/60 text-sm leading-relaxed font-light">
                                Complete a simple skill-based question to qualify for entry into the live draw
                            </p>
                        </motion.div>

                        {/* Arrow */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="w-12 h-px bg-gold-primary/30 relative">
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gold-primary/50 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <motion.div
                            className="flex flex-col items-center text-center max-w-xs group flex-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-20 h-20 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center shrink-0 group-hover:bg-gold-primary/20 transition-all duration-300 mb-6">
                                <span className="text-4xl font-light text-gold-primary ">3</span>
                            </div>
                            <h3 className="text-xl font-light text-white mb-4  group-hover:text-gold-primary transition-colors">Enter & Win</h3>
                            <p className="text-white/60 text-sm leading-relaxed font-light">
                                Watch the live draw and see if you're the lucky winner of an amazing prize
                            </p>
                        </motion.div>
                    </div>

                    <div className="text-center">
                        <Link to="/competitions">
                            <Button variant="primary" size="lg" withBrackets>
                                Browse All Competitions →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SharedSections;

