import SectionHeading from "../common/SectionHeading.jsx";
import ProductCard from "./ProductCard.jsx";

function ProductSection({ title, subtitle, linkText, linkTo, products }) {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <section
      className="home-section relative overflow-hidden"
      aria-labelledby={`product-section-${createSectionId(title)}`}
    >
      {/* Subtle section atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div
          id={`product-section-${createSectionId(title)}`}
          className="mb-6 sm:mb-8"
        >
          <SectionHeading
            title={title}
            subtitle={subtitle}
            linkText={linkText}
            linkTo={linkTo}
          />
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-5

            sm:gap-x-4
            sm:gap-y-6

            md:grid-cols-3
            md:gap-5

            lg:grid-cols-4
            lg:gap-6
          "
        >
          {products.map((product, index) => (
            <div
              key={product._id}
              className="min-w-0 animate-fade-in"
              style={{
                animationDelay: `${Math.min(index, 7) * 0.05}s`,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function createSectionId(title) {
  return String(title || "products")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default ProductSection;
