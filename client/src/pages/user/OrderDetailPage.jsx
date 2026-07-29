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
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <Link to={routePaths.orders} className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Back to Orders
        </Link>
      </main>
    );
  }

  const addr = order.shippingAddress;

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to={routePaths.orders} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
        <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge>
      </div>
      <p className="mt-1.5 text-sm text-gray-500">
        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div>
          <h2 className="text-base font-bold text-gray-900">Order Items</h2>
          <div className="mt-4 space-y-3">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                </div>
                <span className="text-sm font-bold text-gray-900 shrink-0">₹{item.subtotal?.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Price Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-900">Price Details</h3>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span className="font-medium">₹{order.itemsPrice?.toLocaleString("en-IN")}</span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">−₹{order.discountPrice?.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">{order.shippingPrice === 0 ? <span className="text-emerald-600">Free</span> : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <MapPin size={14} className="text-primary-600" /> Shipping Address
            </h3>
            <div className="mt-3 text-sm text-gray-600 leading-6">
              <p className="font-semibold text-gray-900">{addr?.fullName}</p>
              <p>{addr?.addressLine1}</p>
              {addr?.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>{addr?.city}, {addr?.state} {addr?.postalCode}</p>
              <p>{addr?.country}</p>
              <p className="mt-1">{addr?.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <CreditCard size={14} className="text-primary-600" /> Payment
            </h3>
            <div className="mt-3 space-y-1.5 text-sm text-gray-600">
              <p>Method: <span className="font-semibold text-gray-900">{order.paymentMethod?.toUpperCase()}</span></p>
              <p className="flex items-center gap-2">Status: <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge></p>
              {order.paidAt && <p className="mt-1">Paid: {new Date(order.paidAt).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderDetailPage;
