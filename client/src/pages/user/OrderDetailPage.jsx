import { useParams, Link } from "react-router";
import { ChevronLeft, MapPin, CreditCard } from "lucide-react";

import { useMyOrder } from "../../features/orders/hooks/useOrders.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";
import routePaths from "../../routes/routePaths.js";

function OrderDetailPage() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useMyOrder(orderId);

  if (isLoading) return <PageLoader />;

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
        <Link to={routePaths.orders} className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
          Back to Orders
        </Link>
      </main>
    );
  }

  const addr = order.shippingAddress;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link to={routePaths.orders} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
        <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Order Items</h2>
          <div className="mt-4 space-y-3">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                </div>
                <span className="text-sm font-bold text-slate-900">₹{item.subtotal?.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Price Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Price Details</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Total</span><span>₹{order.itemsPrice?.toLocaleString("en-IN")}</span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span><span>−₹{order.discountPrice?.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Total</span><span>₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <MapPin size={14} className="text-emerald-600" /> Shipping Address
            </h3>
            <div className="mt-3 text-sm text-slate-600 leading-6">
              <p className="font-medium text-slate-900">{addr?.fullName}</p>
              <p>{addr?.addressLine1}</p>
              {addr?.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>{addr?.city}, {addr?.state} {addr?.postalCode}</p>
              <p>{addr?.country}</p>
              <p className="mt-1">{addr?.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <CreditCard size={14} className="text-emerald-600" /> Payment
            </h3>
            <div className="mt-3 text-sm text-slate-600">
              <p>Method: <span className="font-medium text-slate-900">{order.paymentMethod?.toUpperCase()}</span></p>
              <p>Status: <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge></p>
              {order.paidAt && <p className="mt-1">Paid: {new Date(order.paidAt).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderDetailPage;
