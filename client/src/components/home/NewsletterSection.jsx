import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

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
    <section className="bg-slate-50 border-t border-slate-200/70 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto mb-4">
            <Mail size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Get the best deals first
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Subscribe for new arrivals, exclusive offers, and price drops delivered to your inbox.
          </p>

          {submitted ? (
            <div className="mt-5 flex items-center justify-center gap-2 text-green-600 animate-fade-in">
              <CheckCircle size={18} />
              <span className="text-sm font-bold">
                You're subscribed! Check your inbox for deals.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-sm whitespace-nowrap"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
