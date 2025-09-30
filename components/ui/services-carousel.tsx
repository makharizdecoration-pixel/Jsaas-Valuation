"use client"

import React from 'react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'

// Define the type for a single service item
interface ServiceItem {
  id: string
  title: string
  description: string
  features: string[]
  imageUrl: string
  imageAlt: string
}

// Define the props for the new component
interface ServicesCarouselProps {
  items: ServiceItem[]
  isRTL: boolean
  onSwiper: (swiper: SwiperClass) => void
  onSlideChange: (index: number) => void
}

export function ServicesCarousel({ items, isRTL, onSwiper, onSlideChange }: ServicesCarouselProps) {
  return (
    // Swiper container with modules and settings
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      loop={true} // Enables smooth, infinite looping
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      onSwiper={onSwiper}
      onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
      className="w-full h-full"
      dir={isRTL ? 'rtl' : 'ltr'}
      key={isRTL ? 'rtl' : 'ltr'} // Add key to force re-render on language change
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${isRTL ? 'lg:order-last' : ''}`}>
              <img src={item.imageUrl} alt={item.imageAlt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
            </div>
            {/* Text Content Side */}
            <div className="space-y-6">
              <h3 className={`text-3xl font-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                {item.title}
              </h3>
              <p className={`text-lg text-zinc-300 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {item.description}
              </p>
              <div className="space-y-3">
                {item.features.map((feature, index) => (
                  <div key={index} className={`flex items-center gap-3 ${isRTL ? 'justify-end flex-row-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-[#fd9a01] rounded-full flex-shrink-0"></div>
                    <span className="text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}