// components/sections/ValuationStepsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ValuationStep {
  id: string;
  title: string;
  stepDetails: {
    iconPathSvgD: string;
    // --- 🎨 تم حذف السطر الخاص بـ iconViewBox بناءً على طلبك ---
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

// --- 🎨 تمت إضافة هذه الدالة ---
/**
 * يستخلص بيانات الـ path من داخل d="..."
 * @param pathString النص القادم من الووردبريس
 * @returns بيانات الـ path النظيفة
 */
const extractPathData = (pathString: string): string => {
  if (!pathString) return "";
  
  // يبحث عن d="..." أو d='...'
  const match = pathString.match(/d=(["'])(.*?)\1/);
  
  // إذا وجد d="..."، يرجع ما بداخلها
  if (match && match[2]) {
    return match[2];
  }
  
  // إذا لم يجد (ربما أدخل المستخدم المسار مباشرة)
  // سيفترض أن النص المدخل هو المسار الصحيح
  // ويقوم بإزالة أي مسافات بيضاء زائدة
  return pathString.trim();
};
// ------------------------------

function getGridColumns(count: number, isMobile: boolean) {
  // للموبايل: ٣ فوق و٢ تحت
  if (isMobile && count === 5) return "repeat(3, 1fr)";
  if (!isMobile && count <= 6) return `repeat(${count}, 1fr)`;
  return `repeat(${Math.ceil(count / (isMobile ? 2 : 2))}, 1fr)`;
}
function getGridRow(idx: number, stepsLength: number, isMobile: boolean) {
  // للموبايل: ٣ فوق و٢ تحت
  if (isMobile && stepsLength === 5) return idx < 3 ? 1 : 2;
  return undefined;
}
function getJustifySelf(idx: number, stepsLength: number, isMobile: boolean) {
  // وسط كل صف في الموبايل فقط
  if (isMobile && stepsLength === 5) return "center";
  return undefined;
}

export const ValuationStepsSection: React.FC<ValuationStepsSectionProps> = ({
  mainTitle,
  steps,
  isRTL,
  className,
  autoPlay = true,
  autoPlayDelay = 1.1,
  loop = true,
  onStepChange,
}) => {
  const [circleSize, setCircleSize] = useState(60);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 700);
      const min = 32, max = 60;
      const count = Math.max(steps.length, 1);
      const width = typeof window !== "undefined" ? Math.min(window.innerWidth - 60, 1100) : 900;
      const size = count <= 4
        ? max
        : Math.max(min, Math.min(max, Math.floor((width - (count - 1) * 32) / count)));
      setCircleSize(size);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [steps.length]);

  useEffect(() => {
    if (!autoPlay || steps.length === 0) return;
    if (currentStep > steps.length && !loop) return;
    const timeout = setTimeout(() => {
      setCurrentStep((prev) => (prev < steps.length ? prev + 1 : loop ? 1 : prev));
    }, autoPlayDelay * 1000);
    return () => clearTimeout(timeout);
  }, [autoPlay, autoPlayDelay, loop, steps.length, currentStep]);

  useEffect(() => {
    if (onStepChange && steps[Math.min(currentStep, steps.length - 1)]) {
      onStepChange(steps[Math.min(currentStep, steps.length - 1)], Math.min(currentStep, steps.length - 1));
    }
  }, [currentStep, steps, onStepChange]);

  if (!steps || steps.length === 0) return null;

  return (
    <section className={cn("py-10 md:py-20 bg-background select-none", className)}>
      <div className="container mx-auto max-w-7xl px-2 sm:px-7">
        {mainTitle && (
          <div className="text-center mb-7 md:mb-10">
            <h2
              className={cn(
                "text-xl md:text-3xl font-bold text-gray-900",
                isRTL && "font-arabic"
              )}
            >
              {mainTitle}
            </h2>
          </div>
        )}

        <div
          style={{
            minHeight: steps.length > 6 || isMobile ? circleSize * 8 : circleSize * 4.7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #f6f7fa, #fff)",
            borderRadius: "1rem",
            boxShadow: "0 8px 24px #0001",
            width: "100%",
            padding: "40px 18px",
          }}
        >
          <div
            className="grid items-start justify-items-center w-full"
            style={{
              gridTemplateColumns: getGridColumns(steps.length, isMobile),
              gridTemplateRows: isMobile ? "repeat(2, 1fr)" : steps.length > 6 ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
              width: "100%",
              gap: "0px",
            }}
          >
            {steps.map((step, idx) => {
              // --- 🎨 تم التعديل هنا ---
              // نقوم بتنظيف البيانات القادمة من الووردبريس
              const cleanPathData = extractPathData(step.stepDetails.iconPathSvgD);
              // ------------------------

              return (
                <div
                  key={step.id}
                  style={{
                    gridRow: getGridRow(idx, steps.length, isMobile),
                    justifySelf: getJustifySelf(idx, steps.length, isMobile),
                    minWidth: 0,
                    position: "relative"
                  }}
                  className="flex flex-col items-center justify-start w-full"
                >
                  {/* الخط الفاصل */}
                  {idx > 0 && (!isMobile || (isMobile && idx !== 3)) && (
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: isRTL ? undefined : isMobile ? `-26px` : `-${circleSize * 0.22}px`,
                        right: isRTL ? isMobile ? `-26px` : `-${circleSize * 0.22}px` : undefined,
                        top: "53%",
                        transform: "translateY(-50%)",
                        height: 3,
                        width: isMobile ? "34px" : "34px",
                        minWidth: 10,
                        maxWidth: 40,
                        borderRadius: 3,
                        zIndex: 1,
                        background: idx <= currentStep - 1 ? "#09c" : "#e3e3e3",
                        opacity: idx <= currentStep - 1 ? 1 : 0.31,
                        transition: "background .3s, opacity .3s",
                      }}
                    />
                  )}

                  <motion.div
                    className={cn(
                      "rounded-full flex items-center justify-center border-2 shadow-lg cursor-pointer transition-all",
                      idx <= currentStep - 1
                        ? "bg-accent border-accent"
                        : "bg-background-secondary border-background-secondary"
                    )}
                    animate={{
                      scale: idx === currentStep ? 1.11 : 1,
                      boxShadow:
                        idx === currentStep ? `0 0 30px var(--accent)33` : undefined,
                    }}
                    style={{
                      width: circleSize,
                      height: circleSize,
                      minWidth: circleSize,
                      minHeight: circleSize,
                      marginBottom: 10,
                      zIndex: 2,
                    }}
                    onClick={() => setCurrentStep(idx + 1)}
                  >
                    {cleanPathData && (
                      <svg
                        // --- 🎨 المقاس الثابت (مشكلة التشويه) باقية كما هي بناءً على طلبك ---
                        viewBox="0 0 400 512" 
                        width={circleSize * 0.47}
                        height={circleSize * 0.47}
                        className={
                          idx <= currentStep - 1 ? "text-accent-text" : "text-primary"
                        }
                        fill="currentColor"
                        style={{
                          display: "block",
                          transition: "color .33s, fill .33s",
                        }}
                      >
                        {/* --- 🎨 تم التعديل هنا --- */}
                        <path d={cleanPathData} fill="currentColor" />
                      </svg>
                    )}
                  </motion.div>
                  
                  {/* مربع النص */}
                  <div
                    style={{
                      minHeight: 68,
                      maxHeight: 68,
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className={cn(
                        "text-center select-none transition-colors",
                        idx <= currentStep - 1 ? "text-accent" : "text-primary"
                      )}
                      style={{
                        fontWeight: "400",
                        fontSize:
                          isMobile
                            ? ".78rem"
                            : typeof window !== "undefined" && window.innerWidth < 1024
                            ? ".91rem"
                            : circleSize < 54
                            ? ".98rem"
                            : "1.11rem",
                        maxWidth: circleSize * 2.1,
                        whiteSpace: "normal",
                        lineHeight: 1.18,
                        width: "100%",
                        height: "100%",
                        display: "block",
                        marginTop: 5,
                      }}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};