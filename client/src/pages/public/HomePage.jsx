import { useProducts } from "../../features/products/hooks/useProducts.js";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import routePaths from "../../routes/routePaths.js";

import HeroCarousel from "../../components/home/HeroCarousel.jsx";
import CategorySection from "../../components/home/CategorySection.jsx";
import PromoBanner from "../../components/home/PromoBanner.jsx";
import ProductSection from "../../components/home/ProductSection.jsx";
import NewsletterSection from "../../components/home/NewsletterSection.jsx";
import BenefitsRow from "../../components/home/BenefitsRow.jsx";

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
    <main className="home-page space-y-0">
      {/* 1. Hero Carousel — purple gradient banner */}
      <HeroCarousel />

      {/* 2. Category Icons — circular row */}
      <CategorySection categories={categories} />

      {/* 3. Promo Cards — flash sale + info cards */}
      <PromoBanner />

      {/* 4. Best Deals for You */}
      <ProductSection
        title="Best Deals for You"
        subtitle="Handpicked products at the best prices"
        linkText="View All"
        linkTo={`${routePaths.products}?isFeatured=true`}
        products={featuredProducts}
      />

      {/* 5. Recommended for You */}
      <ProductSection
        title="Recommended for You"
        subtitle="Newest additions to the store"
        linkText="View All"
        linkTo={`${routePaths.products}?sort=-createdAt`}
        products={newProducts}
      />

      {/* 6. Best Sellers */}
      <ProductSection
        title="Best Sellers"
        subtitle="Most loved by our customers"
        linkText="View All"
        linkTo={routePaths.products}
        products={bestSellers}
      />

      {/* 7. Newsletter — Join MarketFlow Club */}
      <NewsletterSection />

      {/* 8. Trust Bar — Benefits at bottom */}
      <BenefitsRow />
    </main>
  );
}

export default HomePage;
