"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Twitter, Youtube, Linkedin, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Testimonial {
  name: string
  title: string
  description: string
  imageUrl: string
  githubUrl?: string
  twitterUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
}

const testimonials: Testimonial[] = [
  {
    name: "أحمد محمد السعيد",
    title: "مدير مشروع، شركة الرياض للتطوير العقاري",
    description:
      "تعاملنا مع مخارز للديكور في مشروع سكني كبير، وكانت النتائج مذهلة. الجودة العالية والالتزام بالمواعيد جعلهم الخيار الأول لجميع مشاريعنا القادمة.",
    imageUrl: "/client-testimonial-1.jpg",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "فاطمة عبدالله النور",
    title: "مصممة داخلية، استوديو النور للتصميم",
    description:
      "العمل مع فريق مخارز كان تجربة استثنائية. إتقانهم في التفاصيل وقدرتهم على تحويل الأفكار إلى واقع ملموس يفوق التوقعات.",
    imageUrl: "/client-testimonial-2.jpg",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "خالد بن سعد الغامدي",
    title: "رئيس قسم المشتريات، مجموعة الغامدي التجارية",
    description:
      "منذ أن بدأنا التعامل مع مخارز للديكور، تحسنت جودة مشاريعنا بشكل ملحوظ. فريقهم المتخصص وخبرتهم الواسعة جعلتهم شريكنا المفضل.",
    imageUrl: "/client-testimonial-3.jpg",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
]

export interface TestimonialCarouselProps {
  className?: string
  isRTL?: boolean
}

export function TestimonialCarousel({ className, isRTL = false }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => setCurrentIndex((index) => (index + 1) % testimonials.length)
  const handlePrevious = () => setCurrentIndex((index) => (index - 1 + testimonials.length) % testimonials.length)

  const currentTestimonial = testimonials[currentIndex]

  const socialIcons = [
    { icon: Github, url: currentTestimonial.githubUrl, label: "GitHub" },
    { icon: Twitter, url: currentTestimonial.twitterUrl, label: "Twitter" },
    { icon: Youtube, url: currentTestimonial.youtubeUrl, label: "YouTube" },
    { icon: Linkedin, url: currentTestimonial.linkedinUrl, label: "LinkedIn" },
  ]

  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4", className)}>
      {/* Desktop layout */}
      <div className={`hidden md:flex relative items-center ${isRTL ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-zinc-800 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Image
                src={currentTestimonial.imageUrl || "/placeholder.svg"}
                alt={currentTestimonial.name}
                width={470}
                height={470}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card */}
        <div
          className={`bg-zinc-900/90 border border-zinc-700 rounded-3xl shadow-2xl p-8 z-10 max-w-xl flex-1 ${isRTL ? "mr-[-80px]" : "ml-[-80px]"}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-6">
                <h2
                  className={`text-2xl font-bold text-white mb-2 font-almarai-bold ${isRTL ? "text-right" : "text-left"}`}
                >
                  {currentTestimonial.name}
                </h2>

                <p
                  className={`text-sm font-medium text-[#fd9a01] font-almarai-regular ${isRTL ? "text-right" : "text-left"}`}
                >
                  {currentTestimonial.title}
                </p>
              </div>

              <p
                className={`text-zinc-200 text-base leading-relaxed mb-8 font-almarai-regular ${isRTL ? "text-right" : "text-left"}`}
              >
                {currentTestimonial.description}
              </p>

              <div className={`flex space-x-4 ${isRTL ? "justify-end space-x-reverse" : "justify-start"}`}>
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <Link
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#fd9a01] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#e8890a] hover:scale-105 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden max-w-sm mx-auto text-center bg-transparent">
        {/* Avatar */}
        <div className="w-full aspect-square bg-zinc-800 rounded-3xl overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Image
                src={currentTestimonial.imageUrl || "/placeholder.svg"}
                alt={currentTestimonial.name}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card content */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h2
                className={`text-xl font-bold text-white mb-2 font-almarai-bold ${isRTL ? "text-right" : "text-center"}`}
              >
                {currentTestimonial.name}
              </h2>

              <p
                className={`text-sm font-medium text-[#fd9a01] mb-4 font-almarai-regular ${isRTL ? "text-right" : "text-center"}`}
              >
                {currentTestimonial.title}
              </p>

              <p
                className={`text-zinc-200 text-sm leading-relaxed mb-6 font-almarai-regular ${isRTL ? "text-right" : "text-center"}`}
              >
                {currentTestimonial.description}
              </p>

              <div className="flex justify-center space-x-4">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <Link
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#fd9a01] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#e8890a] cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-center items-center gap-6 mt-8">
        {/* Previous */}
        <button
          onClick={handlePrevious}
          aria-label="Previous testimonial"
          className="w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700 shadow-md flex items-center justify-center hover:bg-[#fd9a01] hover:border-[#fd9a01] transition-all duration-300 cursor-pointer"
        >
          {isRTL ? (
            <ChevronRight className="w-6 h-6 text-zinc-200" />
          ) : (
            <ChevronLeft className="w-6 h-6 text-zinc-200" />
          )}
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, testimonialIndex) => (
            <button
              key={testimonialIndex}
              onClick={() => setCurrentIndex(testimonialIndex)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer",
                testimonialIndex === currentIndex ? "bg-[#fd9a01] scale-125" : "bg-zinc-600 hover:bg-zinc-500",
              )}
              aria-label={`Go to testimonial ${testimonialIndex + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          className="w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700 shadow-md flex items-center justify-center hover:bg-[#fd9a01] hover:border-[#fd9a01] transition-all duration-300 cursor-pointer"
        >
          {isRTL ? (
            <ChevronLeft className="w-6 h-6 text-zinc-200" />
          ) : (
            <ChevronRight className="w-6 h-6 text-zinc-200" />
          )}
        </button>
      </div>
    </div>
  )
}
