// components/ui/HeroSlider.tsx

"use client";
import { cn } from "@/lib/utils";
// 1. قمنا باستيراد النوع "Variants" من المكتبة
import { motion, AnimatePresence, type Variants } from "framer-motion";
import React, { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === slides.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (slides && slides.length > 0) {
      loadImages();
    }
  }, [slides]);

  const loadImages = () => {
    setLoading(true);
    const imagesToLoad = slides.map((slide) => slide.image);
    
    const loadPromises = imagesToLoad.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = () => resolve(image);
        img.onerror = reject;
      });
    });

    Promise.all(loadPromises)
      .then((loadedImages) => {
        setLoadedImages(loadedImages as string[]);
        setLoading(false);
      })
      .catch((error) => console.error("Failed to load slide images", error));
  };

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
  }, [slides, autoplay]);

  // 2. قمنا بإضافة النوع هنا لحل المشكلة
  const slideVariants: Variants = {
    initial: { scale: 1.1, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.7, ease: [0.645, 0.045, 0.355, 1.0] } },
    exit: { scale: 1.1, opacity: 0, transition: { duration: 0.7, ease: [0.645, 0.045, 0.355, 1.0] } },
  };

  const areImagesLoaded = loadedImages.length > 0;
  const currentSlide = slides?.[currentIndex];

  return (
    <div
      className={cn(
        "overflow-hidden h-full w-full relative flex items-center justify-center",
        className
      )}
    >
      {areImagesLoaded && currentSlide && (
        <div className="z-50 flex flex-col justify-center items-center text-center p-4">
          <motion.h1
            key={currentIndex + "-title"}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-bold text-xl md:text-6xl text-white py-4"
          >
            {currentSlide.title}
          </motion.h1>
          <motion.p
            key={currentIndex + "-subtitle"}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-extralight text-xs md:text-2xl text-neutral-200 py-2 max-w-3xl"
          >
            {currentSlide.subtitle}
          </motion.p>
        </div>
      )}

      {areImagesLoaded && overlay && (
        <div
          className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)}
        />
      )}

      {areImagesLoaded && currentSlide && (
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={currentSlide.image}
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