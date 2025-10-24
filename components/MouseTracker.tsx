"use client"

import { useEffect, useState, useCallback } from "react"

export default function MouseTracker() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  const updateMousePosition = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
    setIsVisible(true)
  }, [])

  useEffect(() => {
    let rafId: number;
    const throttledUpdate = (e: MouseEvent) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        updateMousePosition(e)
        rafId = 0
      })
    };
    const handleMouseLeave = () => {
      setIsVisible(false)
    };
    window.addEventListener("mousemove", throttledUpdate, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      window.removeEventListener("mousemove", throttledUpdate)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [updateMousePosition])

  return (
    <>
      <div
        // الدائرة الداخلية (نقطة صلبة)
        className="fixed top-0 left-0 w-4 h-4 bg-accent rounded-full pointer-events-none z-50 transition-opacity duration-200"
        style={{
          transform: `translate3d(${mousePosition.x - 8}px, ${mousePosition.y - 8}px, 0)`,
          opacity: isVisible ? 1 : 0,
        }}
      />

      <div
        // --- 🎨 تم تعديل الشفافية هنا ---
        // الدائرة الخارجية (إطار صلب)
        className="fixed top-0 left-0 w-6 h-6 border border-accent rounded-full pointer-events-none z-40 transition-all duration-300" // تم إزالة /60
        style={{
          transform: `translate3d(${mousePosition.x - 12}px, ${mousePosition.y - 12}px, 0)`,
          opacity: isVisible ? 0.6 : 0, // يمكنك تعديل الشفافية العامة هنا إذا أردت
        }}
      />
    </>
  )
}