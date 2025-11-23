// components/sections/ValuationPurposesSection.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, Zap, ArrowRight } from "lucide-react";

// --- Interfaces ---
interface Purpose {
  id: string;
  title: string;
  content: string;
  purposeDetails: {
    iconPathSvgD: string;
  };
  status?: "completed" | "in-progress" | "pending";
  energy?: number;
  relatedIds?: string[];
}

interface ValuationPurposesSectionProps {
  mainTitle?: string;
  centerLogoUrl?: string;
  purposes: Purpose[];
  isRTL: boolean;
  className?: string;
}

// --- Constants ---
const ORBIT_RADIUS = 300;
const ORBIT_RADIUS_MOBILE = 200;
const ICON_SIZE = 70;
const ICON_SIZE_MOBILE = 60;
const ICON_SVG_SIZE = 38;
const ICON_SVG_SIZE_MOBILE = 32;
const CENTER_LOGO_SIZE = 110;
const CENTER_LOGO_SIZE_MOBILE = 80;

export const ValuationPurposesSection: React.FC<ValuationPurposesSectionProps> = ({
  mainTitle,
  centerLogoUrl,
  purposes,
  isRTL,
  className,
}) => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<string, boolean>>({});
  const [radius, setRadius] = useState(ORBIT_RADIUS);
  const [iconSize, setIconSize] = useState(ICON_SIZE);
  const [iconSvgSize, setIconSvgSize] = useState(ICON_SVG_SIZE);
  const [centerLogoSize, setCenterLogoSize] = useState(CENTER_LOGO_SIZE);
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(); // مرجع لحفظ الـ Animation Frame

  const numItems = purposes.length;

  // --- Handle Radius & Sizes ---
  useEffect(() => {
    const updateSizes = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setRadius(window.innerWidth < 768 ? ORBIT_RADIUS_MOBILE : ORBIT_RADIUS);
      setIconSize(window.innerWidth < 768 ? ICON_SIZE_MOBILE : ICON_SIZE);
      setIconSvgSize(window.innerWidth < 768 ? ICON_SVG_SIZE_MOBILE : ICON_SVG_SIZE);
      setCenterLogoSize(window.innerWidth < 768 ? CENTER_LOGO_SIZE_MOBILE : CENTER_LOGO_SIZE);
    };
    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  // --- Optimized Auto-rotation using requestAnimationFrame ---
  const animate = useCallback(() => {
    setRotationAngle((prevAngle) => {
      // زيادة ناعمة جداً في الزاوية (0.15 بدل 0.3) لحركة أكثر انسيابية
      return (prevAngle + 0.15) % 360;
    });
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (autoRotate) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [autoRotate, animate]);

  // --- Calculate Position ---
  const calculateNodePosition = (index: number) => {
    const angle = ((index / numItems) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = 1;
    const isInUpperHalf = y < 0;

    return { x, y, angle, zIndex, opacity, isInUpperHalf };
  };

  // --- Click Handlers ---
  const handleItemClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setExpandedItemId((prev) => {
      const newId = prev === id ? null : id;
      
      if (newId) {
        setAutoRotate(false);
        const item = purposes.find(p => p.id === newId);
        if (item?.relatedIds) {
          const newPulse: Record<string, boolean> = {};
          item.relatedIds.forEach(relId => {
            newPulse[relId] = true;
          });
          setPulseEffect(newPulse);
        }
      } else {
        setAutoRotate(true);
        setPulseEffect({});
      }
      
      return newId;
    });
  };

  const handleCloseCard = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setExpandedItemId(null);
    setAutoRotate(true);
    setPulseEffect({});
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      handleCloseCard();
    }
  };

  // --- Get Status Styles ---
  const getStatusStyles = (status?: "completed" | "in-progress" | "pending") => {
    if (!status) return "bg-accent/20 border-accent/50";
    switch (status) {
      case "completed":
        return "bg-green-500/20 border-green-500/50 text-green-400";
      case "in-progress":
        return "bg-blue-500/20 border-blue-500/50 text-blue-400";
      case "pending":
        return "bg-gray-500/20 border-gray-500/50 text-gray-400";
      default:
        return "bg-accent/20 border-accent/50";
    }
  };

  if (!purposes || purposes.length === 0) return null;

  const expandedPurpose = purposes.find((p) => p.id === expandedItemId);
  const expandedIndex = purposes.findIndex((p) => p.id === expandedItemId);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .purposes-card-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .purposes-card-scroll::-webkit-scrollbar-track {
          background: rgba(99, 102, 241, 0.1);
          border-radius: 10px;
        }
        .purposes-card-scroll::-webkit-scrollbar-thumb {
          background: rgb(99, 102, 241);
          border-radius: 10px;
        }
        .purposes-card-scroll::-webkit-scrollbar-thumb:hover {
          background: rgb(79, 82, 221);
        }
      `}} />

      <section
        id="purposes"
        className={cn(
          "relative py-8 bg-background-secondary/30 overflow-visible",
          className
        )}
        style={{ zIndex: 1 }}
        ref={containerRef}
        onClick={handleContainerClick}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          {mainTitle && (
            <div className="text-center mb-2">
              <h2
                className={`text-2xl md:text-4xl font-bold text-text-primary ${
                  isRTL ? "font-arabic font-bold" : "font-bold"
                }`}
              >
                {mainTitle}
              </h2>
            </div>
          )}

          {/* Orbit Container */}
          <div
            className="relative w-full flex items-center justify-center"
            style={{ minHeight: `${radius * 2 + 300}px` }}
            ref={orbitRef}
          >
            {/* Center Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="absolute rounded-full border border-accent/40 animate-ping opacity-70"
                  style={{
                    width: `${centerLogoSize + 20}px`,
                    height: `${centerLogoSize + 20}px`,
                    left: `-10px`,
                    top: `-10px`,
                  }}
                ></div>
                <div
                  className="absolute rounded-full border border-accent/20 animate-ping opacity-50"
                  style={{
                    width: `${centerLogoSize + 40}px`,
                    height: `${centerLogoSize + 40}px`,
                    left: `-20px`,
                    top: `-20px`,
                    animationDelay: "0.5s",
                  }}
                ></div>
                
                {centerLogoUrl ? (
                  <img
                    src={centerLogoUrl}
                    alt="Center Logo"
                    className="rounded-full border-2 border-accent shadow-lg relative z-10"
                    style={{
                      width: `${centerLogoSize}px`,
                      height: `${centerLogoSize}px`,
                    }}
                  />
                ) : (
                  <div 
                    className="rounded-full bg-gradient-to-br from-accent via-primary to-accent-hover animate-pulse relative z-10"
                    style={{
                      width: `${centerLogoSize}px`,
                      height: `${centerLogoSize}px`,
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Orbit Circle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/50"
              style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
            ></div>

            {/* Orbiting Items */}
            {purposes.map((item, index) => {
              const position = calculateNodePosition(index);
              const isExpanded = expandedItemId === item.id;
              const isPulsing = pulseEffect[item.id];
              const energy = item.energy || 0;

              return (
                <div
                  key={item.id}
                  className="absolute transition-transform duration-0 cursor-pointer will-change-transform" // Removed duration for smooth rAF
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    zIndex: isExpanded ? 200 : position.zIndex,
                    opacity: 1,
                    top: "50%",
                    left: "50%",
                    marginLeft: `-${iconSize / 2}px`,
                    marginTop: `-${iconSize / 2}px`,
                  }}
                  onClick={(e) => handleItemClick(item.id, e)}
                >
                  {/* Energy Glow */}
                  <div
                    className={`absolute rounded-full -inset-2 ${
                      isPulsing ? "animate-pulse" : ""
                    }`}
                    style={{
                      background: `radial-gradient(circle, rgba(var(--accent-rgb, 99, 102, 241), 0.4) 0%, transparent 70%)`,
                      width: `${energy * 0.5 + 60}px`,
                      height: `${energy * 0.5 + 60}px`,
                      left: `-${(energy * 0.5 + 60 - iconSize) / 2}px`,
                      top: `-${(energy * 0.5 + 60 - iconSize) / 2}px`,
                    }}
                  ></div>

                  {/* Icon Node */}
                  <div
                    className={cn(
                      "rounded-full flex items-center justify-center transition-all duration-300 transform border-2",
                      isExpanded
                        ? "bg-accent text-accent-text border-accent shadow-xl shadow-accent/50 scale-125"
                        : isPulsing
                        ? "bg-accent/60 text-accent-text border-accent animate-pulse"
                        : "bg-background text-accent border-accent/60 hover:bg-accent/10 hover:border-accent hover:shadow-lg"
                    )}
                    style={{
                      width: `${iconSize}px`,
                      height: `${iconSize}px`,
                    }}
                  >
                    <svg
                      width={iconSvgSize}
                      height={iconSvgSize}
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-md"
                    >
                      <path d={item.purposeDetails.iconPathSvgD} />
                    </svg>
                  </div>

                  {/* Title */}
                  <div
                    className={cn(
                      "absolute whitespace-nowrap font-bold tracking-wide transition-all duration-300 drop-shadow-md",
                      isExpanded ? "text-accent scale-110" : "text-text-primary"
                    )}
                    style={{
                      top: `${iconSize + 12}px`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: isExpanded ? "15px" : "13px",
                    }}
                  >
                    {item.title}
                  </div>
                </div>
              );
            })}

            {/* DESKTOP CARD */}
            {expandedItemId && !isMobile && expandedPurpose && expandedIndex !== -1 && (() => {
               const pos = calculateNodePosition(expandedIndex);
               const verticalOffset = iconSize / 2 + 15; 
               
               const cardLeft = `calc(50% + ${pos.x}px)`;
               const cardTop = pos.isInUpperHalf 
                 ? `calc(50% + ${pos.y}px + ${verticalOffset}px)`
                 : `calc(50% + ${pos.y}px - ${verticalOffset}px)`;

               const lineStyle = pos.isInUpperHalf 
                 ? { top: '-15px', height: '15px' }
                 : { bottom: '-15px', height: '15px' };
                 
               const cardTransform = pos.isInUpperHalf
                 ? "translateX(-50%)"
                 : "translateX(-50%) translateY(-100%)";

               return (
                 <div
                    className="absolute z-[500] bg-background/98 backdrop-blur-xl border-2 border-accent/60 rounded-xl shadow-2xl w-80 flex flex-col transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2"
                    style={{
                      left: cardLeft,
                      top: cardTop,
                      transform: cardTransform,
                      maxHeight: "400px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                 >
                     <div 
                       className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-accent/60 z-20"
                       style={lineStyle}
                     ></div>

                    <div 
                      className="purposes-card-scroll flex-1 overflow-y-auto p-6"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgb(99, 102, 241) rgba(99, 102, 241, 0.1)",
                      }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        {expandedPurpose.status && (
                          <div className={cn("px-3 py-1.5 text-xs font-bold rounded-full border", getStatusStyles(expandedPurpose.status))}>
                            {expandedPurpose.status === "completed" ? "مكتمل" : expandedPurpose.status === "in-progress" ? "قيد التنفيذ" : "معلق"}
                          </div>
                        )}
                        <button onClick={handleCloseCard} className="text-text-secondary hover:text-accent p-1.5 rounded-full hover:bg-accent/10 transition-colors">
                          <X size={20} />
                        </button>
                      </div>

                      <h3 className={`text-xl font-bold text-text-primary mb-3 ${isRTL ? "font-arabic text-right" : "text-left"}`}>
                        {expandedPurpose.title}
                      </h3>

                      <div className={`text-sm leading-relaxed text-text-secondary mb-3 ${isRTL ? "font-arabic text-right" : "text-left"}`}
                        dangerouslySetInnerHTML={{ __html: expandedPurpose.content || "" }}
                      />

                      {expandedPurpose.energy !== undefined && (
                        <div className="pt-3 border-t border-border/40">
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span className="flex items-center text-text-secondary font-medium">
                              <Zap size={14} className={isRTL ? "ml-1.5" : "mr-1.5"} />
                              مستوى الطاقة
                            </span>
                            <span className="font-mono font-bold text-accent">{expandedPurpose.energy}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full"
                              style={{ width: `${expandedPurpose.energy}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {expandedPurpose.relatedIds && expandedPurpose.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/40">
                          <h4 className="text-sm font-bold text-text-secondary mb-2 flex items-center">
                            <ArrowRight size={14} className={isRTL ? "ml-1.5 rotate-180" : "mr-1.5"} />
                            عناصر مرتبطة
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {expandedPurpose.relatedIds.map((relatedId) => {
                              const relatedItem = purposes.find(p => p.id === relatedId);
                              if (!relatedItem) return null;
                              return (
                                <button key={relatedId}
                                  className="text-xs px-3 py-2 rounded-lg border border-accent/40 bg-accent/5 hover:bg-accent/15 hover:border-accent text-text-primary hover:text-accent transition-all font-semibold"
                                  onClick={(e) => { e.stopPropagation(); handleItemClick(relatedId, e); }}
                                >
                                  {relatedItem.title}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                 </div>
               );
            })()}

          </div>
        </div>
      </section>

      {/* MOBILE CARD */}
      {expandedItemId && isMobile && expandedPurpose && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={handleCloseCard}
        >
          <div 
            className="w-full max-w-md bg-background/95 backdrop-blur-xl border-2 border-accent/60 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300"
            style={{ maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="purposes-card-scroll flex-1 overflow-y-auto p-5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(99, 102, 241) rgba(99, 102, 241, 0.1)",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                {expandedPurpose.status && (
                  <div className={cn("px-3 py-1.5 text-xs font-bold rounded-full border", getStatusStyles(expandedPurpose.status))}>
                    {expandedPurpose.status === "completed" ? "مكتمل" : expandedPurpose.status === "in-progress" ? "قيد التنفيذ" : "معلق"}
                  </div>
                )}
                <button onClick={handleCloseCard} className="text-text-secondary hover:text-accent p-2 rounded-full hover:bg-accent/10 transition-all">
                  <X size={20} />
                </button>
              </div>

              <h3 className={`text-xl font-bold text-text-primary mb-3 ${isRTL ? "font-arabic text-right" : "text-left"}`}>
                {expandedPurpose.title}
              </h3>

              <div className={`text-sm leading-relaxed text-text-secondary mb-3 ${isRTL ? "font-arabic text-right" : "text-left"}`}
                dangerouslySetInnerHTML={{ __html: expandedPurpose.content || "" }}
              />

              {expandedPurpose.energy !== undefined && (
                <div className="pt-3 border-t border-border/40">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="flex items-center text-text-secondary font-medium">
                      <Zap size={14} className={isRTL ? "ml-1.5" : "mr-1.5"} />
                      مستوى الطاقة
                    </span>
                    <span className="font-mono font-bold text-accent">{expandedPurpose.energy}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-border/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full"
                      style={{ width: `${expandedPurpose.energy}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {expandedPurpose.relatedIds && expandedPurpose.relatedIds.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/40">
                  <h4 className="text-sm font-bold text-text-secondary mb-2 flex items-center">
                    <ArrowRight size={14} className={isRTL ? "ml-1.5 rotate-180" : "mr-1.5"} />
                    عناصر مرتبطة
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {expandedPurpose.relatedIds.map((relatedId) => {
                      const relatedItem = purposes.find(p => p.id === relatedId);
                      if (!relatedItem) return null;
                      return (
                        <button key={relatedId}
                          className="text-xs px-3 py-2 rounded-lg border border-accent/40 bg-accent/5 hover:bg-accent/15 hover:border-accent text-text-primary hover:text-accent transition-all font-semibold"
                          onClick={(e) => { e.stopPropagation(); handleItemClick(relatedId, e); }}
                        >
                          {relatedItem.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};