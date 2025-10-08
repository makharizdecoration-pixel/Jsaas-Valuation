// components/sections/BrandStatementSection.tsx

import React from 'react';
import { motion } from 'framer-motion';

// واجهة لتحديد الخصائص التي سيستقبلها المكون
interface BrandStatementProps {
  sideTitle: string;
  paragraphs: string[];
  quote: string;
  isRTL: boolean;
}

export const BrandStatementSection: React.FC<BrandStatementProps> = ({ sideTitle, paragraphs, quote, isRTL }) => {
  // لا تفعل شيئًا إذا لم يكن هناك محتوى
  if (!sideTitle && !quote && paragraphs.length === 0) {
    return null;
  }

  return (
    <section className="bg-background-secondary/30 py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* العمود الأول: العنوان الجانبي */}
          <motion.div 
            className="lg:col-span-4 text-center lg:text-start"
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className={`text-5xl lg:text-6xl font-bold leading-tight ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
              {sideTitle}
            </h2>
          </motion.div>

          {/* العمود الثاني: المحتوى النصي */}
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className={`space-y-6 text-lg text-text-secondary leading-relaxed ${isRTL ? "font-arabic" : "font-normal"}`}>
              {paragraphs.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>
            
            {/* خط فاصل واقتباس */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <p className={`text-xl text-text-primary italic ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                "{quote}"
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};