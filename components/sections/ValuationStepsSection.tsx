// components/sections/ValuationStepsSection.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface ValuationStep {
  id: string;
  title: string;
  stepDetails: {
    iconPathSvgD: string;
  };
}

interface ValuationStepsSectionProps {
  mainTitle?: string;
  steps: ValuationStep[];
  isRTL: boolean;
  className?: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  loop?: boolean;
  onStepChange?: (step: ValuationStep, index: number) => void;
}

// الألوان المتدرجة لكل خطوة
const stepColors = [
  {
    color: "#3b82f6",
    gradientFrom: "#3b82f6",
    gradientTo: "#60a5fa",
  },
  {
    color: "#8b5cf6",
    gradientFrom: "#8b5cf6",
    gradientTo: "#a855f7",
  },
  {
    color: "#ec4899",
    gradientFrom: "#a855f7",
    gradientTo: "#ec4899",
  }
];

export const ValuationStepsSection: React.FC<ValuationStepsSectionProps> = ({
  mainTitle,
  steps,
  isRTL,
  className,
  autoPlay = true,
  autoPlayDelay = 3,
  loop = true,
  onStepChange,
}) => {
  const displaySteps = steps.slice(0, 3);
  
  const initialStep = displaySteps.length - 1;
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [gradientPosition, setGradientPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  if (!displaySteps || displaySteps.length === 0) {
    return null;
  }

  // Auto-play animation
  useEffect(() => {
    if (!autoPlay || displaySteps.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev - 1;
        if (next < 0) {
          return loop ? displaySteps.length - 1 : prev;
        }
        return next;
      });
    }, autoPlayDelay * 1000);

    return () => clearInterval(intervalId);
  }, [autoPlay, autoPlayDelay, loop, displaySteps.length]);

  useEffect(() => {
    if (onStepChange && displaySteps[currentStep]) {
      onStepChange(displaySteps[currentStep], currentStep);
    }
  }, [currentStep, displaySteps, onStepChange]);

  useEffect(() => {
    if (currentStep >= 0 && circleRefs.current[currentStep] && containerRef.current) {
      const circleElement = circleRefs.current[currentStep];
      const containerElement = containerRef.current;
      
      const circleRect = circleElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();
      
      const relativeX = circleRect.left + (circleRect.width / 2) - containerRect.left;
      const relativeY = circleRect.top + (circleRect.height / 2) - containerRect.top;
      
      setGradientPosition({ x: relativeX, y: relativeY });
    } else {
      setGradientPosition(null);
    }
  }, [currentStep]);

  const handleStepClick = (step: ValuationStep, index: number) => {
    setCurrentStep(index);
    onStepChange?.(step, index);
  };

  const createOrbitalDots = (count: number, radius: number, color: string) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      dots.push(
        <motion.div
          key={i}
          className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
          initial={{ 
            opacity: 0, 
            scale: 0.3,
            x: x - 2,
            y: y - 2
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: x - 2,
            y: y - 2
          }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.6,
            delay: shouldReduceMotion ? 0 : i * 0.05,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          style={{
            backgroundColor: color,
            left: '50%',
            top: '50%',
          }}
        />
      );
    }
    return dots;
  };

  const isStepLit = (index: number) => {
    return index >= currentStep;
  };

  const isLineLit = (lineIndex: number) => {
    return currentStep <= lineIndex;
  };

  return (
    <section 
      id="valuation-steps" 
      className={cn("py-10 md:py-20 bg-background", className)}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        {mainTitle && (
          <div className="text-center mb-6 md:mb-16">
            <h2
              className={cn(
                "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900",
                isRTL && "font-arabic"
              )}
            >
              {mainTitle}
            </h2>
          </div>
        )}

        {/* Interactive Steps Container */}
        <div 
          ref={containerRef}
          className="relative flex flex-col items-center gap-4 md:gap-8 p-4 sm:p-6 md:p-12 rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        >
          {/* Radial gradient overlay */}
          {currentStep >= 0 && gradientPosition && (
            <motion.div 
              className="absolute inset-0 pointer-events-none z-0"
              key={`gradient-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: `radial-gradient(circle at ${gradientPosition.x}px ${gradientPosition.y + 80}px, ${stepColors[currentStep].color}15 0%, ${stepColors[currentStep].color}08 40%, transparent 70%)`,
              }}
            />
          )}
          
          {/* Steps Container */}
          <div className={cn(
            "relative z-10 flex items-start gap-0 w-full justify-center",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            {displaySteps.map((step, index) => {
              const isActive = index === currentStep;
              const isLit = isStepLit(index);

              return (
                <div 
                  key={step.id} 
                  className={cn(
                    "flex items-start gap-0",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Step Column */}
                  <div className="flex flex-col items-center gap-2 md:gap-6">
                    {/* Circle with Icon */}
                    <motion.div 
                      ref={(el) => { circleRefs.current[index] = el; }}
                      className={cn(
                        "relative cursor-pointer rounded-full flex items-center justify-center flex-shrink-0",
                        "w-14 h-14",
                        "sm:w-16 sm:h-16",
                        "md:w-24 md:h-24",
                        "lg:w-28 lg:h-28"
                      )}
                      onClick={() => handleStepClick(step, index)}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        backgroundColor: isLit ? stepColors[index].color : '#f3f4f6',
                        borderColor: isLit ? stepColors[index].color : '#e5e7eb',
                        boxShadow: isActive 
                          ? `0 0 15px ${stepColors[index].color}40, 0 3px 10px ${stepColors[index].color}20`
                          : isLit 
                          ? `0 2px 8px ${stepColors[index].color}30`
                          : '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                      style={{
                        border: '2px solid',
                      }}
                    >
                      {/* Icon SVG */}
                      <svg
                        viewBox="0 0 400 512"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-12 md:h-12 lg:w-14 lg:h-14"
                        style={{
                          fill: isLit ? 'white' : '#9ca3af',
                          transition: 'fill 0.3s ease-in-out'
                        }}
                        aria-hidden="true"
                      >
                        <path d={step.stepDetails?.iconPathSvgD || "M200 50 L350 450 L50 450 Z"} />
                      </svg>
                      
                      {/* Orbital dots */}
                      {isActive && createOrbitalDots(10, 32, stepColors[index].color)}
                    </motion.div>

                    {/* Label */}
                    <motion.span 
                      className={cn(
                        "font-bold cursor-pointer text-center px-1",
                        isRTL && "font-arabic"
                      )}
                      style={{
                        whiteSpace: 'nowrap',
                        fontSize: isActive ? 'clamp(0.75rem, 2.5vw, 1.5rem)' : 'clamp(0.65rem, 2vw, 1.125rem)'
                      }}
                      onClick={() => handleStepClick(step, index)}
                      animate={{
                        color: isLit ? stepColors[index].color : '#9ca3af',
                        textShadow: isActive ? `0 1px 5px ${stepColors[index].color}30` : 'none'
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut"
                      }}
                    >
                      {step.title}
                    </motion.span>
                  </div>
                  
                  {/* Connecting Line */}
                  {index < displaySteps.length - 1 && (
                    <motion.div 
                      className="h-0.5 md:h-1 w-12 sm:w-16 md:w-40 lg:w-56 mx-2 sm:mx-3 md:mx-6 lg:mx-8 mt-6 sm:mt-8 md:mt-12 rounded-full flex-shrink-0"
                      animate={{
                        background: isLineLit(index)
                          ? `linear-gradient(${isRTL ? 'to left' : 'to right'}, ${stepColors[index].gradientFrom}, ${stepColors[index + 1].gradientTo})`
                          : '#e5e7eb',
                        opacity: isLineLit(index) ? 1 : 0.5
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
