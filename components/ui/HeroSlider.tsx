// components/ui/HeroSlider.tsx

"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

export const HeroSlider = ({
  slides,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  slides: Slide[];
  overlay?: boolean;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsRTL(document.documentElement.dir === 'rtl');
    }
  }, []);

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === slides.length ? 0 : prevIndex + 1
    );
  }, [slides.length]);

  const handlePrevious = React.useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? slides.length - 1 : prevIndex - 1
    );
  }, [slides.length]);

  useEffect(() => {
    if (slides && slides.length > 0) {
      const imagesToLoad = slides.map((slide) => slide.image);
      setLoadedImages(imagesToLoad);
    }
  }, [slides]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let interval: any;
    if (autoplay && slides && slides.length > 1) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, [autoplay, slides, handleNext, handlePrevious]);

  const slideVariants: Variants = {
    initial: {
      scale: 1.05,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.645, 0.045, 0.355, 1.0],
      },
    },
    exit: {
      scale: 1.05,
      opacity: 0.6,
      transition: {
        duration: 0.8,
        ease: [0.645, 0.045, 0.355, 1.0],
      },
    },
  };

  const areImagesLoaded = loadedImages.length > 0;
  const currentSlide = slides?.[currentIndex];

  return (
    <div
      className={cn(
        "overflow-hidden h-full w-full relative group",
        className
      )}
    >
      <div className="absolute inset-0 z-40">
        <button
          onClick={handlePrevious}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100",
            isRTL ? "right-4 md:right-8" : "left-4 md:left-8"
          )}
          aria-label="Previous Slide"
        >
          {isRTL ? <ChevronRight className="w-6 h-6 md:w-8 md:h-8" /> : <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />}
        </button>
        <button
          onClick={handleNext}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100",
            isRTL ? "left-4 md:left-8" : "right-4 md:right-8"
          )}
          aria-label="Next Slide"
        >
          {isRTL ? <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" /> : <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />}
        </button>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-40 p-4 md:p-8 lg:pb-16 max-w-7xl mx-auto w-full flex items-end",
          isRTL ? "justify-start" : "justify-start"
        )}
      >
        <div className={cn("w-full", isRTL ? "text-right" : "text-left")}>
            <motion.h1
              key={currentIndex + "-title"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="font-bold text-3xl md:text-4xl lg:text-5xl text-white"
            >
              {currentSlide.title}
            </motion.h1>
            {/* ✨ ✨ ✨ هذا هو التعديل الوحيد ✨ ✨ ✨ */}
            <motion.p
              key={currentIndex + "-subtitle"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="font-light text-sm md:text-base lg:text-lg text-neutral-200 mt-4 max-w-2xl whitespace-pre-wrap"
            >
              {currentSlide.subtitle}
            </motion.p>
        </div>
      </div>
      
      <div className={cn(
        "absolute bottom-0 z-40 p-4 md:p-8 lg:pb-16 max-w-7xl mx-auto w-full flex items-end",
        isRTL ? "justify-end" : "justify-end"
      )}>
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentIndex === index ? "w-6 bg-white" : "w-3 bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {areImagesLoaded && overlay && (
        <div
          className={cn("absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-30", overlayClassName)}
        />
      )}

      {areImagesLoaded && (
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="image h-full w-full absolute inset-0 object-cover object-center z-0"
          />
        </AnimatePresence>
      )}
    </div>
  );
};