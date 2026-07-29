import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { heroSlides } from "../../data/homeData.js";

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slideCount = heroSlides.length;

  const next = useCallback(() => {
    setCurrent((previous) => (previous + 1) % slideCount);
  }, [slideCount]);

  const prev = useCallback(() => {
    setCurrent((previous) => (previous - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    const timer = window.setInterval(next, 6000);

    return () => {
      window.clearInterval(timer);
    };
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section
      className="w-full px-3 sm:px-5 lg:px-8"
      aria-label="Featured MarketFlow collections"
      aria-roledescription="carousel"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-primary-800/70 bg-primary-950 shadow-[0_30px_80px_-36px_rgba(20,34,49,0.8)] sm:rounded-[2rem]">
          {/* Subtle slide-specific gradient from existing data */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-[0.09]`}
            aria-hidden="true"
          />

          {/* Brand atmosphere */}
          <div
            className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid lg:min-h-[560px] lg:grid-cols-[1.04fr_0.96fr]">
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16 xl:px-20">
              <div aria-live="polite">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-300/25 bg-accent-400/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-200 backdrop-blur-sm sm:text-xs">
                  <ShieldCheck size={15} aria-hidden="true" />
                  {slide.badge}
                </div>

                <h1 className="mt-6 max-w-2xl whitespace-pre-line text-[2.25rem] font-extrabold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]">
                  {slide.heading}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-primary-200 sm:text-lg sm:leading-8">
                  {slide.copy}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to={slide.ctaLink}
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-400 px-6 py-3.5 text-sm font-extrabold text-primary-950 shadow-[0_14px_35px_-15px_rgba(53,196,172,0.95)] transition duration-200 hover:-translate-y-0.5 hover:bg-accent-300 hover:shadow-[0_18px_42px_-16px_rgba(53,196,172,0.95)] sm:w-auto"
                  >
                    {slide.cta}

                    <ArrowRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>

              {/* Carousel navigation */}
              <div className="mt-10 flex items-center justify-between gap-5 border-t border-white/10 pt-6 sm:mt-12">
                <div
                  className="flex items-center gap-2.5"
                  aria-label="Choose carousel slide"
                >
                  {heroSlides.map((item, index) => {
                    const isActive = index === current;

                    return (
                      <button
                        key={`${item.heading}-${index}`}
                        type="button"
                        onClick={() => setCurrent(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-9 bg-accent-300"
                            : "w-2.5 bg-white/30 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={isActive ? "true" : undefined}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/8 text-white transition duration-200 hover:border-white/25 hover:bg-white/15"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/8 text-white transition duration-200 hover:border-white/25 hover:bg-white/15"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product image */}
            <div className="relative min-h-[300px] overflow-hidden border-t border-white/10 sm:min-h-[380px] lg:min-h-full lg:border-l lg:border-t-0">
              <img
                src={slide.image}
                alt={slide.heading.replace(/\s+/g, " ").trim()}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Keeps text/image separation clear */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/65 via-primary-950/5 to-transparent lg:bg-gradient-to-r lg:from-primary-950/45 lg:via-primary-950/5 lg:to-transparent"
                aria-hidden="true"
              />

              {/* Premium inner border */}
              <div
                className="pointer-events-none absolute inset-4 rounded-[1.15rem] border border-white/15 sm:inset-6 sm:rounded-[1.5rem]"
                aria-hidden="true"
              />

              {/* Current slide number */}
              <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/20 bg-primary-950/65 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:bottom-7 sm:right-7">
                <span className="text-accent-300">
                  {String(current + 1).padStart(2, "0")}
                </span>

                <span className="text-white/35">/</span>

                <span className="text-white/70">
                  {String(slideCount).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
