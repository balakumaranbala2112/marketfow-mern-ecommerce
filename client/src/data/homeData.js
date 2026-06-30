/**
 * Mock data for the MarketFlow home page.
 * Used by hero carousel, side cards, category fallbacks, benefits, and flash sale.
 */

export const heroSlides = [
  {
    id: 1,
    badge: "Up to 40% Off",
    heading: "Smartphone Mega Sale",
    copy: "Latest flagship phones at unbeatable prices. Free delivery on all smartphones this week.",
    startingPrice: "₹12,999",
    cta: "Shop Now",
    ctaLink: "/products?search=phone",
    secondaryCta: "View Deals",
    secondaryCtaLink: "/products",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&h=600&fit=crop",
    bgColor: "bg-blue-50",
    accentColor: "text-blue-600",
    badgeColor: "bg-orange-500 text-white",
  },
  {
    id: 2,
    badge: "New Arrival",
    heading: "Premium Headphones",
    copy: "Studio-quality sound with active noise cancellation. Experience music like never before.",
    startingPrice: "₹2,499",
    cta: "Shop Now",
    ctaLink: "/products?search=headphone",
    secondaryCta: "View Deals",
    secondaryCtaLink: "/products",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=600&fit=crop",
    bgColor: "bg-purple-50",
    accentColor: "text-purple-600",
    badgeColor: "bg-purple-600 text-white",
  },
  {
    id: 3,
    badge: "Up to 60% Off",
    heading: "Fashion Deals",
    copy: "Trendy styles for every occasion. Refresh your wardrobe with our latest collection.",
    startingPrice: "₹499",
    cta: "Shop Now",
    ctaLink: "/products?search=fashion",
    secondaryCta: "View Deals",
    secondaryCtaLink: "/products",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=600&fit=crop",
    bgColor: "bg-rose-50",
    accentColor: "text-rose-600",
    badgeColor: "bg-rose-500 text-white",
  },
  {
    id: 4,
    badge: "Best Sellers",
    heading: "Home Essentials",
    copy: "Everything you need to make your home beautiful and functional. Top-rated products.",
    startingPrice: "₹299",
    cta: "Shop Now",
    ctaLink: "/products?search=home",
    secondaryCta: "View Deals",
    secondaryCtaLink: "/products",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=600&fit=crop",
    bgColor: "bg-amber-50",
    accentColor: "text-amber-700",
    badgeColor: "bg-amber-500 text-white",
  },
  {
    id: 5,
    badge: "Flat 30% Off",
    heading: "Fitness Gear",
    copy: "Get fit with premium equipment. From yoga mats to dumbbells — everything on sale.",
    startingPrice: "₹799",
    cta: "Shop Now",
    ctaLink: "/products?search=fitness",
    secondaryCta: "View Deals",
    secondaryCtaLink: "/products",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=600&fit=crop",
    bgColor: "bg-green-50",
    accentColor: "text-green-700",
    badgeColor: "bg-green-600 text-white",
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
  { name: "Electronics", icon: "💻", itemCount: 120, searchParam: "electronics" },
  { name: "Fashion", icon: "👗", itemCount: 340, searchParam: "fashion" },
  { name: "Home & Kitchen", icon: "🏠", itemCount: 210, searchParam: "home" },
  { name: "Sports & Fitness", icon: "🏋️", itemCount: 85, searchParam: "sports" },
  { name: "Books", icon: "📚", itemCount: 150, searchParam: "books" },
  { name: "Beauty & Personal Care", icon: "✨", itemCount: 190, searchParam: "beauty" },
];

export const benefitsData = [
  { icon: "Truck", title: "Free Delivery", desc: "On orders over ₹999" },
  { icon: "Shield", title: "Secure Payments", desc: "100% protected" },
  { icon: "RotateCcw", title: "Easy Returns", desc: "7-day return policy" },
  { icon: "Headphones", title: "24/7 Support", desc: "Dedicated helpdesk" },
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
