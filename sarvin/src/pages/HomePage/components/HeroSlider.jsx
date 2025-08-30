import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      mobileImage: "/assets/Hero1.jpg",
      desktopImage: "/assets/Hero1_1.jpg",
    },
    {
      mobileImage: "/assets/Hero2.jpg",
      desktopImage: "/assets/Hero2_1.jpg",
    },
    {
      mobileImage: "/assets/Hero3.jpg",
      desktopImage: "/assets/Hero3_1.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <section className="relative grid overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`col-start-1 row-start-1 transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10 z-10"></div>
            
            <picture>
              <source media="(min-width: 1024px)" srcSet={slide.desktopImage} />
              
              <img
                src={slide.mobileImage}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-auto"
                style={{
                  transition: "transform 10s ease-out",
                  transform: activeSlide === index ? "scale(1)" : "scale(1.05)",
                }}
              />
            </picture>

          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-8  transition-all ${
                activeSlide === index ? "bg-[#C87941] w-12" : "bg-white/50"
              }`}
              onClick={() => setActiveSlide(index)}
            ></button>
          ))}
        </div>

        {/* Navigation Arrows */}
        {/* <button
          onClick={() =>
            setActiveSlide((prev) =>
              prev === 0 ? slides.length - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3  transition-all"
        >
          <ChevronRight className="h-6 w-6 rotate-180" />
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3  transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button> */}
      </section>
    </>
  );
};

export default HeroSlider;