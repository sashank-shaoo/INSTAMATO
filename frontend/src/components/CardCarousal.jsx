"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { SparklesIcon } from "lucide-react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

import { Badge } from "@/components/ui/badge";

const CardCarousel = ({
  videos,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 40px;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 240px;
  }

  @media (min-width: 640px) {
    .swiper-slide {
      width: 280px;
    }
  }

  @media (min-width: 1024px) {
    .swiper-slide {
      width: 320px;
    }
  }

  .swiper-slide video {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 16px;
    object-fit: cover;
  }

  .swiper-3d .swiper-slide-shadow-left,
  .swiper-3d .swiper-slide-shadow-right {
    background: none;
  }
  `;

  return (
    <section className="w-full px-2 sm:px-4 py-8">
      <style>{css}</style>

      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-black/10 p-3 shadow-sm sm:rounded-3xl bg-white/80 backdrop-blur">
        <div className="relative flex flex-col items-center gap-4 p-4 sm:p-6 md:p-8">
          {/* Badge */}
          <Badge
            variant="outline"
            className="absolute left-3 top-3 sm:left-6 sm:top-6 rounded-xl border border-black/10 text-sm sm:text-base flex items-center gap-1 bg-white/60 backdrop-blur">
            <SparklesIcon className="size-4 sm:size-5 text-pink-400" />
            Latest Component
          </Badge>

          {/* Header */}
          <div className="text-center mt-10 sm:mt-14">
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-800">
              Video Carousel
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Seamless autoplaying video carousel with 3D animation.
            </p>
          </div>

          {/* Swiper Carousel */}
          <div className="w-full flex justify-center mt-6 sm:mt-10">
            <Swiper
              spaceBetween={40}
              autoplay={{
                delay: autoplayDelay,
                disableOnInteraction: false,
              }}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
              }}
              pagination={showPagination}
              navigation={
                showNavigation
                  ? {
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }
                  : undefined
              }
              modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}>
              {videos.map((video, index) => (
                <SwiperSlide key={index}>
                  <div className="overflow-hidden rounded-2xl shadow-md">
                    <video
                      src={video.src}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full rounded-2xl"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;
