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

  const { data: topRatedData } = useProducts({
    sort: "ratingsAverage",
    order: "desc",
    limit: 4,
    isActive: "true",
  });

  const { data: categories } = useCategories();

  const featuredProducts = featuredData?.products || [];
  const newProducts = newData?.products || [];
  const topRatedProducts = topRatedData?.products || [];

  return (
    <main className="home-page">
      {/* Hero */}
      <div className="relative z-10 pt-3 sm:pt-5 lg:pt-7">
        <HeroCarousel />
      </div>

      {/* Categories */}
      <div className="relative z-10 mt-2 sm:mt-4">
        <CategorySection categories={categories} />
      </div>

      {/* Promotional content */}
      <div className="relative z-10">
        <PromoBanner />
      </div>

      {/* Main product discovery area */}
      <div className="home-surface-band relative z-10 mt-2">
        <ProductSection
          title="Featured Picks"
          subtitle="Carefully selected products worth discovering"
          linkText="View All"
          linkTo={`${routePaths.products}?isFeatured=true`}
          products={featuredProducts}
        />

        <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-border to-transparent" />

        <ProductSection
          title="New Arrivals"
          subtitle="Fresh products recently added to MarketFlow"
          linkText="View All"
          linkTo={`${routePaths.products}?sort=-createdAt`}
          products={newProducts}
        />
      </div>

      {/* Top-rated products */}
      <div className="relative z-10 bg-gradient-to-b from-transparent via-accent-50/45 to-transparent">
        <ProductSection
          title="Top Rated"
          subtitle="Products with the highest customer ratings"
          linkText="Explore Products"
          linkTo={routePaths.products}
          products={topRatedProducts}
        />
      </div>

      {/* Newsletter */}
      <div className="relative z-10 px-0 sm:px-2">
        <NewsletterSection />
      </div>

      {/* Store benefits */}
      <div className="relative z-10 border-t border-border/80 bg-white/75 backdrop-blur-sm">
        <BenefitsRow />
      </div>
    </main>
  );
}

export default HomePage;
