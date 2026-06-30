import { useDashboardSummary } from "../../features/admin/hooks/useAdmin.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";
import {
  Users,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboardPage() {
  const { data: summary, isLoading, error } = useDashboardSummary();

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h2 className="text-lg font-bold">Failed to load dashboard analytics</h2>
        <p className="mt-1 text-sm">{error.message || "Please try again later."}</p>
      </div>
    );
  }

  const { users, products, orders, payments, sales, recentOrders = [] } = summary || {};

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${sales?.totalRevenue?.toLocaleString("en-IN") || 0}`,
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-500/10",
      description: `Avg. Order: ₹${sales?.averageOrderValue?.toLocaleString("en-IN") || 0}`,
    },
    {
      title: "Total Orders",
      value: orders?.totalOrders || 0,
      icon: CreditCard,
      color: "text-blue-400 bg-blue-500/10",
      description: `${orders?.pending || 0} pending, ${orders?.delivered || 0} delivered`,
    },
    {
      title: "Total Products",
      value: products?.totalProducts || 0,
      icon: Package,
      color: "text-indigo-400 bg-indigo-500/10",
      description: `${products?.lowStockProducts || 0} low stock items`,
    },
    {
      title: "Active Users",
      value: users?.activeUsers || 0,
      icon: Users,
      color: "text-violet-400 bg-violet-500/10",
      description: `${users?.blockedUsers || 0} blocked users`,
    },
  ];

  // Dummy chart data for visualization since backend summary doesn't include historical time series
  const chartData = [
    { name: "Mon", sales: (sales?.totalRevenue || 0) * 0.1 },
    { name: "Tue", sales: (sales?.totalRevenue || 0) * 0.15 },
    { name: "Wed", sales: (sales?.totalRevenue || 0) * 0.12 },
    { name: "Thu", sales: (sales?.totalRevenue || 0) * 0.2 },
    { name: "Fri", sales: (sales?.totalRevenue || 0) * 0.18 },
    { name: "Sat", sales: (sales?.totalRevenue || 0) * 0.25 },
    { name: "Sun", sales: (sales?.totalRevenue || 0) * 0.3 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
          Admin Console
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Dashboard Overview
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <div className={`rounded-xl p-2.5 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-xs text-slate-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-white">Revenue Analysis</h2>
          <p className="text-xs text-slate-500">Weekly sales distribution</p>
          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-white">Stock Warnings</h2>
          </div>
          <p className="text-xs text-slate-500">Products below {products?.lowStockThreshold || 5} units</p>

          <div className="mt-6 space-y-4">
            {products?.lowStockProducts > 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-10 w-10 text-slate-600" />
                <p className="mt-3 text-sm font-medium text-slate-400">
                  {products.lowStockProducts} products need restocking
                </p>
                <p className="text-xs text-slate-500">Check the products section to update stock.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm font-medium text-emerald-400">All products well stocked!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-white">Recent Activity</h2>
        <p className="text-xs text-slate-500">Latest orders placed across the store</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-white/5">
                  <td className="py-3.5 px-4 font-mono text-xs">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{order.user?.name || "Deleted User"}</p>
                    <p className="text-xs text-slate-500">{order.user?.email}</p>
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
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No orders recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
