// components/sections/AccreditationsSection.tsx
"use client";

import React from 'react';
import { parse } from 'node-html-parser';
import Marquee from "react-fast-marquee";

interface AccreditationsSectionProps {
  title?: string;
  subtitle?: string;
  galleryHtml?: string;
}

const parseImageUrlsFromHtml = (htmlContent: string | undefined): string[] => {
    if (!htmlContent) return [];
    const root = parse(htmlContent);
    const images = root.querySelectorAll('img');
    return images.map(img => img.getAttribute('src') || '').filter(Boolean);
};

export const AccreditationsSection: React.FC<AccreditationsSectionProps> = ({ title, subtitle, galleryHtml }) => {
  const logos = parseImageUrlsFromHtml(galleryHtml);

  if (!logos || logos.length === 0) {
    return null; 
  }

  // نقوم بالتكرار اليدوي لضمان عمل الحلقة بسلاسة في كلتا اللغتين
  const displayLogos = [...logos, ...logos];

  return (
    <section id="accreditations" className="py-20 bg-background">
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-text-primary">{title}</h2>
        {subtitle && (
            <div 
                className="text-lg text-text-secondary mt-3 max-w-2xl mx-auto"
                dangerouslySetInnerHTML={{ __html: subtitle }} 
            />
        )}
      </div>

      {/* ✅ هذا هو السطر الحاسم الذي يحل المشكلة نهائيًا */}
      <div dir="ltr">
        <Marquee
          speed={60}
          gradient
          gradientColor="var(--color-background)"
          gradientWidth={150}
          pauseOnHover
          direction="left"
        >
          {displayLogos.map((logoUrl, index) => (
            <div key={index} className="mx-8">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt={`Accreditation logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};