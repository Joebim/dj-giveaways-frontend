import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CarouselProps {
    children: React.ReactNode;
    className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, className = '' }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className={`relative ${className}`}>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {React.Children.map(children, (child, index) => (
                        <div key={index} className="min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                            {child}
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous slide"
            >
                <FaChevronLeft className="w-5 h-5 text-navy-primary" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next slide"
            >
                <FaChevronRight className="w-5 h-5 text-navy-primary" />
            </button>
        </div>
    );
};

export default Carousel;

