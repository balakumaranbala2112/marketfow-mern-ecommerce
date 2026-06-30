import { useState } from "react";
import { Plus, Edit, Trash2, Tag, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../features/admin/hooks/useAdmin.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import FormInput from "../../components/common/FormInput.jsx";
import FormTextarea from "../../components/common/FormTextarea.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import useToastStore from "../../stores/toastStore.js";

function AdminCategoriesPage() {
  const addToast = useToastStore((s) => s.addToast);
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
    defaultValues: { name: "", description: "", image: { url: "" } },
  });

  const onSubmit = (data) => {
    // Inject a default/placeholder image object if none is provided
    const payload = {
      name: data.name,
      description: data.description,
      image: {
        url: data.imageUrl || "https://images.unsplash.com/photo-1472851294608-062f824d296e",
        alt: data.name,
      },
    };

    if (editingCategory) {
      updateCategoryMutation.mutate(
        { categoryId: editingCategory._id, data: payload },
        {
          onSuccess: () => {
            addToast({ type: "success", message: "Category updated successfully" });
            setEditingCategory(null);
            reset();
            refetch();
          },
          onError: (err) => {
            addToast({ type: "error", message: err.message || "Failed to update category" });
          },
        }
      );
    } else {
      createCategoryMutation.mutate(payload, {
        onSuccess: () => {
          addToast({ type: "success", message: "Category created successfully" });
          reset();
          refetch();
        },
        onError: (err) => {
          addToast({ type: "error", message: err.message || "Failed to create category" });
        },
      });
    }
  };

  function startEdit(cat) {
    setEditingCategory(cat);
    setValue("name", cat.name);
    setValue("description", cat.description || "");
    setValue("imageUrl", cat.image?.url || "");
  }

  function cancelEdit() {
    setEditingCategory(null);
    reset();
  }

  function handleDeleteConfirm() {
    if (!categoryIdToDelete) return;
    deleteCategoryMutation.mutate(categoryIdToDelete, {
      onSuccess: () => {
        addToast({ type: "success", message: "Category deleted safely" });
        setCategoryIdToDelete(null);
        refetch();
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message || "Failed to delete category" });
      },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Categories Management</h1>
        <p className="text-sm text-slate-400">Organize your products with categories</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Category Form Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm h-fit">
          <h2 className="text-lg font-semibold text-white">
            {editingCategory ? "Edit Category" : "Create Category"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormInput
              label="Category Name"
              id="cat-name"
              register={register("name", { required: "Name is required" })}
              error={errors.name?.message}
            />

            <FormInput
              label="Image URL (optional)"
              id="cat-img"
              register={register("imageUrl")}
            />

            <FormTextarea
              label="Description"
              id="cat-desc"
              rows={3}
              register={register("description")}
            />

            <div className="flex gap-2">
              {editingCategory && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Image</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories?.map((cat) => (
                    <tr key={cat._id} className="hover:bg-white/5">
                      <td className="py-3.5 px-4">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-800">
                          {cat.image?.url ? (
                            <img src={cat.image.url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-600">
                              <Tag size={16} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{cat.name}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400 max-w-[200px] truncate">
                        {cat.description || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setCategoryIdToDelete(cat._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories?.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-500">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!categoryIdToDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? If any products belong to this category, deletion might fail or prompt safety checks."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCategoryIdToDelete(null)}
      />
    </div>
  );
}

export default AdminCategoriesPage;
