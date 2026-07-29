import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  LoaderCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import {
  useApplyCoupon,
  useCart,
  useClearCart,
  useRemoveCartItem,
  useRemoveCoupon,
  useUpdateCartItem,
} from "../../features/cart/hooks/useCart.js";

import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING_FEE = 50;

function CartPage() {
  const addToast = useToastStore((state) => state.addToast);

  const { data: cart, isLoading } = useCart();

  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-[65vh] bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
          <PageLoader />
        </div>
      </main>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-white py-8 shadow-[0_2px_8px_rgba(15,24,32,0.06)]">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              message="Add products to your cart before proceeding to checkout."
              actionLabel="Browse products"
              actionTo={routePaths.products}
            />
          </div>
        </div>
      </main>
    );
  }

  const cartSubtotal = Number(cart?.cartTotal) || 0;
  const discountAmount = Number(cart?.discountPrice) || 0;
  const discountedSubtotal =
    Number(cart?.finalTotal) || Math.max(0, cartSubtotal - discountAmount);

  const shippingFee =
    cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

  const payableTotal = discountedSubtotal + shippingFee;

  const totalQuantity = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  const amountUntilFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cartSubtotal,
  );

  function handleQuantity(cartItemId, quantity) {
    if (quantity < 1) {
      return;
    }

    updateMutation.mutate(
      {
        cartItemId,
        quantity,
      },
      {
        onError: (error) => {
          addToast({
            type: "error",
            message: error.message,
          });
        },
      },
    );
  }

  function handleRemove(cartItemId) {
    removeMutation.mutate(cartItemId, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "Item removed from cart",
        });
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message,
        });
      },
    });
  }

  function handleClearCart() {
    clearMutation.mutate(undefined, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "Cart cleared",
        });

        setConfirmClear(false);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message,
        });
      },
    });
  }

  function handleApplyCoupon(event) {
    event.preventDefault();

    const normalizedCouponCode = couponCode.trim();

    if (!normalizedCouponCode) {
      return;
    }

    applyCouponMutation.mutate(
      {
        code: normalizedCouponCode,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Coupon applied",
          });

          setCouponCode("");
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error.message,
          });
        },
      },
    );
  }

  function handleRemoveCoupon() {
    removeCouponMutation.mutate(undefined, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "Coupon removed",
        });
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message,
        });
      },
    });
  }

  return (
    <main className="min-h-screen bg-surface-muted">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
                Shopping cart
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-primary-950 sm:text-4xl">
                Review your cart
              </h1>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"} ready
                for checkout.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="shrink-0 rounded-md px-2 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 hover:text-red-700 sm:text-sm"
            >
              Clear cart
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          <div className="min-w-0 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantity}
                onRemove={handleRemove}
                isUpdating={updateMutation.isPending}
                isRemoving={removeMutation.isPending}
              />
            ))}

            <Link
              to={routePaths.products}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-border-strong bg-white px-4 text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
            >
              Continue shopping
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-lg border border-border bg-white p-5 shadow-[0_2px_8px_rgba(15,24,32,0.08)] sm:p-6">
              <h2 className="text-xl font-extrabold tracking-[-0.02em] text-primary-950">
                Order summary
              </h2>

              {amountUntilFreeShipping > 0 ? (
                <div className="mt-5 rounded-md border border-border bg-surface-subtle px-3.5 py-3">
                  <div className="flex items-start gap-2.5">
                    <Truck
                      size={17}
                      className="mt-0.5 shrink-0 text-primary-700"
                      aria-hidden="true"
                    />

                    <p className="text-xs leading-5 text-text-muted">
                      Add{" "}
                      <strong className="font-extrabold text-primary-950">
                        ₹{amountUntilFreeShipping.toLocaleString("en-IN")}
                      </strong>{" "}
                      more to reach the current free-shipping threshold.
                    </p>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-100">
                    <div
                      className="h-full rounded-full bg-accent-500 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex items-start gap-2.5 rounded-md border border-green-100 bg-green-50 px-3.5 py-3">
                  <Truck
                    size={17}
                    className="mt-0.5 shrink-0 text-green-700"
                    aria-hidden="true"
                  />

                  <p className="text-xs font-semibold leading-5 text-green-700">
                    This cart qualifies for the current free-shipping rule.
                  </p>
                </div>
              )}

              <dl className="mt-5 space-y-3 text-sm">
                <SummaryRow
                  label={`Subtotal (${totalQuantity} ${
                    totalQuantity === 1 ? "item" : "items"
                  })`}
                  value={`₹${cartSubtotal.toLocaleString("en-IN")}`}
                />

                {discountAmount > 0 && (
                  <SummaryRow
                    label="Discount"
                    value={`−₹${discountAmount.toLocaleString("en-IN")}`}
                    valueClassName="text-green-700"
                  />
                )}

                <SummaryRow
                  label="Shipping"
                  value={
                    shippingFee === 0
                      ? "Free"
                      : `₹${shippingFee.toLocaleString("en-IN")}`
                  }
                  valueClassName={
                    shippingFee === 0 ? "text-green-700" : undefined
                  }
                />
              </dl>

              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-base font-extrabold text-primary-950">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold tracking-[-0.03em] text-primary-950">
                    ₹{payableTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="mt-1 text-right text-[11px] text-text-soft">
                  Taxes and final delivery details are confirmed at checkout.
                </p>
              </div>

              {cart.coupon ? (
                <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-accent-300 bg-accent-50 px-3.5 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Tag
                      size={16}
                      className="shrink-0 text-accent-700"
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent-800">
                        Coupon applied
                      </p>

                      <p className="truncate text-sm font-extrabold text-primary-950">
                        {cart.coupon.code}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    disabled={removeCouponMutation.isPending}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-primary-600 transition hover:bg-white hover:text-red-600 disabled:opacity-50"
                    aria-label={`Remove coupon ${cart.coupon.code}`}
                  >
                    {removeCouponMutation.isPending ? (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <X size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="mt-5">
                  <label
                    htmlFor="cart-coupon-code"
                    className="text-sm font-bold text-primary-950"
                  >
                    Coupon code
                  </label>

                  <div className="mt-2 flex gap-2">
                    <input
                      id="cart-coupon-code"
                      type="text"
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="Enter code"
                      autoComplete="off"
                      className="min-h-[44px] min-w-0 flex-1 rounded-md border border-border-strong bg-white px-3 text-sm uppercase text-text outline-none placeholder:normal-case placeholder:text-text-soft focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
                    />

                    <button
                      type="submit"
                      disabled={
                        applyCouponMutation.isPending || !couponCode.trim()
                      }
                      className="inline-flex min-h-[44px] min-w-[76px] items-center justify-center rounded-md border border-primary-950 bg-primary-950 px-4 text-sm font-bold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {applyCouponMutation.isPending ? (
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                </form>
              )}

              <Link
                to={routePaths.checkout}
                className="mt-5 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-extrabold text-primary-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:bg-accent-300"
              >
                Proceed to checkout
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <div className="mt-5 flex items-start gap-2.5 rounded-md border border-border bg-surface-subtle px-3.5 py-3">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-green-700"
                  aria-hidden="true"
                />

                <p className="text-xs leading-5 text-text-muted">
                  Review the final amount, delivery address, and payment method
                  before placing your order.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <ConfirmDialog
        open={confirmClear}
        title="Clear cart"
        message="Remove every item from your cart? This action cannot be undone."
        confirmLabel={clearMutation.isPending ? "Clearing…" : "Clear all"}
        onConfirm={handleClearCart}
        onCancel={() => setConfirmClear(false)}
      />
    </main>
  );
}

function CartItem({
  item,
  onQuantityChange,
  onRemove,
  isUpdating,
  isRemoving,
}) {
  const product =
    typeof item.product === "object" && item.product !== null
      ? item.product
      : null;

  const productId = product?._id || item.product;
  const productStock = Number(product?.stock);

  const canIncrease =
    !Number.isFinite(productStock) || item.quantity < productStock;

  return (
    <article className="rounded-lg border border-border bg-white p-4 shadow-[0_1px_4px_rgba(15,24,32,0.06)] sm:p-5">
      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 sm:grid-cols-[112px_minmax(0,1fr)_auto]">
        <Link
          to={`/products/${productId}`}
          className="h-22 w-22 overflow-hidden rounded-md border border-border bg-white sm:h-28 sm:w-28"
          aria-label={`View ${item.name}`}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary-50 text-primary-300">
              <ShoppingBag size={28} strokeWidth={1.4} aria-hidden="true" />
            </div>
          )}
        </Link>

        <div className="min-w-0">
          <Link
            to={`/products/${productId}`}
            className="line-clamp-2 text-sm font-extrabold leading-6 text-primary-950 transition hover:text-blue-700 hover:underline sm:text-base"
          >
            {item.name}
          </Link>

          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            ₹{Number(item.price || 0).toLocaleString("en-IN")} each
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex min-h-[40px] items-center rounded-md border border-border-strong bg-white">
              <button
                type="button"
                onClick={() =>
                  onQuantityChange(item._id, Math.max(1, item.quantity - 1))
                }
                disabled={isUpdating || item.quantity <= 1}
                className="flex h-9 w-9 items-center justify-center text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus size={15} aria-hidden="true" />
              </button>

              <span
                className="min-w-10 border-x border-border px-2 text-center text-xs font-extrabold text-primary-950"
                aria-live="polite"
              >
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onQuantityChange(item._id, item.quantity + 1)}
                disabled={isUpdating || !canIncrease}
                className="flex h-9 w-9 items-center justify-center text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus size={15} aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item._id)}
              disabled={isRemoving}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRemoving ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Trash2 size={14} aria-hidden="true" />
              )}
              Remove
            </button>
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-between border-t border-border pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
          <span className="text-xs font-medium text-text-soft sm:hidden">
            Item total
          </span>

          <p className="text-base font-extrabold text-primary-950">
            ₹{Number(item.subtotal || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </article>
  );
}

function SummaryRow({ label, value, valueClassName = "text-primary-950" }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>

      <dd className={`shrink-0 font-semibold ${valueClassName}`}>{value}</dd>
    </div>
  );
}

export default CartPage;
