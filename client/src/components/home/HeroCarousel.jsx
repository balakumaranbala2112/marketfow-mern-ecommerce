import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { heroSlides, sideOfferCards } from "../../data/homeData.js";

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
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="bg-white">
      {/* Edge-to-Edge slide background (100% viewport width, no outer margin or padding, no rounded corners) */}
      <div
        className="w-full relative overflow-hidden min-h-[340px] md:min-h-[440px] bg-cover bg-center transition-all duration-700 flex items-center shadow-sm"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        {/* Soft dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/35 via-slate-900/10 to-transparent" />

        {/* Content alignment wrapper inside the full-width carousel */}
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 relative z-10">
          {/* Left-aligned Frosted Glass Card overlay */}
          <div className="max-w-md w-full rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 p-6 md:p-8 shadow-xl animate-fade-in">
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full ${slide.badgeColor} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm`}
            >
              {slide.badge}
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              {slide.heading}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {slide.copy}
            </p>
            <p className="mt-3 text-xs text-slate-500 font-medium">
              Starting from{" "}
              <span className="text-lg font-black text-slate-900">
                {slide.startingPrice}
              </span>
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-orange-500/20"
              >
                {slide.cta} <ArrowRight size={13} />
              </Link>
              <Link
                to={slide.secondaryCtaLink}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                {slide.secondaryCta}
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel navigation arrows on absolute edges of the screen */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all border border-slate-200 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all border border-slate-200 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-slate-900/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Offer Cards aligned with standard max-width page container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sideOfferCards.map((card) => (
            <Link
              key={card.id}
              to={card.ctaLink}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all p-5 flex items-center justify-between"
            >
              <div className="z-10 max-w-[65%]">
                <span className="inline-block rounded-full bg-orange-500 text-white px-2.5 py-0.5 text-[10px] font-bold">
                  {card.discount}
                </span>
                <h3 className="mt-2 text-base font-extrabold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">{card.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-650 group-hover:gap-2 transition-all mt-3">
                  {card.cta} <ArrowRight size={12} />
                </span>
              </div>
              <div className="shrink-0 w-24 h-20 md:w-32 md:h-24 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 shadow-sm relative">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-355 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
