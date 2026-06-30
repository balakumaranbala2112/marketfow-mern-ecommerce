import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import {
  useCreateProduct,
  useUpdateProduct,
  useAdminCategories,
} from "../../features/admin/hooks/useAdmin.js";
import { useProduct } from "../../features/products/hooks/useProducts.js";
import FormInput from "../../components/common/FormInput.jsx";
import FormTextarea from "../../components/common/FormTextarea.jsx";
import useToastStore from "../../stores/toastStore.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import routePaths from "../../routes/routePaths.js";

function AdminProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const isEdit = !!productId;

  const { data: categories, isLoading: isCatsLoading } = useAdminCategories();
  const { data: existingProduct, isLoading: isProductLoading } = useProduct(productId);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      price: "",
      discountPrice: "",
      category: "",
      brand: "",
      stock: "",
      sku: "",
      isActive: true,
      isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", publicId: "placeholder", alt: "" }],
      specifications: [],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "specifications",
  });

  useEffect(() => {
    if (isEdit && existingProduct) {
      reset({
        name: existingProduct.name || "",
        description: existingProduct.description || "",
        shortDescription: existingProduct.shortDescription || "",
        price: existingProduct.price || "",
        discountPrice: existingProduct.discountPrice || "",
        category: existingProduct.category?._id || "",
        brand: existingProduct.brand || "",
        stock: existingProduct.stock || "",
        sku: existingProduct.sku || "",
        isActive: existingProduct.isActive ?? true,
        isFeatured: existingProduct.isFeatured ?? false,
        images: existingProduct.images?.length ? existingProduct.images : [{ url: "", publicId: "manually-added", alt: "" }],
        specifications: existingProduct.specifications || [],
      });
    }
  }, [isEdit, existingProduct, reset]);

  if (isProductLoading || isCatsLoading) return <PageLoader />;

  const onSubmit = (data) => {
    // Basic sanitization
    const formattedData = {
      ...data,
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
      stock: Number(data.stock),
    };

    if (isEdit) {
      updateProductMutation.mutate(
        { productId, data: formattedData },
        {
          onSuccess: () => {
            addToast({ type: "success", message: "Product updated successfully" });
            navigate("/admin/products");
          },
          onError: (err) => {
            addToast({ type: "error", message: err.message || "Update failed" });
          },
        }
      );
    } else {
      createProductMutation.mutate(formattedData, {
        onSuccess: () => {
          addToast({ type: "success", message: "Product created successfully" });
          navigate("/admin/products");
        },
        onError: (err) => {
          addToast({ type: "error", message: err.message || "Creation failed" });
        },
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/products" className="text-slate-400 hover:text-white">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? "Edit Product" : "Create Product"}
          </h1>
          <p className="text-sm text-slate-400">
            {isEdit ? "Update existing product specifications" : "Add a new product to your catalog"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core details */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm space-y-4">
          <h2 className="text-lg font-semibold text-white">Product Details</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Product Name"
              id="name"
              register={register("name", { required: "Name is required" })}
              error={errors.name?.message}
            />
            <FormInput
              label="SKU"
              id="sku"
              register={register("sku", { required: "SKU is required" })}
              error={errors.sku?.message}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-sm font-medium text-slate-300">
                Category
              </label>
              <select
                id="category"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <FormInput
              label="Brand"
              id="brand"
              register={register("brand")}
            />

            <FormInput
              label="Stock"
              id="stock"
              type="number"
              register={register("stock", { required: "Stock is required" })}
              error={errors.stock?.message}
            />
          </div>

          <FormTextarea
            label="Short Description"
            id="shortDescription"
            rows={2}
            register={register("shortDescription")}
          />

          <FormTextarea
            label="Description"
            id="description"
            rows={5}
            register={register("description", { required: "Description is required" })}
            error={errors.description?.message}
          />
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm space-y-4">
          <h2 className="text-lg font-semibold text-white">Pricing</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Regular Price (₹)"
              id="price"
              type="number"
              register={register("price", { required: "Price is required" })}
              error={errors.price?.message}
            />
            <FormInput
              label="Discount Price (₹, optional)"
              id="discountPrice"
              type="number"
              register={register("discountPrice")}
            />
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Product Images</h2>
            <button
              type="button"
              onClick={() => appendImage({ url: "", publicId: "manually-added", alt: "" })}
              className="flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <Plus size={16} /> Add Image URL
            </button>
          </div>

          <div className="space-y-3">
            {imageFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <FormInput
                    label={`Image URL ${idx + 1}`}
                    id={`image-url-${idx}`}
                    register={register(`images.${idx}.url`, { required: "Image URL is required" })}
                    error={errors.images?.[idx]?.url?.message}
                  />
                </div>
                {imageFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="rounded-xl bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20 mb-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Specifications</h2>
            <button
              type="button"
              onClick={() => appendSpec({ key: "", value: "" })}
              className="flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <Plus size={16} /> Add Specification
            </button>
          </div>

          <div className="space-y-3">
            {specFields.map((field, idx) => (
              <div key={field.id} className="flex gap-4 items-end">
                <div className="flex-1">
                  <FormInput
                    label="Key (e.g. Material)"
                    id={`spec-key-${idx}`}
                    register={register(`specifications.${idx}.key`, { required: "Key is required" })}
                    error={errors.specifications?.[idx]?.key?.message}
                  />
                </div>
                <div className="flex-1">
                  <FormInput
                    label="Value (e.g. Leather)"
                    id={`spec-value-${idx}`}
                    register={register(`specifications.${idx}.value`, { required: "Value is required" })}
                    error={errors.specifications?.[idx]?.value?.message}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSpec(idx)}
                  className="rounded-xl bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20 mb-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status flags */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white">Status & Visibility</h2>
          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                {...register("isActive")}
              />
              Active (Visible in Store)
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                {...register("isFeatured")}
              />
              Featured (Show on Homepage)
            </label>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createProductMutation.isPending || updateProductMutation.isPending}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductFormPage;
