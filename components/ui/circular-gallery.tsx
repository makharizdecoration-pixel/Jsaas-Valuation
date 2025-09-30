"use client"

import React, { useState, useEffect, useRef, type HTMLAttributes, useCallback } from 'react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

// Define the type for a single gallery item
export interface GalleryItem {
  id: string;
  common: string;
  binomial: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
    by: string;
  };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
  /** A factor to control how fast the gallery spins with mouse drag. */
  dragSpeed?: number; // <-- جديد: للتحكم في سرعة السحب
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, dragSpeed = 0.2, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const animationFrameRef = useRef<number | null>(null);

    // --- جديد: حالة ومراجع للتحكم بالسحب ---
    const [isDragging, setIsDragging] = useState(false);
    const startXRef = useRef<number>(0);
    const startRotationRef = useRef<number>(0);
    
    // --- تم حذف useEffect الخاص بالـ Scroll بالكامل ---

    // --- تعديل: الدوران التلقائي يتوقف الآن عند السحب ---
    useEffect(() => {
      const autoRotate = () => {
        // توقف عن الدوران إذا كان المستخدم يسحب أو لا توجد سرعة دوران
        if (!isDragging && autoRotateSpeed > 0) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isDragging, autoRotateSpeed]);

    // --- جديد: دوال التحكم بالسحب بالماوس والتاتش ---

    const getClientX = (e: MouseEvent | TouchEvent): number => {
      if ('touches' in e) {
        return e.touches[0].clientX;
      }
      return e.clientX;
    };

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
      // إيقاف أي سلوك افتراضي للمتصفح مثل تحديد النص
      e.preventDefault();
      
      const clientX = getClientX(e.nativeEvent);
      startXRef.current = clientX; // تخزين نقطة البداية الأفقية
      startRotationRef.current = rotation; // تخزين زاوية الدوران الحالية عند بدء السحب
      
      // تغيير شكل المؤشر للإشارة إلى إمكانية السحب
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.cursor = 'grabbing';
      }
    }, [rotation]);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const clientX = getClientX(e);
      const deltaX = clientX - startXRef.current; // حساب المسافة التي تحركها المؤشر
      const rotationDelta = deltaX * dragSpeed; // تحويل المسافة إلى زاوية دوران
      
      // تحديث زاوية الدوران = الزاوية عند البداية + التغيير الناتج عن السحب
      setRotation(startRotationRef.current + rotationDelta);
    }, [isDragging, dragSpeed]);

    const handleDragEnd = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);

      if (e.currentTarget instanceof HTMLElement) {
        // إعادة المؤشر لشكله الافتراضي
        e.currentTarget.style.cursor = 'grab';
      }
    }, [isDragging]);

    // --- جديد: useEffect لربط وفصل الأحداث على مستوى الصفحة ---
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchend', handleDragEnd);
            // التعامل مع حالة خروج الماوس من نافذة المتصفح أثناء السحب
            document.documentElement.addEventListener('mouseleave', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
            document.documentElement.removeEventListener('mouseleave', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);


    const anglePerItem = 360 / items.length;
    
    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        // --- تعديل: إضافة الأحداث الخاصة ببدء السحب ---
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={cn("relative w-full h-full flex items-center justify-center select-none", className)}
        style={{ 
          perspective: '2000px',
          cursor: isDragging ? 'grabbing' : 'grab' // تغيير شكل المؤشر
        }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
            // --- تعديل: إزالة الانتقال التدريجي لتكون الحركة فورية مع السحب ---
            // transition: 'transform 0.3s linear'  // <--- هذا السطر قد ترغب في إزالته
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            // ... باقي كود الـ map لم يتغير
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - (normalizedAngle / 180));

            return (
              <div
                key={item.id}
                role="group"
                aria-label={item.common}
                className="absolute w-[300px] h-[400px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-150px',
                  marginTop: '-200px',
                  opacity: opacity,
                  transition: 'opacity 0.3s linear, transform 0.3s ease-out' // تعديل بسيط لجعل الحركة أنعم
                }}
              >
                {/* ... باقي محتوى البطاقة لم يتغير ... */}
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-zinc-700 bg-zinc-800/70 backdrop-blur-lg">
                  <img
                    src={item.photo.url || "/placeholder.svg"}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-xl font-bold">{item.common}</h2>
                    <em className="text-sm italic opacity-80">{item.binomial}</em>
                    <p className="text-xs mt-2 opacity-70">Photo by: {item.photo.by}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };