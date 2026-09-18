import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { CreditCard, LoaderCircle, ShieldCheck, Truck } from "lucide-react";

import { useCart } from "../../features/cart/hooks/useCart.js";
import { useCreateOrder } from "../../features/orders/hooks/useOrders.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  markRazorpayPaymentFailed,
} from "../../features/orders/paymentApi.js";
import { useRazorpayCheckout } from "../../features/orders/hooks/useRazorpayCheckout.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import FormInput from "../../components/common/FormInput.jsx";

function CheckoutPage() {
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const { data: cart, isLoading } = useCart();
  const createOrderMutation = useCreateOrder();
  const { openRazorpayCheckout } = useRazorpayCheckout();

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { country: "India", paymentMethod: "cod" },
  });

  const selectedPaymentMethod = watch("paymentMethod");

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
  const totalPrice = (cart.payableTotal || cart.cartTotal) + shippingPrice;

  function navigateToOrder(orderId) {
    navigate(
      routePaths.orderDetail.replace(":orderId", orderId),
      { replace: true },
    );
  }

  // COD order flow — uses the existing order creation endpoint.
  function handleCodOrder(shippingAddress) {
    createOrderMutation.mutate(
      { shippingAddress, paymentMethod: "cod" },
      {
        onSuccess: (res) => {
          const order = res.data.data;
          addToast({ type: "success", message: "Order placed successfully!" });
          navigateToOrder(order._id);
        },
        onError: (err) => {
          addToast({ type: "error", message: err.message });
        },
      },
    );
  }

  // Online payment flow — calls Razorpay create-order, opens modal, verifies.
  async function handleOnlinePayment(shippingAddress) {
    setIsPaymentProcessing(true);

    let createResponse;

    try {
      createResponse = await createRazorpayOrder({ shippingAddress });
    } catch (err) {
      addToast({
        type: "error",
        message: err.message || "Failed to create payment order",
      });
      setIsPaymentProcessing(false);
      return;
    }

    const { order, razorpay } = createResponse.data.data;

    try {
      // Open Razorpay checkout modal and wait for user to complete payment.
      const paymentResult = await openRazorpayCheckout({
        keyId: razorpay.keyId,
        orderId: razorpay.orderId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        },
      });

      // Payment success — verify on backend.
      try {
        await verifyRazorpayPayment({
          orderId: order._id,
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
        });

        addToast({
          type: "success",
          message: "Payment successful! Order confirmed.",
        });
        navigateToOrder(order._id);
      } catch (verifyErr) {
        addToast({
          type: "error",
          message:
            verifyErr.message ||
            "Payment verification failed. Please contact support.",
        });
        navigateToOrder(order._id);
      }
    } catch (paymentErr) {
      // Payment failed or was dismissed by user.
      try {
        await markRazorpayPaymentFailed({
          orderId: order._id,
          razorpay_order_id: razorpay.orderId,
          razorpay_payment_id: paymentErr.razorpay_payment_id || "",
          reason: paymentErr.reason || "Payment failed or cancelled",
        });
      } catch {
        // Silently ignore failure-marking errors — the order is already
        // in pending state and will be cleaned up by the backend job.
      }

      if (paymentErr.dismissed) {
        addToast({
          type: "warning",
          message:
            "Payment cancelled. You can retry from your orders page.",
        });
      } else {
        addToast({
          type: "error",
          message: paymentErr.reason || "Payment failed. Please try again.",
        });
      }

      navigateToOrder(order._id);
    } finally {
      setIsPaymentProcessing(false);
    }
  }

  const onSubmit = (data) => {
    const { paymentMethod, ...shippingAddress } = data;

    if (paymentMethod === "online") {
      handleOnlinePayment(shippingAddress);
    } else {
      handleCodOrder(shippingAddress);
    }
  };

  const isBusy = createOrderMutation.isPending || isPaymentProcessing;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600">
          Checkout
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Complete Your Order
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Shipping Form */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2.5 text-base font-bold text-gray-900">
              <Truck size={20} className="text-primary-600" /> Shipping Address
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
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
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2.5 text-base font-bold text-gray-900">
              <CreditCard size={20} className="text-primary-600" /> Payment Method
            </div>
            <div className="mt-5 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3.5 transition-all hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                <input type="radio" value="cod" {...register("paymentMethod")} className="accent-primary-600" />
                <span className="text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3.5 transition-all hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                <input type="radio" value="online" {...register("paymentMethod")} className="accent-primary-600" />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Pay Online (UPI / Card / Netbanking)</span>
                  <ShieldCheck size={16} className="text-emerald-600" />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="mt-4 max-h-64 space-y-3 overflow-auto">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 text-xs min-w-0">
                  <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-gray-900 shrink-0">₹{item.subtotal?.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
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
              <span className="font-medium">{shippingPrice === 0 ? <span className="text-emerald-600">Free</span> : `₹${shippingPrice}`}</span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalPrice?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="mt-6 w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-md disabled:opacity-60"
          >
            {isBusy ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle size={16} className="animate-spin" />
                {isPaymentProcessing ? "Processing Payment…" : "Placing Order…"}
              </span>
            ) : selectedPaymentMethod === "online" ? (
              `Pay Online • ₹${totalPrice?.toLocaleString("en-IN")}`
            ) : (
              `Place Order • ₹${totalPrice?.toLocaleString("en-IN")}`
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CheckoutPage;
