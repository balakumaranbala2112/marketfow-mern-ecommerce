import { Link } from "react-router";
import { Eye, Clock } from "lucide-react";
import { useAdminOrders } from "../../features/admin/hooks/useAdmin.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";

function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders Management</h1>
        <p className="text-sm text-slate-400">View and update customer order states</p>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders?.map((order) => (
                <tr key={order._id} className="hover:bg-white/5">
                  <td className="py-3.5 px-4 font-mono text-xs">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{order.user?.name || "Deleted User"}</p>
                    <p className="text-xs text-slate-500">{order.user?.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    ₹{order.totalPrice?.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={order.orderStatus}>{order.orderStatus}</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={order.paymentStatus}>{order.paymentStatus}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders?.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No orders recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
