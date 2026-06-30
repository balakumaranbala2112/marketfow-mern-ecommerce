import { useParams, Link } from "react-router";
import { ChevronLeft, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import { useAdminOrderDetail, useUpdateOrderStatus } from "../../features/admin/hooks/useAdmin.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";
import useToastStore from "../../stores/toastStore.js";

function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const addToast = useToastStore((s) => s.addToast);

  const { data: order, isLoading, refetch } = useAdminOrderDetail(orderId);
  const updateStatusMutation = useUpdateOrderStatus();

  if (isLoading) return <PageLoader />;

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-12 text-center text-white">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link to="/admin/orders" className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
          Back to Orders
        </Link>
      </main>
    );
  }

  const addr = order.shippingAddress;
  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  const handleStatusChange = (e) => {
    const nextStatus = e.target.value;
    if (!nextStatus) return;

    updateStatusMutation.mutate(
      { orderId, orderStatus: nextStatus },
      {
        onSuccess: () => {
          addToast({ type: "success", message: `Order status updated to ${nextStatus}` });
          refetch();
        },
        onError: (err) => {
          addToast({ type: "error", message: err.message || "Failed to update status" });
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-slate-300">
      <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
            <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Status update controller */}
        <div className="space-y-1">
          <label htmlFor="update-status" className="block text-xs font-semibold text-slate-400 uppercase">
            Change Order Status
          </label>
          <select
            id="update-status"
            value={order.orderStatus}
            onChange={handleStatusChange}
            disabled={updateStatusMutation.isPending || order.orderStatus === "delivered" || order.orderStatus === "cancelled"}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none focus:border-emerald-500 disabled:opacity-55"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items list */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Items</h2>
            <div className="space-y-3">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                    {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                  </div>
                  <span className="text-sm font-bold text-white">₹{item.subtotal?.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white">Price Details</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Items Total</span><span>₹{order.itemsPrice?.toLocaleString("en-IN")}</span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span><span>−₹{order.discountPrice?.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="border-t border-white/10 pt-2">
                <div className="flex justify-between font-bold text-white">
                  <span>Total</span><span>₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white">Customer Profile</h3>
            <div className="mt-3 text-sm text-slate-400 space-y-1">
              <p className="font-medium text-white">{order.user?.name || "Deleted User"}</p>
              <p>{order.user?.email}</p>
              {order.user?.phone && <p>Phone: {order.user.phone}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <MapPin size={14} className="text-emerald-400" /> Shipping Address
            </h3>
            <div className="mt-3 text-sm text-slate-400 leading-6">
              <p className="font-medium text-white">{addr?.fullName}</p>
              <p>{addr?.addressLine1}</p>
              {addr?.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>{addr?.city}, {addr?.state} {addr?.postalCode}</p>
              <p>{addr?.country}</p>
              <p className="mt-1">{addr?.phone}</p>
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <CreditCard size={14} className="text-emerald-400" /> Payment
            </h3>
            <div className="mt-3 text-sm text-slate-400 space-y-1">
              <p>Method: <span className="font-medium text-white">{order.paymentMethod?.toUpperCase()}</span></p>
              <p>Status: <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge></p>
              {order.paidAt && <p>Paid at: {new Date(order.paidAt).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailPage;
