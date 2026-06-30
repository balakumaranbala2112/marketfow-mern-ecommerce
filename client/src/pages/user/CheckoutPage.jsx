import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { CreditCard, Truck } from "lucide-react";

import { useCart } from "../../features/cart/hooks/useCart.js";
import { useCreateOrder } from "../../features/orders/hooks/useOrders.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import FormInput from "../../components/common/FormInput.jsx";

function CheckoutPage() {
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const { data: cart, isLoading } = useCart();
  const createOrderMutation = useCreateOrder();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { country: "India", paymentMethod: "cod" },
  });

  if (isLoading) return <PageLoader />;

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <EmptyState
        title="Cart is empty"
        message="Add products to your cart before checkout"
        actionLabel="Browse Products"
        actionTo={routePaths.products}
      />
    );
  }

  const shippingPrice = cart.cartTotal >= 5000 ? 0 : 50;
  const totalPrice = (cart.finalTotal || cart.cartTotal) + shippingPrice;

  const onSubmit = (data) => {
    const { paymentMethod, ...shippingAddress } = data;

    createOrderMutation.mutate(
      { shippingAddress, paymentMethod },
      {
        onSuccess: (res) => {
          const order = res.data.data;
          addToast({ type: "success", message: "Order placed successfully!" });
          navigate(`/orders/${order._id}`, { replace: true });
        },
        onError: (err) => {
          addToast({ type: "error", message: err.message });
        },
      },
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Checkout</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Complete Your Order</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Shipping Form */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Truck size={20} className="text-emerald-600" /> Shipping Address
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FormInput label="Full Name" id="co-fullName" register={register("fullName", { required: "Required" })} error={errors.fullName?.message} />
              <FormInput label="Phone" id="co-phone" type="tel" register={register("phone", { required: "Required" })} error={errors.phone?.message} />
              <div className="md:col-span-2">
                <FormInput label="Address Line 1" id="co-addr1" register={register("addressLine1", { required: "Required" })} error={errors.addressLine1?.message} />
              </div>
              <div className="md:col-span-2">
                <FormInput label="Address Line 2 (optional)" id="co-addr2" register={register("addressLine2")} />
              </div>
              <FormInput label="City" id="co-city" register={register("city", { required: "Required" })} error={errors.city?.message} />
              <FormInput label="State" id="co-state" register={register("state", { required: "Required" })} error={errors.state?.message} />
              <FormInput label="Postal Code" id="co-postal" register={register("postalCode", { required: "Required" })} error={errors.postalCode?.message} />
              <FormInput label="Country" id="co-country" register={register("country", { required: "Required" })} error={errors.country?.message} />
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CreditCard size={20} className="text-emerald-600" /> Payment Method
            </div>
            <div className="mt-5 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-all hover:border-emerald-300 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                <input type="radio" value="cod" {...register("paymentMethod")} className="accent-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

          <div className="mt-4 max-h-64 space-y-3 overflow-auto">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-medium text-slate-900 line-clamp-1">{item.name}</p>
                  <p className="text-slate-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold">₹{item.subtotal?.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
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
              <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}</span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>₹{totalPrice?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={createOrderMutation.isPending}
            className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
          >
            {createOrderMutation.isPending ? "Placing Order..." : `Place Order • ₹${totalPrice?.toLocaleString("en-IN")}`}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CheckoutPage;
