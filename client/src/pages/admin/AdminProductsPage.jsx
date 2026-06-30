import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus, Edit, Trash2, Search, Package, Check, X } from "lucide-react";
import { useAdminProducts, useDeleteProduct } from "../../features/admin/hooks/useAdmin.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";

function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const addToast = useToastStore((s) => s.addToast);

  const params = { page, limit: 10, search };
  const { data, isLoading, refetch } = useAdminProducts(params);
  const deleteProductMutation = useDeleteProduct();

  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [searchInput, setSearchInput] = useState(search);

  const products = data?.products || [];
  const totalPages = data?.meta?.pagination?.totalPages || 1;

  function handleSearch(e) {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      p.set("search", searchInput.trim());
    } else {
      p.delete("search");
    }
    p.set("page", "1");
    setSearchParams(p);
  }

  function handleDeleteConfirm() {
    if (!productIdToDelete) return;
    deleteProductMutation.mutate(productIdToDelete, {
      onSuccess: () => {
        addToast({ type: "success", message: "Product deleted successfully" });
        setProductIdToDelete(null);
        refetch();
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message || "Failed to delete product" });
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products Management</h1>
          <p className="text-sm text-slate-400">Add, edit, or remove catalog items</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by name, SKU, brand..."
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-10 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
          />
        </div>
        <button type="submit" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
          Search
        </button>
      </form>

      {/* Products Table */}
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-white/5">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-600"><Package size={16} /></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white line-clamp-1">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.category?.name}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">{product.sku}</td>
                  <td className="py-3.5 px-4">
                    <p className="text-white font-semibold">₹{product.price.toLocaleString("en-IN")}</p>
                    {product.discountPrice && (
                      <p className="text-xs text-slate-500 line-through">₹{product.discountPrice.toLocaleString("en-IN")}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs font-semibold ${product.stock <= 5 ? "text-amber-500" : "text-slate-300"}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {product.isActive ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-slate-600" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={() => setProductIdToDelete(product._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("page", String(p));
            setSearchParams(nextParams);
          }}
        />
      </div>

      <ConfirmDialog
        open={!!productIdToDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductIdToDelete(null)}
      />
    </div>
  );
}

export default AdminProductsPage;
