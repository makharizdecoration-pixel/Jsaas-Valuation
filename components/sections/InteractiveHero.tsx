// components/sections/InteractiveHero.tsx

"use client";

import React from 'react';

// سنحتفظ بنفس الواجهة (interface) للبيانات القادمة من ووردبريس
interface InteractiveHeroProps {
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  headline?: string;
  subtext?: string;
  lang?: 'ar' | 'en';
}

// هذه نسخة مبسطة جدًا ومؤقتة للمكون
export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  backgroundImageUrl,
  backgroundImageAlt,
  headline,
  subtext,
}) => {
  return (
    <section 
      className="relative w-full h-screen bg-black text-white flex items-center justify-center text-center p-4"
    >
      {/* طبقة لونية داكنة فوق الصورة */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      {/* الصورة الخلفية القادمة من ووردبريس */}
      {backgroundImageUrl && (
        <img
          src={backgroundImageUrl}
          alt={backgroundImageAlt || 'Background'}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* المحتوى النصي القادم من ووردبريس */}
      <div className="relative z-20">
        <h1 className="text-4xl md:text-6xl font-bold">
          {headline || 'Loading Headline...'}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-zinc-300">
          {subtext || 'Loading subtext...'}
        </p>
      </div>
    </section>
  );
};