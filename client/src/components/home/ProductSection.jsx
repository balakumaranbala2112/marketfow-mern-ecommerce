import SectionHeading from "../common/SectionHeading.jsx";
import ProductCard from "./ProductCard.jsx";

function ProductSection({ title, subtitle, linkText, linkTo, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="home-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          linkText={linkText}
          linkTo={linkTo}
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
