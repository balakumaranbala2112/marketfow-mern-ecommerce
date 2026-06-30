import { useProducts } from "../../features/products/hooks/useProducts.js";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import routePaths from "../../routes/routePaths.js";

import HeroCarousel from "../../components/home/HeroCarousel.jsx";
import BenefitsRow from "../../components/home/BenefitsRow.jsx";
import CategorySection from "../../components/home/CategorySection.jsx";
import PromoBanner from "../../components/home/PromoBanner.jsx";
import ProductSection from "../../components/home/ProductSection.jsx";
import FlashSaleStrip from "../../components/home/FlashSaleStrip.jsx";
import NewsletterSection from "../../components/home/NewsletterSection.jsx";

function HomePage() {
  const { data: featuredData } = useProducts({
    isFeatured: "true",
    limit: 8,
    isActive: "true",
  });
  const { data: newData } = useProducts({
    sort: "createdAt",
    order: "desc",
    limit: 8,
    isActive: "true",
  });
  const { data: bestSellerData } = useProducts({
    sort: "ratingsAverage",
    order: "desc",
    limit: 4,
    isActive: "true",
  });
  const { data: categories } = useCategories();

  const featuredProducts = featuredData?.products || [];
  const newProducts = newData?.products || [];
  const bestSellers = bestSellerData?.products || [];

  return (
    <main className="space-y-0">
      {/* Hero Carousel with Side Cards */}
      <HeroCarousel />

      {/* Trust / Benefits Row */}
      <BenefitsRow />

      {/* Shop by Category */}
      <CategorySection categories={categories} />

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Featured Deals */}
      <ProductSection
        label="Hot Deals"
        title="Featured Deals"
        subtitle="Handpicked products at the best prices"
        linkText="View All Deals"
        linkTo={`${routePaths.products}?isFeatured=true`}
        products={featuredProducts}
      />

      {/* Flash Sale Countdown */}
      <FlashSaleStrip />

      {/* Just Landed */}
      <ProductSection
        label="Fresh Stock"
        title="Just Landed"
        subtitle="Newest additions to the store"
        linkText="See All New Arrivals"
        linkTo={`${routePaths.products}?sort=-createdAt`}
        products={newProducts}
      />

      {/* Best Sellers */}
      <ProductSection
        label="Top Rated"
        title="Best Sellers"
        subtitle="Most loved by our customers"
        linkText="View All"
        linkTo={routePaths.products}
        products={bestSellers}
      />

      {/* Newsletter */}
      <NewsletterSection />
    </main>
  );
}

export default HomePage;
