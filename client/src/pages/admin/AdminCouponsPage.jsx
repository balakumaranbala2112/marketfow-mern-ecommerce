import { useState } from "react";
import { Plus, Tag, Trash2, Calendar, Percent, Landmark } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAdminCoupons, useCreateCoupon } from "../../features/admin/hooks/useAdmin.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import FormInput from "../../components/common/FormInput.jsx";
import FormTextarea from "../../components/common/FormTextarea.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import useToastStore from "../../stores/toastStore.js";
import Badge from "../../components/common/Badge.jsx";

function AdminCouponsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { data: coupons, isLoading, refetch } = useAdminCoupons();
  const createCouponMutation = useCreateCoupon();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: 0,
      maxDiscountAmount: "",
      usageLimit: "",
      startsAt: "",
      expiresAt: "",
      isActive: true,
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      discountValue: Number(data.discountValue),
      minOrderAmount: Number(data.minOrderAmount),
      maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    };

    createCouponMutation.mutate(payload, {
      onSuccess: () => {
        addToast({ type: "success", message: "Coupon created successfully" });
        reset();
        refetch();
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message || "Failed to create coupon" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Coupons Management</h1>
        <p className="text-sm text-slate-400">Create promotional codes and discount campaigns</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Create Coupon Form */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm h-fit space-y-4">
          <h2 className="text-lg font-semibold text-white">Create Coupon</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Coupon Code"
              id="cp-code"
              placeholder="e.g. SUMMER50"
              register={register("code", { required: "Code is required" })}
              error={errors.code?.message}
            />

            <div className="space-y-1.5">
              <label htmlFor="discountType" className="block text-sm font-medium text-slate-300">
                Discount Type
              </label>
              <select
                id="discountType"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                {...register("discountType")}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div className="grid gap-4 grid-cols-2">
              <FormInput
                label="Value"
                id="cp-val"
                type="number"
                register={register("discountValue", { required: "Required" })}
                error={errors.discountValue?.message}
              />
              <FormInput
                label="Min Order (₹)"
                id="cp-min"
                type="number"
                register={register("minOrderAmount")}
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <FormInput
                label="Max Discount (₹)"
                id="cp-max"
                type="number"
                register={register("maxDiscountAmount")}
              />
              <FormInput
                label="Usage Limit"
                id="cp-limit"
                type="number"
                register={register("usageLimit")}
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <FormInput
                label="Starts At"
                id="cp-start"
                type="date"
                register={register("startsAt")}
              />
              <FormInput
                label="Expires At"
                id="cp-expiry"
                type="date"
                register={register("expiresAt")}
              />
            </div>

            <FormTextarea
              label="Description"
              id="cp-desc"
              rows={2}
              register={register("description")}
            />

            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                {...register("isActive")}
              />
              Active Campaign
            </label>

            <button
              type="submit"
              disabled={createCouponMutation.isPending}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {createCouponMutation.isPending ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="md:col-span-2">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Code</th>
                    <th className="py-3.5 px-4">Discount</th>
                    <th className="py-3.5 px-4">Min Order</th>
                    <th className="py-3.5 px-4">Usage</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {coupons?.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-white/5">
                      <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                        <Tag size={14} className="text-emerald-400" />
                        {coupon.code}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-200">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        ₹{coupon.minOrderAmount || 0}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {coupon.usedCount} / {coupon.usageLimit || "∞"}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={coupon.isActive ? "active" : "inactive"}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                      </td>
                    </tr>
                  ))}
                  {coupons?.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">
                        No coupons found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCouponsPage;
