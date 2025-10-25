// components/sections/TeamSliderSection.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { parse } from 'node-html-parser';

// --- واجهات البيانات (Interfaces) ---
// هذه هي البيانات التي سنتوقعها من ووردبريس

interface TeamMember {
  id: string;
  title: string; // اسم العضو
  teamMemberDetails: {
    designation: string; // المنصب (مثل: مقيّم زميل)
    description: string; // الوصف (HTML)
  };
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface TeamSliderSectionProps {
  mainTitle?: string;
  subtitle?: string;
  members: TeamMember[];
  isRTL: boolean;
  className?: string;
}

// دالة مساعدة لتحويل الوصف (HTML) إلى نص عادي للعرض
// (قد نحتاجها أو نستخدم dangerouslySetInnerHTML)
const getDescriptionHtml = (htmlContent: string): string => {
  if (!htmlContent) return '';
  // هنا يمكننا تنظيف الـ HTML إذا أردنا، لكننا سنعرضه كما هو
  return htmlContent;
};


export const TeamSliderSection = ({
  mainTitle,
  subtitle,
  members,
  isRTL,
  className,
  autoplay = true,
}: TeamSliderSectionProps & { autoplay?: boolean }) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % members.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + members.length) % members.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, active, members.length]); // أعد تشغيل المؤقت عند تغيير الشريحة يدوياً

  const randomRotateY = () => {
    return Math.floor(Math.random() * 10) - 5; // تقليل زاوية الدوران
  };

  // إذا لم يكن هناك أعضاء، لا تعرض القسم
  if (!members || members.length === 0) {
    return null;
  }

  const activeMember = members[active];

  return (
    <section id="team" className={cn("py-20 bg-background", className)}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* العنوان الرئيسي والعنوان الفرعي للقسم */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-2xl md:text-3xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
            {mainTitle}
          </h2>
          <div
            className={`prose dark:prose-invert max-w-none text-lg leading-relaxed text-text-secondary mx-auto ${isRTL ? "font-arabic" : "font-normal"}`}
            dangerouslySetInnerHTML={{ __html: subtitle || '' }}
          />
        </motion.div>

        {/* جسم السلايدر */}
        <div className="max-w-sm md:max-w-4xl mx-auto">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            
            {/* حاوية الصور */}
            <motion.div 
              className={`relative h-80 w-full md:h-96 ${isRTL ? 'md:order-last' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <AnimatePresence>
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index)
                        ? 999
                        : members.length + 2 - index,
                      y: isActive(index) ? [0, -40, 0] : 0, // تقليل القفزة
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <Image
                      src={member.featuredImage.node.sourceUrl}
                      alt={member.featuredImage.node.altText || member.title}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center shadow-xl border border-border"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* حاوية النصوص */}
            <div className={`flex justify-between flex-col py-4 ${isRTL ? 'md:order-first text-right' : 'text-left'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="min-h-[250px]" // ارتفاع ثابت لمنع "القفز"
                >
                  <h3 className={`text-2xl font-bold text-text-primary ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                    {activeMember.title}
                  </h3>
                  <p className={`text-md text-accent mt-1 ${isRTL ? "font-arabic font-bold" : "font-semibold"}`}>
                    {activeMember.teamMemberDetails.designation}
                  </p>
                  
                  {/* الوصف القادم من ووردبريس */}
                  <div
                    className={`prose dark:prose-invert max-w-none text-text-secondary mt-6 ${isRTL ? "font-arabic" : "font-normal"}`}
                    dangerouslySetInnerHTML={{
                      __html: getDescriptionHtml(activeMember.teamMemberDetails.description),
                    }}
                  />

                </motion.div>
              </AnimatePresence>

              {/* أزرار التحكم */}
              <div className={`flex gap-4 pt-8 md:pt-0 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full bg-background-secondary border border-border/40 flex items-center justify-center hover:bg-accent/10 transition-colors group/button"
                  aria-label="Previous Member"
                >
                  {isRTL ? (
                    <ChevronRight className="w-5 h-5 text-text-primary transition-transform duration-300" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-text-primary transition-transform duration-300" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full bg-background-secondary border border-border/40 flex items-center justify-center hover:bg-accent/10 transition-colors group/button"
                  aria-label="Next Member"
                >
                  {isRTL ? (
                    <ChevronLeft className="w-5 h-5 text-text-primary transition-transform duration-300" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-text-primary transition-transform duration-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};