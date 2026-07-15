/**
 * Mock data for the MarketFlow home page.
 * Used by hero carousel, category fallbacks, promo banners, benefits, and flash sale.
 */

export const heroSlides = [
  {
    id: 1,
    badge: "New Collection",
    heading: "Find Your Style,\nLove Your Look ✨",
    copy: "Discover the latest trends in fashion, beauty, and lifestyle.",
    cta: "Shop Now",
    ctaLink: "/products?search=fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
    gradient: "from-purple-100 via-violet-50 to-pink-50",
  },
  {
    id: 2,
    badge: "Up to 40% Off",
    heading: "Tech Deals\nYou'll Love 🎧",
    copy: "Latest gadgets and electronics at unbeatable prices this season.",
    cta: "Shop Now",
    ctaLink: "/products?search=electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
    gradient: "from-blue-100 via-indigo-50 to-purple-50",
  },
  {
    id: 3,
    badge: "Best Sellers",
    heading: "Home Essentials\nFor Every Room 🏠",
    copy: "Everything you need to make your home beautiful and functional.",
    cta: "Shop Now",
    ctaLink: "/products?search=home",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    gradient: "from-amber-50 via-orange-50 to-rose-50",
  },
  {
    id: 4,
    badge: "Fresh Drops",
    heading: "Sport & Fitness\nGear Up Now 🏋️",
    copy: "Premium equipment to elevate your fitness journey.",
    cta: "Shop Now",
    ctaLink: "/products?search=fitness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    gradient: "from-green-50 via-emerald-50 to-teal-50",
  },
];

export const sideOfferCards = [
  {
    id: 1,
    title: "Today's Deal",
    subtitle: "Wireless Earbuds",
    discount: "50% Off",
    cta: "Grab Now",
    ctaLink: "/products",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Smart Watches",
    discount: "Just Launched",
    cta: "Explore",
    ctaLink: "/products?sort=-createdAt",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
  },
];

export const fallbackCategories = [
  { name: "Fashion", icon: "👗", itemCount: 340, searchParam: "fashion" },
  { name: "Beauty", icon: "💄", itemCount: 190, searchParam: "beauty" },
  { name: "Electronics", icon: "💻", itemCount: 120, searchParam: "electronics" },
  { name: "Home & Living", icon: "🏠", itemCount: 210, searchParam: "home" },
  { name: "Sports", icon: "🏋️", itemCount: 85, searchParam: "sports" },
  { name: "More", icon: "🔖", itemCount: 500, searchParam: "" },
];

export const promoBanners = [
  {
    id: 1,
    title: "Flash Sale",
    subtitle: "Limited time deals",
    type: "flash-sale",
    bgColor: "bg-gradient-to-br from-purple-600 to-violet-700",
    textColor: "text-white",
    ctaLink: "/products",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Free Shipping",
    subtitle: "On orders over ₹500",
    type: "info",
    bgColor: "bg-white",
    textColor: "text-slate-900",
    ctaLink: "/products",
    icon: "Truck",
    cta: "Shop now →",
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Check out the latest trends",
    type: "info",
    bgColor: "bg-white",
    textColor: "text-slate-900",
    ctaLink: "/products?sort=-createdAt",
    icon: "Sparkles",
    cta: "Shop now →",
  },
];

export const benefitsData = [
  { icon: "ShieldCheck", title: "Secure Payment", desc: "100% secure payment" },
  { icon: "RotateCcw", title: "Easy Returns", desc: "30-day return policy" },
  { icon: "Headphones", title: "24/7 Support", desc: "Dedicated support" },
  { icon: "Users", title: "Trusted by Thousands", desc: "4.8 average rating" },
];

/**
 * Flash sale end time — 24 hours from now.
 * In production, this would come from the backend.
 */
export function getFlashSaleEndTime() {
  const end = new Date();
  end.setHours(end.getHours() + 24);
  return end.getTime();
}
