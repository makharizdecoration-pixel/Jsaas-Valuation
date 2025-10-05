// components/sections/ServicesSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title: string;
  serviceDetails: {
    serviceDescription: string;
    serviceImage?: {
      node: {
        sourceUrl: string;
        altText: string;
      };
    };
  };
}

interface ServicesSectionProps {
  services: Service[];
  className?: string;
}

const AUTOPLAY_DELAY = 5000;

export function ServicesSection({ services, className }: ServicesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRTL, setIsRTL] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // تحديد الاتجاه من الـ HTML dir attribute
    setIsRTL(document.documentElement.dir === 'rtl');
  }, []);

  if (!services || services.length === 0) {
    return null;
  }

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length),
      AUTOPLAY_DELAY
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, services.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
  };
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
  };

  const currentService = services[currentIndex];

  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4", className)}>
      {/* أزرار أسماء الخدمات */}
      <div className='flex justify-center items-center flex-wrap gap-3 mb-12'>
        {services.map((service, serviceIndex) => (
          <button
            key={service.id}
            onClick={() => setCurrentIndex(serviceIndex)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              serviceIndex === currentIndex
                ? "bg-accent text-accent-text shadow-lg shadow-accent/25"
                : "bg-background-secondary text-text-secondary hover:bg-background-secondary/80"
            )}
            aria-label={`Go to service ${service.title}`}
          >
            {service.title}
          </button>
        ))}
      </div>

      {/* --- تصميم شاشات سطح المكتب --- */}
      <div className='hidden md:flex justify-center items-center'>
        <motion.div 
          className='relative w-full max-w-4xl flex items-center justify-center'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* الصورة */}
          <div className='w-[470px] h-[470px] rounded-3xl overflow-hidden bg-background-secondary flex-shrink-0 shadow-xl'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentService.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className='w-full h-full'
              >
                <img
                  src={currentService.serviceDetails.serviceImage?.node.sourceUrl || '/placeholder.jpg'}
                  alt={currentService.serviceDetails.serviceImage?.node.altText || currentService.title}
                  className='w-full h-full object-cover'
                  draggable={false}
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* البطاقة - هتاخد موقعها تلقائي حسب الـ dir */}
          <div className='bg-background dark:bg-card rounded-3xl shadow-2xl p-8 -ms-[80px] max-w-lg flex-1 z-10'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentService.id + 'text'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h2 className='text-2xl font-almarai-bold text-text-primary mb-4'>
                  {currentService.title}
                </h2>
                <div className="min-h-[140px] mb-6">
                   <p className='text-text-secondary text-base leading-relaxed whitespace-pre-wrap'>
                      {currentService.serviceDetails.serviceDescription}
                   </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* أسهم التنقل */}
            <div className='flex items-center gap-4 pt-4 border-t border-border/40'>
              <button
                onClick={handlePrevious}
                aria-label='Previous service'
                className='w-11 h-11 rounded-full bg-background-secondary border border-border/40 flex items-center justify-center hover:bg-accent/10 transition-colors'
              >
                {isRTL ? <ChevronRight className='w-5 h-5 text-text-primary' /> : <ChevronLeft className='w-5 h-5 text-text-primary' />}
              </button>
              <button
                onClick={handleNext}
                aria-label='Next service'
                className='w-11 h-11 rounded-full bg-background-secondary border border-border/40 flex items-center justify-center hover:bg-accent/10 transition-colors'
              >
                {isRTL ? <ChevronLeft className='w-5 h-5 text-text-primary' /> : <ChevronRight className='w-5 h-5 text-text-primary' />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- تصميم شاشات الجوال --- */}
      <div className='md:hidden max-w-sm mx-auto text-center'>
        <div className='w-full aspect-square bg-background-secondary rounded-3xl overflow-hidden mb-6 shadow-lg'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentService.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className='w-full h-full'
            >
              <img
                src={currentService.serviceDetails.serviceImage?.node.sourceUrl || '/placeholder.jpg'}
                alt={currentService.serviceDetails.serviceImage?.node.altText || currentService.title}
                className='w-full h-full object-cover'
                draggable={false}
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='px-4 bg-background dark:bg-card py-6 rounded-2xl shadow-md'>
          <AnimatePresence mode="wait">
            <motion.div
                key={currentService.id + 'text_mobile'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
              <h2 className='text-xl font-almarai-bold text-text-primary mb-4'>
                {currentService.title}
              </h2>
              <div className="min-h-[120px] mb-6">
                <p className='text-text-secondary text-sm leading-relaxed whitespace-pre-wrap'>
                  {currentService.serviceDetails.serviceDescription}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='flex justify-center items-center gap-4 mt-6'>
          <button
            onClick={handlePrevious}
            aria-label='Previous service'
            className='w-12 h-12 rounded-full bg-background-secondary border border-border/40 shadow-md flex items-center justify-center hover:bg-background-secondary/80 transition-colors'
          >
            {isRTL ? <ChevronRight className='w-6 h-6 text-text-primary' /> : <ChevronLeft className='w-6 h-6 text-text-primary' />}
          </button>
          <button
            onClick={handleNext}
            aria-label='Next service'
            className='w-12 h-12 rounded-full bg-background-secondary border border-border/40 shadow-md flex items-center justify-center hover:bg-background-secondary/80 transition-colors'
          >
            {isRTL ? <ChevronLeft className='w-6 h-6 text-text-primary' /> : <ChevronRight className='w-6 h-6 text-text-primary' />}
          </button>
        </div>
      </div>
    </div>
  );
}