import { useState } from "react";
import { ArrowRight, CheckCircle, Gift } from "lucide-react";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  }

  return (
    <section className="home-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-8 py-10 md:px-14 md:py-12 shadow-2xl shadow-purple-600/20">
          {/* Decorative */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-purple-400/20 blur-2xl" />
          <div className="absolute top-6 right-8 hidden lg:block">
            <Gift size={80} className="text-white/10" strokeWidth={1} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Join MarketFlow Club
              </h2>
              <p className="mt-2 text-sm sm:text-base text-purple-100 max-w-md leading-relaxed">
                Get exclusive offers, early access and more!
              </p>
            </div>

            {/* Right — Input/CTA */}
            <div className="w-full lg:w-auto">
              {submitted ? (
                <div className="flex items-center gap-2 text-white bg-white/20 py-3 px-6 rounded-full animate-fade-in backdrop-blur-sm">
                  <CheckCircle size={20} className="text-green-300" />
                  <span className="text-sm font-bold">
                    You're in! Welcome to the club.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 min-w-0 sm:min-w-[260px] rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-6 py-3.5 text-sm text-white placeholder-purple-200 outline-none transition-all focus:bg-white/25 focus:border-white/40 !shadow-none"
                    style={{ boxShadow: 'none' }}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-purple-700 hover:bg-purple-50 transition-all shadow-lg shadow-purple-900/20 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Join Now <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
