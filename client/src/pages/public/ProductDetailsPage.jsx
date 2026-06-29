import { useParams } from "react-router";

function ProductDetailsPage() {
  const { productId } = useParams();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
        Product Details
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        Product details page
      </h1>

      <p className="mt-4 text-slate-600">
        Product ID from route:{" "}
        <span className="font-semibold text-slate-950">{productId}</span>
      </p>
    </main>
  );
}

export default ProductDetailsPage;
