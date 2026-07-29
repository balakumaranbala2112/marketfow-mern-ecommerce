import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit3, Image, LoaderCircle, Plus, Tag, Trash2, X } from "lucide-react";

import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../features/admin/hooks/useAdmin.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

import useToastStore from "../../stores/toastStore.js";

const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1472851294608-062f824d296e";

function AdminCategoriesPage() {
  const addToast = useToastStore((state) => state.addToast);

  const { data: categories, isLoading, refetch } = useAdminCategories();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  function onSubmit(data) {
    const trimmedName = data.name.trim();
    const trimmedDescription = data.description?.trim() || "";
    const trimmedImageUrl = data.imageUrl?.trim() || "";

    const payload = {
      name: trimmedName,
      description: trimmedDescription,
      image: {
        url: trimmedImageUrl || DEFAULT_CATEGORY_IMAGE,
        alt: trimmedName,
      },
    };

    if (editingCategory) {
      updateCategoryMutation.mutate(
        {
          categoryId: editingCategory._id,
          data: payload,
        },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              message: "Category updated successfully",
            });

            setEditingCategory(null);
            reset();
            refetch();
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: error.message || "Failed to update category",
            });
          },
        },
      );

      return;
    }

    createCategoryMutation.mutate(payload, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "Category created successfully",
        });

        reset();
        refetch();
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message || "Failed to create category",
        });
      },
    });
  }

  function startEdit(category) {
    setEditingCategory(category);

    setValue("name", category.name, {
      shouldValidate: true,
    });

    setValue("description", category.description || "");
    setValue("imageUrl", category.image?.url || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingCategory(null);
    reset();
  }

  function handleDeleteConfirm() {
    if (!categoryIdToDelete) {
      return;
    }

    deleteCategoryMutation.mutate(categoryIdToDelete, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "Category deleted successfully",
        });

        setCategoryIdToDelete(null);
        refetch();
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message || "Failed to delete category",
        });
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Categories"
        description="Create and organize the product catalog structure."
        count={categories?.length || 0}
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="h-fit overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)] xl:sticky xl:top-24">
          <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-5 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-primary-950">
                {editingCategory ? "Edit category" : "Create category"}
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                {editingCategory
                  ? "Update the selected category information."
                  : "Add a new category to the store catalog."}
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-950 text-accent-300">
              {editingCategory ? (
                <Edit3 size={18} aria-hidden="true" />
              ) : (
                <Plus size={18} aria-hidden="true" />
              )}
            </span>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 p-5"
            noValidate
          >
            <Field
              id="category-name"
              label="Category name"
              error={errors.name?.message}
            >
              <input
                id="category-name"
                type="text"
                placeholder="e.g. Electronics"
                autoComplete="off"
                className={getInputClasses(Boolean(errors.name))}
                {...register("name", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Use at least 2 characters",
                  },
                  maxLength: {
                    value: 80,
                    message: "Use no more than 80 characters",
                  },
                })}
              />
            </Field>

            <Field id="category-image" label="Image URL" optional>
              <div className="relative">
                <Image
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
                  aria-hidden="true"
                />

                <input
                  id="category-image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className={`${getInputClasses(false)} pl-10`}
                  {...register("imageUrl", {
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: "Enter a valid image URL",
                    },
                  })}
                />
              </div>
            </Field>

            <Field id="category-description" label="Description" optional>
              <textarea
                id="category-description"
                rows={4}
                placeholder="Describe which products belong here"
                className="w-full resize-y rounded-md border border-border-strong bg-white px-3.5 py-3 text-sm leading-6 text-text outline-none placeholder:text-text-soft focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
                {...register("description", {
                  maxLength: {
                    value: 300,
                    message: "Description must not exceed 300 characters",
                  },
                })}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              {editingCategory && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-4 text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
                >
                  <X size={16} aria-hidden="true" />
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-4 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                  editingCategory ? "" : "col-span-2"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    {editingCategory ? "Updating" : "Creating"}
                  </>
                ) : (
                  <>
                    {editingCategory ? (
                      <Edit3 size={16} aria-hidden="true" />
                    ) : (
                      <Plus size={16} aria-hidden="true" />
                    )}
                    {editingCategory ? "Update category" : "Create category"}
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
          <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-5 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-primary-950">
                Category list
              </h2>

              <p className="mt-1 text-xs text-text-muted">
                Review and maintain all catalog categories.
              </p>
            </div>

            <span className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-bold text-primary-700">
              {categories?.length || 0} total
            </span>
          </div>

          {isLoading ? (
            <div className="py-20">
              <PageLoader />
            </div>
          ) : categories?.length ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-border bg-white">
                    <tr className="text-xs font-bold uppercase tracking-[0.08em] text-text-soft">
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Description</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {categories.map((category) => (
                      <tr
                        key={category._id}
                        className="transition hover:bg-primary-50/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <CategoryImage category={category} />

                            <div className="min-w-0">
                              <p className="truncate font-extrabold text-primary-950">
                                {category.name}
                              </p>

                              <p className="mt-0.5 text-xs text-text-soft">
                                ID: {category._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-sm px-5 py-4">
                          <p className="line-clamp-2 text-sm leading-6 text-text-muted">
                            {category.description || "No description provided."}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <ActionButton
                              label={`Edit ${category.name}`}
                              icon={Edit3}
                              onClick={() => startEdit(category)}
                            />

                            <ActionButton
                              label={`Delete ${category.name}`}
                              icon={Trash2}
                              danger
                              onClick={() =>
                                setCategoryIdToDelete(category._id)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-border md:hidden">
                {categories.map((category) => (
                  <article key={category._id} className="p-4">
                    <div className="flex items-start gap-3">
                      <CategoryImage category={category} />

                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-primary-950">
                          {category.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-muted">
                          {category.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-md border border-border-strong bg-white text-sm font-semibold text-primary-900"
                      >
                        <Edit3 size={15} aria-hidden="true" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategoryIdToDelete(category._id)}
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
            <EmptyCategories />
          )}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(categoryIdToDelete)}
        title="Delete category"
        message="Delete this category? Products assigned to it may prevent deletion or require reassignment."
        confirmLabel={
          deleteCategoryMutation.isPending ? "Deleting…" : "Delete category"
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCategoryIdToDelete(null)}
      />
    </div>
  );
}

function PageHeading({ title, description, count }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
          Catalog management
        </p>

        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      </div>

      <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-text-muted">
        <Tag size={16} className="text-accent-700" aria-hidden="true" />
        <strong className="font-extrabold text-primary-950">
          {count}
        </strong>{" "}
        categories
      </span>
    </header>
  );
}

function CategoryImage({ category }) {
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-primary-50">
      {category.image?.url ? (
        <img
          src={category.image.url}
          alt={category.image.alt || category.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-primary-400">
          <Tag size={18} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-md border transition ${
        danger
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-border-strong bg-white text-primary-700 hover:bg-primary-50 hover:text-primary-950"
      }`}
      aria-label={label}
      title={label}
    >
      <Icon size={15} aria-hidden="true" />
    </button>
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

function getInputClasses(hasError) {
  return `min-h-[44px] w-full rounded-md border bg-white px-3.5 text-sm text-text outline-none placeholder:text-text-soft ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
      : "border-border-strong focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
  }`;
}

function EmptyCategories() {
  return (
    <div className="px-5 py-16 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-400">
        <Tag size={25} aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-extrabold text-primary-950">
        No categories found
      </h3>

      <p className="mt-1 text-sm text-text-muted">
        Create the first category using the form.
      </p>
    </div>
  );
}

export default AdminCategoriesPage;
