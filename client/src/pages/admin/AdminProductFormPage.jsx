import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Image,
  LoaderCircle,
  Package,
  Plus,
  Save,
  Settings2,
  Tag,
  Trash2,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  useAdminCategories,
  useCreateProduct,
  useUpdateProduct,
} from "../../features/admin/hooks/useAdmin.js";

import { useProduct } from "../../features/products/hooks/useProducts.js";

import useToastStore from "../../stores/toastStore.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import routePaths from "../../routes/routePaths.js";

const DEFAULT_IMAGE = {
  url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  publicId: "placeholder",
  alt: "",
};

function AdminProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const addToast = useToastStore((state) => state.addToast);
  const isEdit = Boolean(productId);

  const { data: categories, isLoading: isCategoriesLoading } =
    useAdminCategories();

  const { data: existingProduct, isLoading: isProductLoading } =
    useProduct(productId);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
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
      images: [DEFAULT_IMAGE],
      specifications: [],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const regularPrice = watch("price");
  const isSubmitting =
    createProductMutation.isPending || updateProductMutation.isPending;

  useEffect(() => {
    if (!isEdit || !existingProduct) {
      return;
    }

    reset({
      name: existingProduct.name || "",
      description: existingProduct.description || "",
      shortDescription: existingProduct.shortDescription || "",
      price: existingProduct.price ?? "",
      discountPrice: existingProduct.discountPrice ?? "",
      category: existingProduct.category?._id || "",
      brand: existingProduct.brand || "",
      stock: existingProduct.stock ?? "",
      sku: existingProduct.sku || "",
      isActive: existingProduct.isActive ?? true,
      isFeatured: existingProduct.isFeatured ?? false,
      images: existingProduct.images?.length
        ? existingProduct.images
        : [
            {
              url: "",
              publicId: "manually-added",
              alt: "",
            },
          ],
      specifications: existingProduct.specifications || [],
    });
  }, [isEdit, existingProduct, reset]);

  if (isProductLoading || isCategoriesLoading) {
    return (
      <div className="py-20">
        <PageLoader />
      </div>
    );
  }

  function onSubmit(data) {
    const formattedData = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),
      shortDescription: data.shortDescription?.trim() || "",
      brand: data.brand?.trim() || "",
      sku: data.sku.trim(),
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
      stock: Number(data.stock),
      images: data.images.map((image, index) => ({
        ...image,
        url: image.url.trim(),
        alt: image.alt?.trim() || `${data.name.trim()} image ${index + 1}`,
        publicId: image.publicId || "manually-added",
      })),
      specifications: data.specifications
        .filter(
          (specification) =>
            specification.key?.trim() || specification.value?.trim(),
        )
        .map((specification) => ({
          key: specification.key.trim(),
          value: specification.value.trim(),
        })),
    };

    if (isEdit) {
      updateProductMutation.mutate(
        {
          productId,
          data: formattedData,
        },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              message: "Product updated successfully",
            });

            navigate(routePaths.adminProducts);
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: error.message || "Product update failed",
            });
          },
        },
      );

      return;
    }

    createProductMutation.mutate(formattedData, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "Product created successfully",
        });

        navigate(routePaths.adminProducts);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message || "Product creation failed",
        });
      },
    });
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <Link
        to={routePaths.adminProducts}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 transition hover:text-blue-800 hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to products
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
            Catalog management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
            {isEdit ? "Edit product" : "Create product"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            {isEdit
              ? "Update product information, pricing, images, and visibility."
              : "Add a new product to the MarketFlow catalog."}
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-primary-800">
          <Package size={16} className="text-accent-700" aria-hidden="true" />
          {isEdit ? "Editing existing product" : "New catalog item"}
        </span>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormSection
          title="Product details"
          description="Core information shown throughout the catalog."
          icon={Package}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="product-name"
              label="Product name"
              error={errors.name?.message}
            >
              <input
                id="product-name"
                type="text"
                placeholder="Enter product name"
                className={getInputClasses(Boolean(errors.name))}
                {...register("name", {
                  required: "Product name is required",
                  minLength: {
                    value: 2,
                    message: "Use at least 2 characters",
                  },
                  maxLength: {
                    value: 120,
                    message: "Use no more than 120 characters",
                  },
                })}
              />
            </Field>

            <Field id="product-sku" label="SKU" error={errors.sku?.message}>
              <input
                id="product-sku"
                type="text"
                placeholder="e.g. MF-WATCH-001"
                className={`${getInputClasses(Boolean(errors.sku))} uppercase`}
                {...register("sku", {
                  required: "SKU is required",
                  minLength: {
                    value: 2,
                    message: "Use at least 2 characters",
                  },
                })}
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field
              id="product-category"
              label="Category"
              error={errors.category?.message}
            >
              <select
                id="product-category"
                className={getInputClasses(Boolean(errors.category))}
                {...register("category", {
                  required: "Category is required",
                })}
              >
                <option value="">Select category</option>

                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="product-brand" label="Brand" optional>
              <input
                id="product-brand"
                type="text"
                placeholder="Enter brand"
                className={getInputClasses(false)}
                {...register("brand", {
                  maxLength: {
                    value: 80,
                    message: "Use no more than 80 characters",
                  },
                })}
              />
            </Field>

            <Field
              id="product-stock"
              label="Stock quantity"
              error={errors.stock?.message}
            >
              <input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                className={getInputClasses(Boolean(errors.stock))}
                {...register("stock", {
                  required: "Stock quantity is required",
                  min: {
                    value: 0,
                    message: "Stock cannot be negative",
                  },
                  valueAsNumber: true,
                })}
              />
            </Field>
          </div>

          <Field
            id="product-short-description"
            label="Short description"
            optional
            error={errors.shortDescription?.message}
          >
            <textarea
              id="product-short-description"
              rows={3}
              placeholder="A concise summary for product cards and the product page"
              className={getTextareaClasses(Boolean(errors.shortDescription))}
              {...register("shortDescription", {
                maxLength: {
                  value: 240,
                  message: "Use no more than 240 characters",
                },
              })}
            />
          </Field>

          <Field
            id="product-description"
            label="Full description"
            error={errors.description?.message}
          >
            <textarea
              id="product-description"
              rows={6}
              placeholder="Describe the product, its purpose, materials, and important details"
              className={getTextareaClasses(Boolean(errors.description))}
              {...register("description", {
                required: "Product description is required",
                minLength: {
                  value: 10,
                  message: "Use at least 10 characters",
                },
              })}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Pricing"
          description="Set the regular selling price and an optional discounted price."
          icon={Tag}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="product-price"
              label="Regular price"
              error={errors.price?.message}
            >
              <MoneyInput
                id="product-price"
                placeholder="0"
                error={Boolean(errors.price)}
                register={register("price", {
                  required: "Regular price is required",
                  min: {
                    value: 0.01,
                    message: "Price must be greater than zero",
                  },
                  valueAsNumber: true,
                })}
              />
            </Field>

            <Field
              id="product-discount-price"
              label="Discount price"
              optional
              error={errors.discountPrice?.message}
            >
              <MoneyInput
                id="product-discount-price"
                placeholder="No discount"
                error={Boolean(errors.discountPrice)}
                register={register("discountPrice", {
                  min: {
                    value: 0,
                    message: "Discount price cannot be negative",
                  },
                  validate: (value) => {
                    if (value === "" || value == null || Number.isNaN(value)) {
                      return true;
                    }

                    return (
                      Number(value) < Number(regularPrice) ||
                      "Discount price must be lower than the regular price"
                    );
                  },
                  setValueAs: (value) => (value === "" ? "" : Number(value)),
                })}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          title="Product images"
          description="Add one or more image URLs. The first image is used as the primary image."
          icon={Image}
          action={
            <button
              type="button"
              onClick={() =>
                appendImage({
                  url: "",
                  publicId: "manually-added",
                  alt: "",
                })
              }
              className="inline-flex min-h-[38px] items-center gap-2 rounded-md border border-border-strong bg-white px-3 text-xs font-bold text-primary-900 transition hover:bg-primary-50"
            >
              <Plus size={15} aria-hidden="true" />
              Add image
            </button>
          }
        >
          <div className="space-y-4">
            {imageFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-md border border-border bg-surface-subtle p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold text-primary-950">
                    Image {index + 1}
                    {index === 0 && (
                      <span className="ml-2 rounded bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-accent-800">
                        Primary
                      </span>
                    )}
                  </p>

                  {imageFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
                  <Field
                    id={`product-image-${index}`}
                    label="Image URL"
                    error={errors.images?.[index]?.url?.message}
                  >
                    <input
                      id={`product-image-${index}`}
                      type="url"
                      placeholder="https://example.com/product.jpg"
                      className={getInputClasses(
                        Boolean(errors.images?.[index]?.url),
                      )}
                      {...register(`images.${index}.url`, {
                        required: "Image URL is required",
                        pattern: {
                          value: /^https?:\/\/.+/i,
                          message: "Enter a valid image URL",
                        },
                      })}
                    />
                  </Field>

                  <Field
                    id={`product-image-alt-${index}`}
                    label="Alt text"
                    optional
                  >
                    <input
                      id={`product-image-alt-${index}`}
                      type="text"
                      placeholder="Product image"
                      className={getInputClasses(false)}
                      {...register(`images.${index}.alt`)}
                    />
                  </Field>
                </div>

                <input
                  type="hidden"
                  {...register(`images.${index}.publicId`)}
                />
              </div>
            ))}
          </div>
        </FormSection>

        <FormSection
          title="Specifications"
          description="Add structured key-value details such as material, size, or warranty."
          icon={Settings2}
          action={
            <button
              type="button"
              onClick={() =>
                appendSpecification({
                  key: "",
                  value: "",
                })
              }
              className="inline-flex min-h-[38px] items-center gap-2 rounded-md border border-border-strong bg-white px-3 text-xs font-bold text-primary-900 transition hover:bg-primary-50"
            >
              <Plus size={15} aria-hidden="true" />
              Add specification
            </button>
          }
        >
          {specificationFields.length > 0 ? (
            <div className="space-y-3">
              {specificationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-md border border-border bg-surface-subtle p-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_42px]"
                >
                  <Field
                    id={`specification-key-${index}`}
                    label="Specification"
                    error={errors.specifications?.[index]?.key?.message}
                  >
                    <input
                      id={`specification-key-${index}`}
                      type="text"
                      placeholder="e.g. Material"
                      className={getInputClasses(
                        Boolean(errors.specifications?.[index]?.key),
                      )}
                      {...register(`specifications.${index}.key`, {
                        required: "Specification name is required",
                      })}
                    />
                  </Field>

                  <Field
                    id={`specification-value-${index}`}
                    label="Value"
                    error={errors.specifications?.[index]?.value?.message}
                  >
                    <input
                      id={`specification-value-${index}`}
                      type="text"
                      placeholder="e.g. Stainless steel"
                      className={getInputClasses(
                        Boolean(errors.specifications?.[index]?.value),
                      )}
                      {...register(`specifications.${index}.value`, {
                        required: "Specification value is required",
                      })}
                    />
                  </Field>

                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="mt-auto flex h-10 w-full items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 md:w-10"
                    aria-label={`Remove specification ${index + 1}`}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border-strong px-4 py-8 text-center">
              <Settings2
                size={24}
                className="mx-auto text-primary-300"
                aria-hidden="true"
              />

              <p className="mt-3 text-sm font-extrabold text-primary-950">
                No specifications added
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Add specifications when the product needs structured details.
              </p>
            </div>
          )}
        </FormSection>

        <FormSection
          title="Status and visibility"
          description="Control whether the product is visible and promoted."
          icon={CheckCircle2}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ToggleField
              title="Active product"
              description="Show this product in the customer catalog."
              register={register("isActive")}
            />

            <ToggleField
              title="Featured product"
              description="Include this product in featured sections."
              register={register("isFeatured")}
            />
          </div>
        </FormSection>

        <div className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-white/95 px-4 py-4 backdrop-blur-sm sm:mx-0 sm:rounded-lg sm:border sm:shadow-[0_6px_20px_rgba(15,24,32,0.08)]">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to={routePaths.adminProducts}
              className="inline-flex min-h-[46px] items-center justify-center rounded-md border border-border-strong bg-white px-5 text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-6 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  {isEdit ? "Updating product" : "Creating product"}
                </>
              ) : (
                <>
                  <Save size={17} aria-hidden="true" />
                  {isEdit ? "Update product" : "Create product"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, description, icon: Icon, action, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
      <div className="flex flex-col gap-4 border-b border-border bg-surface-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-950 text-accent-300">
            <Icon size={18} aria-hidden="true" />
          </span>

          <div>
            <h2 className="text-lg font-extrabold text-primary-950">{title}</h2>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              {description}
            </p>
          </div>
        </div>

        {action}
      </div>

      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({ id, label, error, optional = false, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-primary-950">
          {label}
        </label>

        {optional && <span className="text-xs text-text-soft">Optional</span>}
      </div>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function MoneyInput({ id, placeholder, register, error }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-600">
        ₹
      </span>

      <input
        id={id}
        type="number"
        min="0"
        step="0.01"
        placeholder={placeholder}
        className={`${getInputClasses(error)} pl-7`}
        {...register}
      />
    </div>
  );
}

function ToggleField({ title, description, register }) {
  return (
    <label className="flex min-h-[72px] cursor-pointer items-center justify-between gap-4 rounded-md border border-border bg-surface-subtle px-4 py-3">
      <div>
        <p className="text-sm font-extrabold text-primary-950">{title}</p>

        <p className="mt-1 text-xs leading-5 text-text-muted">{description}</p>
      </div>

      <input
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded border-border-strong accent-accent-500"
        {...register}
      />
    </label>
  );
}

function getInputClasses(hasError) {
  return `min-h-[44px] w-full rounded-md border bg-white px-3.5 text-sm text-text outline-none placeholder:text-text-soft ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
      : "border-border-strong focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
  }`;
}

function getTextareaClasses(hasError) {
  return `w-full resize-y rounded-md border bg-white px-3.5 py-3 text-sm leading-6 text-text outline-none placeholder:text-text-soft ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
      : "border-border-strong focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
  }`;
}

export default AdminProductFormPage;
