import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import { useDashboardSummary } from "../../features/admin/hooks/useAdmin.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";
import routePaths from "../../routes/routePaths.js";

function AdminDashboardPage() {
  const { data: summary, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="py-20">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={21}
            className="mt-0.5 shrink-0 text-red-600"
            aria-hidden="true"
          />

          <div>
            <h1 className="text-lg font-extrabold text-red-800">
              Dashboard analytics could not be loaded
            </h1>

            <p className="mt-1 text-sm leading-6 text-red-700">
              {error.message || "Please try again later."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const {
    users,
    products,
    orders,
    payments,
    sales,
    recentOrders = [],
  } = summary || {};

  const stats = [
    {
      title: "Total revenue",
      value: formatCurrency(sales?.totalRevenue),
      description: `Average order ${formatCurrency(sales?.averageOrderValue)}`,
      icon: TrendingUp,
      tone: "success",
    },
    {
      title: "Total orders",
      value: formatNumber(orders?.totalOrders),
      description: `${formatNumber(orders?.pending)} pending · ${formatNumber(
        orders?.delivered,
      )} delivered`,
      icon: ShoppingBag,
      tone: "amber",
    },
    {
      title: "Catalog products",
      value: formatNumber(products?.totalProducts),
      description: `${formatNumber(
        products?.lowStockProducts,
      )} low-stock products`,
      icon: Package,
      tone: "blue",
    },
    {
      title: "Active users",
      value: formatNumber(users?.activeUsers),
      description: `${formatNumber(users?.blockedUsers)} blocked accounts`,
      icon: Users,
      tone: "violet",
    },
  ];

  const paymentBreakdown = [
    {
      label: "Successful payments",
      value: payments?.successful ?? payments?.paid ?? payments?.completed ?? 0,
      tone: "text-green-700",
    },
    {
      label: "Pending payments",
      value: payments?.pending ?? payments?.awaiting ?? 0,
      tone: "text-accent-800",
    },
    {
      label: "Failed payments",
      value: payments?.failed ?? 0,
      tone: "text-red-600",
    },
  ];

  const orderBreakdown = [
    {
      label: "Pending",
      value: orders?.pending || 0,
    },
    {
      label: "Processing",
      value: orders?.processing ?? orders?.confirmed ?? 0,
    },
    {
      label: "Shipped",
      value: orders?.shipped || 0,
    },
    {
      label: "Delivered",
      value: orders?.delivered || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
            Store operations
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
            Dashboard overview
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Monitor revenue, orders, inventory, users, and recent activity.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-green-100 bg-green-50 px-3 py-2 text-sm font-bold text-green-700">
          <CheckCircle2 size={16} aria-hidden="true" />
          Live summary
        </span>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <div className="grid gap-6 lg:grid-cols-2">
          <SummaryPanel
            title="Order pipeline"
            description="Current order-status distribution"
            icon={ShoppingBag}
          >
            <div className="space-y-3">
              {orderBreakdown.map((item) => (
                <MetricRow
                  key={item.label}
                  label={item.label}
                  value={formatNumber(item.value)}
                />
              ))}
            </div>

            <Link
              to={routePaths.adminOrders}
              className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-4 text-sm font-bold text-primary-900 transition hover:bg-primary-50"
            >
              Manage orders
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </SummaryPanel>

          <SummaryPanel
            title="Payment snapshot"
            description="Payment outcomes reported by the backend"
            icon={CreditCard}
          >
            <div className="space-y-3">
              {paymentBreakdown.map((item) => (
                <MetricRow
                  key={item.label}
                  label={item.label}
                  value={formatNumber(item.value)}
                  valueClassName={item.tone}
                />
              ))}
            </div>
          </SummaryPanel>
        </div>

        <section
          className={`rounded-lg border p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)] ${
            Number(products?.lowStockProducts) > 0
              ? "border-amber-200 bg-amber-50"
              : "border-green-100 bg-green-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                Number(products?.lowStockProducts) > 0
                  ? "bg-white text-amber-700"
                  : "bg-white text-green-700"
              }`}
            >
              {Number(products?.lowStockProducts) > 0 ? (
                <AlertTriangle size={19} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={19} aria-hidden="true" />
              )}
            </span>

            <div>
              <h2 className="text-lg font-extrabold text-primary-950">
                Inventory status
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                Low-stock threshold: {products?.lowStockThreshold || 5} units
              </p>
            </div>
          </div>

          <div className="mt-6">
            {Number(products?.lowStockProducts) > 0 ? (
              <>
                <p className="text-4xl font-extrabold tracking-[-0.04em] text-amber-800">
                  {formatNumber(products.lowStockProducts)}
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-900">
                  Products need inventory review.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-extrabold text-green-700">
                  Inventory levels look healthy
                </p>

                <p className="mt-2 text-sm leading-6 text-green-800">
                  No products are currently below the configured threshold.
                </p>
              </>
            )}
          </div>

          <Link
            to={routePaths.adminProducts}
            className="mt-6 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-md border border-primary-950 bg-primary-950 px-4 text-sm font-bold text-white transition hover:bg-primary-800"
          >
            Review products
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
        <div className="flex flex-col gap-3 border-b border-border bg-surface-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-primary-950">
              Recent orders
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              Latest purchases recorded by the store
            </p>
          </div>

          <Link
            to={routePaths.adminOrders}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline"
          >
            View all orders
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-border bg-white">
                  <tr className="text-xs font-bold uppercase tracking-[0.08em] text-text-soft">
                    <th className="px-5 py-3.5">Order</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Total</th>
                    <th className="px-5 py-3.5">Order status</th>
                    <th className="px-5 py-3.5">Payment</th>
                    <th className="px-5 py-3.5">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-primary-50/50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="font-mono text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-extrabold text-primary-950">
                          {order.user?.name || "Deleted user"}
                        </p>

                        <p className="mt-0.5 max-w-[190px] truncate text-xs text-text-soft">
                          {order.user?.email || "Email unavailable"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-extrabold text-primary-950">
                        {formatCurrency(order.totalPrice)}
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant={order.orderStatus}>
                          {formatStatus(order.orderStatus)}
                        </Badge>
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant={order.paymentStatus}>
                          {formatStatus(order.paymentStatus)}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-xs text-text-muted">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-border md:hidden">
              {recentOrders.map((order) => (
                <article key={order._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="font-mono text-xs font-bold text-blue-700 hover:underline"
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>

                      <h3 className="mt-1 truncate font-extrabold text-primary-950">
                        {order.user?.name || "Deleted user"}
                      </h3>

                      <p className="mt-1 text-xs text-text-muted">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <p className="shrink-0 font-extrabold text-primary-950">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant={order.orderStatus}>
                      {formatStatus(order.orderStatus)}
                    </Badge>

                    <Badge variant={order.paymentStatus}>
                      {formatStatus(order.paymentStatus)}
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="px-5 py-14 text-center">
            <ShoppingBag
              size={28}
              className="mx-auto text-primary-300"
              aria-hidden="true"
            />

            <h3 className="mt-3 font-extrabold text-primary-950">
              No orders recorded yet
            </h3>

            <p className="mt-1 text-sm text-text-muted">
              New orders will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ title, value, description, icon: Icon, tone }) {
  const toneClasses = {
    success: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <article className="rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-text-muted">{title}</p>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
            toneClasses[tone]
          }`}
        >
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-primary-950">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-text-soft">{description}</p>
    </article>
  );
}

function SummaryPanel({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
          <Icon size={18} aria-hidden="true" />
        </span>

        <div>
          <h2 className="text-lg font-extrabold text-primary-950">{title}</h2>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function MetricRow({ label, value, valueClassName = "text-primary-950" }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-text-muted">{label}</span>

      <span className={`font-extrabold ${valueClassName}`}>{value}</span>
    </div>
  );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(value) {
  if (!value) return "Unknown";

  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default AdminDashboardPage;
