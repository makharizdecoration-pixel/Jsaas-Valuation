// components/sections/InteractiveServiceViewer.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parse } from 'node-html-parser';

// --- واجهات البيانات ---
interface SubServiceImage { id: string; sourceUrl: string; altText: string; }
interface SubService { title: string; subServiceDescription: string; subServiceGallery: string; }
interface InteractiveServiceViewerProps { subServices: SubService[]; isRTL: boolean; }

// --- الثوابت ---
const IMAGE_CHANGE_INTERVAL = 3000;
const SERVICE_CHANGE_DELAY = 1000;

// --- دالة مساعدة لاستخلاص الصور ---
const extractImageUrls = (htmlContent: string): SubServiceImage[] => {
  if (!htmlContent) return [];
  const root = parse(htmlContent);
  const images = root.querySelectorAll('img');
  return images.map((img, index) => ({
    id: img.getAttribute('id') || `img-${index}-${Date.now()}`,
    sourceUrl: img.getAttribute('src') || '',
    altText: img.getAttribute('alt') || 'Service Image',
  }));
};

// --- مكون كرت الصورة ---
const DraggableImageCard: React.FC<{ image: SubServiceImage; position: 'front' | 'middle' | 'back' | 'hidden'; isRTL: boolean; }> = ({ image, position, isRTL }) => {
  const isFront = position === "front";

  const xOffset = position === "front" ? "0%" : position === "middle" ? "33%" : "66%";
  const rotateValue = position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg";

  const finalX = isRTL ? (parseInt(xOffset.replace('%', '')) * -1) + '%' : xOffset;
  const finalRotate = isRTL ? (parseInt(rotateValue.replace('deg', '')) * -1) + 'deg' : rotateValue;

  return (
    <motion.div
      style={{ zIndex: isFront ? 2 : position === "middle" ? 1 : 0, position: 'absolute', top: 0, }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: finalRotate,
        x: finalX,
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.5 }}
      // 🎨 ملاحظة: الألوان هنا لا تزال ثابتة (slate) - قد تحتاج لتعديلها لاحقاً
      className="grid h-[450px] w-[350px] select-none rounded-2xl border-2 border-slate-300 bg-slate-100 p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800/20"
    >
      <img src={image.sourceUrl} alt={image.altText} className="pointer-events-none h-full w-full rounded-xl object-cover" />
    </motion.div>
  );
};

