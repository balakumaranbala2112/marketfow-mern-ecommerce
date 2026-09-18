import { useForm } from "react-hook-form";
import {
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  Percent,
  Plus,
  Tag,
  TicketPercent,
} from "lucide-react";

import {
  useAdminCoupons,
  useCreateCoupon,
} from "../../features/admin/hooks/useAdmin.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";

import useToastStore from "../../stores/toastStore.js";

function AdminCouponsPage() {
  const addToast = useToastStore((state) => state.addToast);

  const { data: coupons, isLoading, refetch } = useAdminCoupons();

  const createCouponMutation = useCreateCoupon();

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const discountType = watch("discountType");

  function onSubmit(data) {
    const payload = {
      code: data.code.trim().toUpperCase(),
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minOrderAmount: Number(data.minOrderAmount || 0),
      isActive: Boolean(data.isActive),
    };

    if (data.description?.trim()) {
      payload.description = data.description.trim();
    }

    if (data.maxDiscountAmount !== "" && data.maxDiscountAmount != null) {
      payload.maxDiscountAmount = Number(data.maxDiscountAmount);
    }

    if (data.usageLimit !== "" && data.usageLimit != null) {
      payload.usageLimit = Number(data.usageLimit);
    }

    if (data.startsAt) {
      payload.startsAt = new Date(data.startsAt).toISOString();
    }

    if (data.expiresAt) {
      payload.expiresAt = new Date(data.expiresAt).toISOString();
    }

    createCouponMutation.mutate(payload, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "Coupon created successfully",
        });

        reset();
        refetch();
      },
      onError: (error) => {
        const errorMsg = error.errors?.length
          ? error.errors.join(", ")
          : error.message || "Failed to create coupon";
        addToast({
          type: "error",
          message: errorMsg,
        });
      },
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
            Promotion management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
            Coupons
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Create discount codes and review campaign limits and availability.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-text-muted">
          <TicketPercent
            size={16}
            className="text-accent-700"
            aria-hidden="true"
          />
          <strong className="font-extrabold text-primary-950">
            {coupons?.length || 0}
          </strong>{" "}
          coupons
        </span>
      </header>

      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <section className="h-fit overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)] xl:sticky xl:top-24">
          <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-5 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-primary-950">
                Create coupon
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                Configure a promotional code and its limits.
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-950 text-accent-300">
              <Plus size={18} aria-hidden="true" />
            </span>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 p-5"
            noValidate
          >
            <Field
              id="coupon-code"
              label="Coupon code"
              error={errors.code?.message}
            >
              <div className="relative">
                <Tag
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
                  aria-hidden="true"
                />

                <input
                  id="coupon-code"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. SUMMER50"
                  className={`${getInputClasses(Boolean(errors.code))} pl-10 uppercase`}
                  {...register("code", {
                    required: "Coupon code is required",
                    minLength: {
                      value: 3,
                      message: "Use at least 3 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Use no more than 30 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9_-]+$/,
                      message: "Use letters, numbers, hyphens, or underscores",
                    },
                  })}
                />
              </div>
            </Field>

            <Field id="discount-type" label="Discount type">
              <select
                id="discount-type"
                className={getInputClasses(false)}
                {...register("discountType")}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed amount (₹)</option>
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field
                id="discount-value"
                label={discountType === "percentage" ? "Percentage" : "Amount"}
                error={errors.discountValue?.message}
              >
                <div className="relative">
                  <input
                    id="discount-value"
                    type="number"
                    min="0"
                    max={discountType === "percentage" ? "100" : undefined}
                    step={discountType === "percentage" ? "1" : "0.01"}
                    placeholder="0"
                    className={`${getInputClasses(
                      Boolean(errors.discountValue),
                    )} pr-8`}
                    {...register("discountValue", {
                      required: "Value is required",
                      min: {
                        value: 0.01,
                        message: "Value must be greater than zero",
                      },
                      ...(discountType === "percentage"
                        ? {
                            max: {
                              value: 100,
                              message: "Percentage cannot exceed 100",
                            },
                          }
                        : {}),
                    })}
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-600">
                    {discountType === "percentage" ? "%" : "₹"}
                  </span>
                </div>
              </Field>

              <Field id="minimum-order" label="Minimum order">
                <MoneyInput
                  id="minimum-order"
                  placeholder="0"
                  register={register("minOrderAmount", {
                    min: {
                      value: 0,
                      message: "Cannot be negative",
                    },
                  })}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field id="maximum-discount" label="Maximum discount" optional>
                <MoneyInput
                  id="maximum-discount"
                  placeholder="No limit"
                  register={register("maxDiscountAmount", {
                    min: {
                      value: 0,
                      message: "Cannot be negative",
                    },
                  })}
                />
              </Field>

              <Field id="usage-limit" label="Usage limit" optional>
                <input
                  id="usage-limit"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  className={getInputClasses(false)}
                  {...register("usageLimit", {
                    min: {
                      value: 1,
                      message: "Use at least 1",
                    },
                  })}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field id="starts-at" label="Starts" optional>
                <input
                  id="starts-at"
                  type="date"
                  className={getInputClasses(false)}
                  {...register("startsAt")}
                />
              </Field>

              <Field
                id="expires-at"
                label="Expires"
                optional
                error={errors.expiresAt?.message}
              >
                <input
                  id="expires-at"
                  type="date"
                  className={getInputClasses(Boolean(errors.expiresAt))}
                  {...register("expiresAt", {
                    validate: (value, formValues) => {
                      if (!value || !formValues.startsAt) {
                        return true;
                      }

                      return (
                        new Date(value) >= new Date(formValues.startsAt) ||
                        "Expiry must be after the start date"
                      );
                    },
                  })}
                />
              </Field>
            </div>

            <Field id="coupon-description" label="Description" optional>
              <textarea
                id="coupon-description"
                rows={3}
                placeholder="Internal description for this campaign"
                className="w-full resize-y rounded-md border border-border-strong bg-white px-3.5 py-3 text-sm leading-6 text-text outline-none placeholder:text-text-soft focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
                {...register("description", {
                  maxLength: {
                    value: 300,
                    message: "Description must not exceed 300 characters",
                  },
                })}
              />
            </Field>

            <label className="flex min-h-[44px] cursor-pointer items-center justify-between rounded-md border border-border bg-surface-subtle px-3.5">
              <div>
                <p className="text-sm font-semibold text-primary-950">
                  Active campaign
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  Allow this code to be used when valid.
                </p>
              </div>

              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border-strong accent-accent-500"
                {...register("isActive")}
              />
            </label>

            <button
              type="submit"
              disabled={createCouponMutation.isPending}
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createCouponMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Creating coupon
                </>
              ) : (
                <>
                  <Plus size={16} aria-hidden="true" />
                  Create coupon
                </>
              )}
            </button>
          </form>
        </section>

        <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
          <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-5 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-primary-950">
                Coupon campaigns
              </h2>

              <p className="mt-1 text-xs text-text-muted">
                Review usage, value, status, and expiry.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20">
              <PageLoader />
            </div>
          ) : coupons?.length ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-border bg-white">
                    <tr className="text-xs font-bold uppercase tracking-[0.08em] text-text-soft">
                      <th className="px-5 py-3.5">Code</th>
                      <th className="px-5 py-3.5">Discount</th>
                      <th className="px-5 py-3.5">Minimum</th>
                      <th className="px-5 py-3.5">Usage</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Expiry</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {coupons.map((coupon) => (
                      <tr
                        key={coupon._id}
                        className="transition hover:bg-primary-50/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-50 text-accent-700">
                              <Tag size={16} aria-hidden="true" />
                            </span>

                            <div>
                              <p className="font-extrabold text-primary-950">
                                {coupon.code}
                              </p>

                              {coupon.description && (
                                <p className="mt-0.5 max-w-[170px] truncate text-xs text-text-soft">
                                  {coupon.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-bold text-primary-950">
                          {formatDiscount(coupon)}
                        </td>

                        <td className="px-5 py-4 text-text-muted">
                          ₹
                          {Number(coupon.minOrderAmount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>

                        <td className="px-5 py-4 text-text-muted">
                          {coupon.usedCount || 0} / {coupon.usageLimit || "∞"}
                        </td>

                        <td className="px-5 py-4">
                          <Badge
                            variant={coupon.isActive ? "active" : "inactive"}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>

                        <td className="px-5 py-4 text-text-muted">
                          {formatExpiry(coupon.expiresAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-border md:hidden">
                {coupons.map((coupon) => (
                  <article key={coupon._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Tag
                            size={15}
                            className="text-accent-700"
                            aria-hidden="true"
                          />

                          <h3 className="truncate font-extrabold text-primary-950">
                            {coupon.code}
                          </h3>
                        </div>

                        <p className="mt-2 text-xl font-extrabold text-primary-950">
                          {formatDiscount(coupon)}
                        </p>
                      </div>

                      <Badge variant={coupon.isActive ? "active" : "inactive"}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-border bg-surface-subtle p-3 text-xs">
                      <MobileStat
                        label="Minimum"
                        value={`₹${Number(
                          coupon.minOrderAmount || 0,
                        ).toLocaleString("en-IN")}`}
                      />

                      <MobileStat
                        label="Usage"
                        value={`${coupon.usedCount || 0} / ${
                          coupon.usageLimit || "∞"
                        }`}
                      />

                      <MobileStat
                        label="Expiry"
                        value={formatExpiry(coupon.expiresAt)}
                      />

                      <MobileStat
                        label="Type"
                        value={
                          coupon.discountType === "percentage"
                            ? "Percentage"
                            : "Fixed"
                        }
                      />
                    </dl>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <EmptyCoupons />
          )}
        </section>
      </div>
    </div>
  );
}

function MoneyInput({ id, placeholder, register }) {
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
        className={`${getInputClasses(false)} pl-7`}
        {...register}
      />
    </div>
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

function MobileStat({ label, value }) {
  return (
    <div>
      <dt className="font-semibold uppercase tracking-[0.08em] text-text-soft">
        {label}
      </dt>

      <dd className="mt-1 font-bold text-primary-950">{value}</dd>
    </div>
  );
}

function EmptyCoupons() {
  return (
    <div className="px-5 py-16 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-400">
        <TicketPercent size={25} aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-extrabold text-primary-950">
        No coupons found
      </h3>

      <p className="mt-1 text-sm text-text-muted">
        Create the first promotion using the form.
      </p>
    </div>
  );
}

function formatDiscount(coupon) {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}%`;
  }

  return `₹${Number(coupon.discountValue || 0).toLocaleString("en-IN")}`;
}

function formatExpiry(dateValue) {
  if (!dateValue) {
    return "Never";
  }

  return new Date(dateValue).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInputClasses(hasError) {
  return `min-h-[44px] w-full rounded-md border bg-white px-3.5 text-sm text-text outline-none placeholder:text-text-soft ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
      : "border-border-strong focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
  }`;
}

export default AdminCouponsPage;
