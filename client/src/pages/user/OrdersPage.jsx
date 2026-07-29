import { Link } from "react-router";
import { Package, Eye } from "lucide-react";

import { useMyOrders } from "../../features/orders/hooks/useOrders.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Badge from "../../components/common/Badge.jsx";
import routePaths from "../../routes/routePaths.js";

function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) return <PageLoader />;

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        message="Your order history will appear here after your first purchase"
        actionLabel="Start Shopping"
        actionTo={routePaths.products}
      />
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-primary-600">
        Orders
      </p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
        Order History
      </h1>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
                <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {order.orderItems.slice(0, 3).map((item, idx) => (
                <div key={idx} className="h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
              ))}
              {order.orderItems.length > 3 && (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                  +{order.orderItems.length - 3}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <span className="text-xs text-gray-500">
                  {order.orderItems.length} item(s) • {order.paymentMethod?.toUpperCase()}
                </span>
                <p className="text-base font-bold text-gray-900">
                  ₹{order.totalPrice?.toLocaleString("en-IN")}
                </p>
              </div>
              <Link
                to={`/orders/${order._id}`}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <Eye size={14} /> View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default OrdersPage;
