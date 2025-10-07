// components/sections/DivisionsSection.tsx
"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { parse } from 'node-html-parser';

interface Division {
  id: string;
  title: string;
  content: string;
}

interface DivisionsSectionProps {
  divisions: Division[];
  mainTitle?: string;
  subtitle?: string;
}

// استخلاص أول صورة من HTML
const extractFirstImageUrl = (htmlContent: string): string => {
  if (!htmlContent) return '/placeholder.jpg';
  const root = parse(htmlContent);
  const firstImage = root.querySelector('img');
  return firstImage?.getAttribute('src') || '/placeholder.jpg';
};

// استخلاص النص فقط
const extractTextContent = (htmlContent: string): string => {
  if (!htmlContent) return '';
  const root = parse(htmlContent);
  const gallery = root.querySelector('.wp-block-gallery');
  if (gallery) gallery.remove();
  return root.textContent.trim();
};

// حساب المسافة بين الصور
function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const DivisionsSection: React.FC<DivisionsSectionProps> = ({
  divisions,
  mainTitle,
  subtitle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRTL, setIsRTL] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const divisionsLength = useMemo(() => divisions.length, [divisions]);
  const activeDivision = useMemo(() => divisions[activeIndex], [activeIndex, divisions]);

  // كشف الاتجاه
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsRTL(document.documentElement.dir === 'rtl');
    }
  }, []);

  // حساب العرض
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // التشغيل التلقائي
  useEffect(() => {
    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % divisionsLength);
    }, 5000);
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [divisionsLength]);

  // التنقل
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % divisionsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [divisionsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + divisionsLength) % divisionsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [divisionsLength]);

  // تحديد موقع كل صورة
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + divisionsLength) % divisionsLength === index;
    const isRight = (activeIndex + 1) % divisionsLength === index;

    const scale = isActive ? 1 : 0.85;

    let transform = `scale(${scale})`;
    if (!isActive) {
      if (isLeft) {
        transform = `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`;
      } else if (isRight) {
        transform = `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`;
      }
    }

    return {
      zIndex: isActive ? 3 : (isLeft || isRight) ? 2 : 1,
      opacity: (isLeft || isRight || isActive) ? 1 : 0,
      pointerEvents: (isLeft || isRight || isActive) ? "auto" : "none",
      transform: transform,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section id="divisions" className="py-20 bg-background-secondary/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
            {mainTitle}
          </h2>
          <p className={`text-lg leading-relaxed text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
            {subtitle}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* عارض الصور الدائري */}
            <div 
              ref={imageContainerRef}
              className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center"
              style={{ perspective: '1000px' }}
            >
              {divisions.map((division, index) => (
                <img
                  key={division.id}
                  src={extractFirstImageUrl(division.content)}
                  alt={division.title}
                  // <<< تم التعديل هنا: تصغير حجم الصور من 10/12 إلى 9/12 >>>
                  className="absolute w-9/12 h-9/12 object-cover rounded-3xl shadow-2xl cursor-pointer"
                  style={getImageStyle(index)}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            {/* المحتوى النصي */}
            <div className="flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={quoteVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h3 
                    className={`text-3xl font-bold text-text-primary mb-2 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
                  >
                    {activeDivision.title}
                  </h3>
                  <p className={`text-text-secondary mb-6 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                    {isRTL ? "قسم من أقسامنا" : "A Division of Ours"}
                  </p>
                  <motion.p className={`text-text-secondary leading-relaxed text-lg ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                    {extractTextContent(activeDivision.content).split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut", delay: 0.025 * i }}
                        style={{ display: "inline-block" }}
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              {/* أزرار التنقل */}
              <div className="flex items-center gap-6 mt-8">
                <button
                  onClick={handlePrev}
                  onMouseEnter={() => setHoverPrev(true)}
                  onMouseLeave={() => setHoverPrev(false)}
                  aria-label="Previous Division"
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: hoverPrev ? 'var(--color-accent)' : 'var(--color-background-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {isRTL ? <FaArrowRight size={20} /> : <FaArrowLeft size={20} />}
                </button>
                <button
                  onClick={handleNext}
                  onMouseEnter={() => setHoverNext(true)}
                  onMouseLeave={() => setHoverNext(false)}
                  aria-label="Next Division"
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: hoverNext ? 'var(--color-accent)' : 'var(--color-background-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {isRTL ? <FaArrowLeft size={20} /> : <FaArrowRight size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};