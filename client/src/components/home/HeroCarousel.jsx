import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { heroSlides } from "../../data/homeData.js";

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slideCount = heroSlides.length;

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % slideCount),
    [slideCount]
  );

  const prev = useCallback(
    () => setCurrent((prev) => (prev - 1 + slideCount) % slideCount),
    [slideCount]
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      {/* Full-viewport Hero */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700`}
      >
        {/* Background Image with Overlay */}
        <img
          src={slide.image}
          alt={slide.heading}
          className="absolute inset-0 w-full h-full object-cover opacity-20 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 flex h-full items-center">
        {/* Left — Text Content */}
        <div className="flex-1 px-8 md:px-16 lg:px-24 xl:px-32">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-5 py-2 text-xs font-bold text-purple-700 shadow-sm animate-fade-in">
            {slide.badge}
          </span>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-tight whitespace-pre-line animate-slide-up">
            {slide.heading}
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {slide.copy}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to={slide.ctaLink}
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 px-8 py-4 text-base font-bold text-white transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {slide.cta} <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right — Image */}
        <div className="hidden md:flex items-center justify-center flex-1 pr-12 lg:pr-20 xl:pr-28">
          <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20 ring-1 ring-white/30">
            <img
              src={slide.image}
              alt={slide.heading}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-pink-200/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-200/15 blur-3xl pointer-events-none" />

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-slate-600 shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all border border-white/50 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-slate-600 shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all border border-white/50 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === current
                ? "w-8 bg-purple-600 shadow-md shadow-purple-600/30"
                : "w-2.5 bg-slate-400/40 hover:bg-slate-400/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2 text-slate-400 animate-bounce">
        <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
        <ChevronLeft size={16} className="rotate-[-90deg]" />
      </div>
    </section>
  );
}

export default HeroCarousel;
