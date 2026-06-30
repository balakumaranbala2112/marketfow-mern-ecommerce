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
    <main className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Orders</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Order History</h1>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
                <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {order.orderItems.slice(0, 3).map((item, idx) => (
                <div key={idx} className="h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
              ))}
              {order.orderItems.length > 3 && (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                  +{order.orderItems.length - 3}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <span className="text-xs text-slate-500">{order.orderItems.length} item(s) • {order.paymentMethod?.toUpperCase()}</span>
                <p className="text-base font-bold text-slate-900">₹{order.totalPrice?.toLocaleString("en-IN")}</p>
              </div>
              <Link
                to={`/orders/${order._id}`}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
