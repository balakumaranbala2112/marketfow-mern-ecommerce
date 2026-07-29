import { useState } from "react";
import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, Tag, X } from "lucide-react";

import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart, useApplyCoupon, useRemoveCoupon } from "../../features/cart/hooks/useCart.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

function CartPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { data: cart, isLoading } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  if (isLoading) return <PageLoader />;

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        message="Looks like you haven't added anything yet"
        actionLabel="Browse Products"
        actionTo={routePaths.products}
      />
    );
  }

  function handleQuantity(cartItemId, qty) {
    updateMutation.mutate(
      { cartItemId, quantity: qty },
      { onError: (err) => addToast({ type: "error", message: err.message }) },
    );
  }

  function handleRemove(cartItemId) {
    removeMutation.mutate(cartItemId, {
      onSuccess: () => addToast({ type: "success", message: "Item removed" }),
      onError: (err) => addToast({ type: "error", message: err.message }),
    });
  }

  function handleClearCart() {
    clearMutation.mutate(undefined, {
      onSuccess: () => {
        addToast({ type: "success", message: "Cart cleared" });
        setConfirmClear(false);
      },
    });
  }

  function handleApplyCoupon(e) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    applyCouponMutation.mutate(
      { code: couponCode.trim() },
      {
        onSuccess: () => {
          addToast({ type: "success", message: "Coupon applied!" });
          setCouponCode("");
        },
        onError: (err) => addToast({ type: "error", message: err.message }),
      },
    );
  }

  function handleRemoveCoupon() {
    removeCouponMutation.mutate(undefined, {
      onSuccess: () => addToast({ type: "success", message: "Coupon removed" }),
    });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600">
            Cart
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Shopping Cart
          </h1>
        </div>
        <button
          onClick={() => setConfirmClear(true)}
          className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => {
            const prod = item.product;
            return (
              <div
                key={item._id}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <Link
                      to={`/products/${prod?._id || item.product}`}
                      className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-gray-500">
                      ₹{item.price?.toLocaleString("en-IN")} each
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() => handleQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity(item._id, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    ₹{item.subtotal?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-medium">₹{cart.cartTotal?.toLocaleString("en-IN")}</span>
            </div>
            {cart.discountPrice > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-medium">−₹{cart.discountPrice?.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium">
                {cart.cartTotal >= 5000 ? (
                  <span className="text-emerald-600">Free</span>
                ) : (
                  "₹50"
                )}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₹{((cart.finalTotal || cart.cartTotal) + (cart.cartTotal >= 5000 ? 0 : 50))?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Coupon */}
          {cart.coupon ? (
            <div className="mt-5 flex items-center justify-between rounded-lg bg-primary-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-700">
                <Tag size={14} /> {cart.coupon.code}
              </div>
              <button onClick={handleRemoveCoupon} className="text-primary-600 hover:text-primary-800 transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="mt-5 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
              />
              <button
                type="submit"
                disabled={applyCouponMutation.isPending}
                className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                Apply
              </button>
            </form>
          )}

          <Link
            to={routePaths.checkout}
            className="mt-5 block w-full rounded-lg bg-primary-600 py-3 text-center text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
          >
            Proceed to Checkout
          </Link>

          <Link
            to={routePaths.products}
            className="mt-3 block text-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear Cart"
        message="Remove all items from your cart? This cannot be undone."
        confirmLabel="Clear All"
        onConfirm={handleClearCart}
        onCancel={() => setConfirmClear(false)}
      />
    </main>
  );
}

export default CartPage;
