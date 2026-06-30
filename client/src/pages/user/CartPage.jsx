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
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Cart</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Shopping Cart</h1>
        </div>
        <button
          onClick={() => setConfirmClear(true)}
          className="text-sm font-medium text-red-600 hover:text-red-700"
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
              <div key={item._id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300"><ShoppingBag size={24} /></div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/products/${prod?._id || item.product}`} className="text-sm font-semibold text-slate-900 hover:text-emerald-700">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-slate-500">₹{item.price?.toLocaleString("en-IN")} each</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button onClick={() => handleQuantity(item._id, Math.max(1, item.quantity - 1))} className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900"><Minus size={14} /></button>
                      <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                      <button onClick={() => handleQuantity(item._id, item.quantity + 1)} className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => handleRemove(item._id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₹{item.subtotal?.toLocaleString("en-IN")}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({items.length} items)</span>
              <span>₹{cart.cartTotal?.toLocaleString("en-IN")}</span>
            </div>
            {cart.discountPrice > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>−₹{cart.discountPrice?.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{cart.cartTotal >= 5000 ? "Free" : "₹50"}</span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>₹{((cart.finalTotal || cart.cartTotal) + (cart.cartTotal >= 5000 ? 0 : 50))?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Coupon */}
          {cart.coupon ? (
            <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <Tag size={14} /> {cart.coupon.code}
              </div>
              <button onClick={handleRemoveCoupon} className="text-emerald-600 hover:text-emerald-800"><X size={16} /></button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="mt-5 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={applyCouponMutation.isPending}
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                Apply
              </button>
            </form>
          )}

          <Link
            to={routePaths.checkout}
            className="mt-5 block w-full rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            Proceed to Checkout
          </Link>

          <Link
            to={routePaths.products}
            className="mt-3 block text-center text-sm font-medium text-slate-500 hover:text-slate-700"
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
