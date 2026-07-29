import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, Edit3, Package, Plus, Search, Trash2, X } from "lucide-react";

import {
  useAdminProducts,
  useDeleteProduct,
} from "../../features/admin/hooks/useAdmin.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

import useToastStore from "../../stores/toastStore.js";

function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const addToast = useToastStore((state) => state.addToast);

  const { data, isLoading, refetch } = useAdminProducts({
    page,
    limit: 10,
    search,
  });

  const deleteProductMutation = useDeleteProduct();

  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const products = data?.products || [];
  const totalPages = data?.meta?.pagination?.totalPages || 1;

  const totalProducts =
    data?.meta?.pagination?.totalItems ??
    data?.meta?.pagination?.totalProducts ??
    data?.meta?.count ??
    products.length;

  const activeProducts = products.filter((product) => product.isActive).length;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= 5,
  ).length;

  function handleSearch(event) {
    event.preventDefault();

    const nextParams = new URLSearchParams(searchParams);
    const normalizedSearch = searchInput.trim();

    if (normalizedSearch) {
      nextParams.set("search", normalizedSearch);
    } else {
      nextParams.delete("search");
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  }

  function clearSearch() {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("search");
    nextParams.set("page", "1");

    setSearchInput("");
    setSearchParams(nextParams);
  }

  function handleDeleteConfirm() {
    if (!productIdToDelete) return;

    deleteProductMutation.mutate(productIdToDelete, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "Product deleted successfully",
        });

        setProductIdToDelete(null);
        refetch();
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message || "Failed to delete product",
        });
      },
    });
  }

  function handlePageChange(nextPage) {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
            Catalog management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Search, review, edit, or remove items from the store catalog.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-4 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300"
        >
          <Plus size={16} aria-hidden="true" />
          Add product
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Catalog total"
          value={Number(totalProducts).toLocaleString("en-IN")}
          dotClassName="bg-primary-700"
        />

        <SummaryCard
          label="Active on page"
          value={activeProducts.toLocaleString("en-IN")}
          dotClassName="bg-green-600"
        />

        <SummaryCard
          label="Low stock on page"
          value={lowStockProducts.toLocaleString("en-IN")}
          dotClassName="bg-amber-500"
        />
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
        <div className="border-b border-border bg-surface-subtle p-4 sm:p-5">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
            role="search"
          >
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
                aria-hidden="true"
              />

              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by product name, SKU, or brand"
                className="min-h-[44px] w-full rounded-md border border-border-strong bg-white py-2.5 pl-10 pr-10 text-sm text-text outline-none placeholder:text-text-soft focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-primary-500 transition hover:bg-primary-50 hover:text-primary-950"
                  aria-label="Clear search input"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-primary-950 bg-primary-950 px-5 text-sm font-bold text-white transition hover:bg-primary-800"
            >
              Search
            </button>

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border-strong bg-white px-4 text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
              >
                Clear results
              </button>
            )}
          </form>
        </div>

        {isLoading ? (
          <div className="py-20">
            <PageLoader />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-border bg-white">
                  <tr className="text-xs font-bold uppercase tracking-[0.08em] text-text-soft">
                    <th className="px-5 py-3.5">Product</th>
                    <th className="px-5 py-3.5">SKU</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Stock</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-primary-50/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <ProductImage product={product} />

                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate font-extrabold text-primary-950">
                              {product.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-text-soft">
                              {product.category?.name || "Uncategorized"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-xs font-semibold text-primary-700">
                        {product.sku || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <ProductPrice product={product} />
                      </td>

                      <td className="px-5 py-4">
                        <StockStatus stock={product.stock} />
                      </td>

                      <td className="px-5 py-4">
                        <ActiveStatus active={product.isActive} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-white text-primary-700 transition hover:bg-primary-50 hover:text-primary-950"
                            aria-label={`Edit ${product.name}`}
                            title={`Edit ${product.name}`}
                          >
                            <Edit3 size={15} aria-hidden="true" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setProductIdToDelete(product._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                            aria-label={`Delete ${product.name}`}
                            title={`Delete ${product.name}`}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-border md:hidden">
              {products.map((product) => (
                <article key={product._id} className="p-4">
                  <div className="flex items-start gap-3">
                    <ProductImage product={product} />

                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-2 font-extrabold text-primary-950">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-xs text-text-muted">
                        {product.category?.name || "Uncategorized"}
                      </p>

                      <div className="mt-2">
                        <ProductPrice product={product} />
                      </div>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-border bg-surface-subtle p-3 text-xs">
                    <MobileStat label="SKU" value={product.sku || "—"} />

                    <MobileStat
                      label="Stock"
                      value={`${Number(product.stock || 0).toLocaleString(
                        "en-IN",
                      )} units`}
                    />

                    <div>
                      <dt className="font-semibold uppercase tracking-[0.08em] text-text-soft">
                        Visibility
                      </dt>
                      <dd className="mt-1">
                        <ActiveStatus active={product.isActive} />
                      </dd>
                    </div>

                    <div>
                      <dt className="font-semibold uppercase tracking-[0.08em] text-text-soft">
                        Inventory
                      </dt>
                      <dd className="mt-1">
                        <StockStatus stock={product.stock} compact />
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-md border border-border-strong bg-white text-sm font-semibold text-primary-900"
                    >
                      <Edit3 size={15} aria-hidden="true" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => setProductIdToDelete(product._id)}
                      className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 text-sm font-semibold text-red-600"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyProducts hasSearch={Boolean(search)} />
        )}
      </section>

      {totalPages > 1 && (
        <div className="rounded-lg border border-border bg-white px-4 py-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(productIdToDelete)}
        title="Delete product"
        message="Delete this product? This action cannot be undone."
        confirmLabel={
          deleteProductMutation.isPending ? "Deleting…" : "Delete product"
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductIdToDelete(null)}
      />
    </div>
  );
}

function SummaryCard({ label, value, dotClassName }) {
  return (
    <article className="rounded-lg border border-border bg-white p-4 shadow-[0_1px_4px_rgba(15,24,32,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">
        {label}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-2xl font-extrabold text-primary-950">{value}</p>

        <span className={`h-2.5 w-2.5 rounded-full ${dotClassName}`} />
      </div>
    </article>
  );
}

function ProductImage({ product }) {
  const image = product.images?.[0]?.url;

  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-white">
      {image ? (
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-primary-50 text-primary-300">
          <Package size={18} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function ProductPrice({ product }) {
  const hasDiscount =
    product.discountPrice != null &&
    Number(product.discountPrice) < Number(product.price);

  return (
    <div>
      <p className="font-extrabold text-primary-950">
        ₹
        {Number(
          hasDiscount ? product.discountPrice : product.price,
        ).toLocaleString("en-IN")}
      </p>

      {hasDiscount && (
        <p className="mt-0.5 text-xs text-text-soft line-through">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>
      )}
    </div>
  );
}

function StockStatus({ stock, compact = false }) {
  const stockValue = Number(stock || 0);
  const isLowStock = stockValue <= 5;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${
        compact ? "text-xs" : "text-sm"
      } font-semibold ${isLowStock ? "text-amber-700" : "text-primary-800"}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isLowStock ? "bg-amber-500" : "bg-green-600"
        }`}
      />
      {stockValue.toLocaleString("en-IN")} units
    </span>
  );
}

function ActiveStatus({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-green-100 bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
      <Check size={13} aria-hidden="true" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-primary-50 px-2 py-1 text-xs font-bold text-text-muted">
      <X size={13} aria-hidden="true" />
      Inactive
    </span>
  );
}

function MobileStat({ label, value }) {
  return (
    <div>
      <dt className="font-semibold uppercase tracking-[0.08em] text-text-soft">
        {label}
      </dt>
      <dd className="mt-1 truncate font-bold text-primary-950">{value}</dd>
    </div>
  );
}

function EmptyProducts({ hasSearch }) {
  return (
    <div className="px-5 py-16 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-400">
        <Package size={25} aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-extrabold text-primary-950">
        {hasSearch ? "No matching products" : "No products found"}
      </h3>

      <p className="mt-1 text-sm text-text-muted">
        {hasSearch
          ? "Try a different name, SKU, or brand."
          : "Create the first product to begin building the catalog."}
      </p>
    </div>
  );
}

export default AdminProductsPage;