// --- المكون الرئيسي ---
export const InteractiveServiceViewer: React.FC<InteractiveServiceViewerProps> = ({ subServices, isRTL }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [gallery, setGallery] = useState<SubServiceImage[]>([]);
  const [imageOrder, setImageOrder] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const serviceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageCounterRef = useRef(0);

  const activeSubService = subServices[activeIndex];

  useEffect(() => {
    if (activeSubService?.subServiceGallery) {
      const extractedImages = extractImageUrls(activeSubService.subServiceGallery);
      setGallery(extractedImages);
      setImageOrder(extractedImages.map(img => img.id));
      imageCounterRef.current = 0;
    } else { setGallery([]); setImageOrder([]); }
  }, [activeIndex, activeSubService]);

  useEffect(() => {
    const cleanupTimers = () => {
      if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
      if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
    };
    if (isPaused || gallery.length === 0) { cleanupTimers(); return; }
    const startImageInterval = () => {
      imageIntervalRef.current = setInterval(() => {
        imageCounterRef.current++;
        if (imageCounterRef.current >= gallery.length) {
          if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
          serviceTimeoutRef.current = setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % subServices.length);
          }, SERVICE_CHANGE_DELAY);
          return;
        }
        setImageOrder((prevOrder) => {
          const newOrder = [...prevOrder];
          const frontCard = newOrder.shift();
          if (frontCard) newOrder.push(frontCard);
          return newOrder;
        });
      }, IMAGE_CHANGE_INTERVAL);
    };
    startImageInterval();
    return cleanupTimers;
  }, [activeIndex, isPaused, gallery.length, subServices.length]);

  const handleSelectService = (index: number) => {
    setActiveIndex(index);
    imageCounterRef.current = 0;
  };

  const getCardPosition = (cardId: string): 'front' | 'middle' | 'back' | 'hidden' => {
    const index = imageOrder.indexOf(cardId);
    if (index === 0) return 'front';
    if (index === 1) return 'middle';
    if (index === 2) return 'back';
    return 'hidden';
  };

  return (
    <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="w-full">
      {/* --- تصميم شاشات الكمبيوتر والتابلت --- */}
      <div className="hidden md:block">
        <div className="flex justify-center items-center flex-wrap gap-3 mb-12">
            {subServices.map((service, index) => (
              <button
                key={index}
                onClick={() => handleSelectService(index)}
                className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden ${
                  index === activeIndex
                    ? "bg-accent text-accent-text shadow-lg shadow-accent/25" // لون الزر النشط الأساسي
                    : "bg-background-secondary text-text-secondary hover:bg-background-secondary/80" // لون الزر غير النشط
                }`}
              >
                 <span className={`relative z-10 font-bold ${isRTL ? 'font-arabic font-bold' : 'font-bold'}`}>{service.title}</span>
                 {index === activeIndex && (
                   <motion.div
                      // ▼▼▼ هذا هو التعديل الوحيد ▼▼▼
                      className="absolute bottom-0 left-0 right-0 h-full bg-[var(--color-accent)]"
                      // ▲▲▲ هذا هو التعديل الوحيد ▲▲▲
                      layoutId="active-service-pill"
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                   />
                 )}
                 {index === activeIndex && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-white/50" // لون شريط التقدم (ثابت)
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: IMAGE_CHANGE_INTERVAL * (gallery.length - imageCounterRef.current) / 1000, ease: "linear" }}
                      key={activeIndex}
                    />
                  )}
              </button>
            ))}
        </div>
        <div className={`grid md:grid-cols-2 gap-8 items-center min-h-[500px]`}>
            <div className={`relative h-[500px] w-full flex justify-center items-center ${isRTL ? 'md:order-last' : 'md:order-first'}`}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform md:scale-[0.70] lg:scale-100">
                  <div className="relative w-[550px] h-[450px]" dir={isRTL ? 'rtl' : 'ltr'}>
                      <AnimatePresence>
                          {gallery.map((image) => {
                              const position = getCardPosition(image.id);
                              if (position === 'hidden' && imageOrder.length > 3) return null;
                              return <DraggableImageCard key={image.id} image={image} position={position} isRTL={isRTL} />;
                          })}
                      </AnimatePresence>
                  </div>
              </div>
            </div>
            <div className={`flex flex-col justify-center min-h-[450px] p-4 ${isRTL ? 'md:order-first' : 'md:order-last'}`}>
                <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-md mx-auto md:mx-0 text-center md:text-start"
                >
                    {/* لون عنوان الخدمة */}
                    <h2 className={`text-2xl font-bold text-text-primary mb-4 ${isRTL ? 'font-arabic font-bold' : 'font-bold'}`}>{activeSubService?.title}</h2>
                    {/* ألوان النص داخل الوصف (يعتمد على إعدادات prose) */}
                    <div
                      dir={isRTL ? "rtl" : "ltr"}
                      className={`prose dark:prose-invert max-w-none ${isRTL ? 'font-arabic' : 'font-normal'}`}
                      dangerouslySetInnerHTML={{ __html: activeSubService?.subServiceDescription || '' }}
                    />
                </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </div>

      {/* --- تصميم شاشات الجوال --- */}
      <div className="md:hidden flex flex-col items-center w-full">
        <div className="relative h-[450px] w-full mb-8 flex items-center justify-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform scale-[0.75]">
            <div className="relative w-[550px] h-[450px]" dir={isRTL ? 'rtl' : 'ltr'}>
                <AnimatePresence>
                    {gallery.map((image) => {
                        const position = getCardPosition(image.id);
                        if (position === 'hidden' && imageOrder.length > 3) return null;
                        return <DraggableImageCard key={image.id} image={image} position={position} isRTL={isRTL} />;
                    })}
                </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="w-full overflow-x-auto pb-4 mb-6">
            <div className="flex flex-row gap-3 px-4">
                {subServices.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectService(index)}
                    className={`relative w-32 flex-shrink-0 px-4 py-3 rounded-lg text-center transition-all duration-300 border ${
                      index === activeIndex
                        ? 'bg-accent text-accent-text border-accent' // ألوان الزر النشط
                        : 'bg-background-secondary border-border' // ألوان الزر غير النشط
                    }`}
                  >
                    <h4 className={`text-sm font-bold ${isRTL ? 'font-arabic font-bold' : 'font-bold'}`}>{service.title}</h4>
                    {index === activeIndex && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-accent-text" // لون شريط التقدم
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: IMAGE_CHANGE_INTERVAL * (gallery.length - imageCounterRef.current) / 1000, ease: "linear" }}
                        key={activeIndex}
                      />
                    )}
                  </button>
                ))}
            </div>
        </div>
        <div className="w-full px-4 min-h-[150px] text-center">
          <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                  {/* لون عنوان الخدمة */}
                  <h2 className={`text-xl font-bold text-text-primary mb-3 ${isRTL ? 'font-arabic font-bold' : 'font-bold'}`}>{activeSubService?.title}</h2>
                  {/* ألوان النص داخل الوصف (يعتمد على إعدادات prose) */}
                  <div
                    dir={isRTL ? "rtl" : "ltr"}
                    className={`prose dark:prose-invert max-w-none mx-auto ${isRTL ? 'font-arabic' : 'font-normal'}`}
                    dangerouslySetInnerHTML={{ __html: activeSubService?.subServiceDescription || '' }}
                  />
              </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};