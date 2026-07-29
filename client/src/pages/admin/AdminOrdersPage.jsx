import { Link } from "react-router";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { useAdminOrders } from "../../features/admin/hooks/useAdmin.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";

function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();

  if (isLoading) {
    return (
      <div className="py-20">
        <PageLoader />
      </div>
    );
  }

  const orderList = Array.isArray(orders) ? orders : [];

  const totalRevenue = orderList.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0,
  );

  const pendingOrders = orderList.filter(
    (order) => order.orderStatus === "pending",
  ).length;

  const deliveredOrders = orderList.filter(
    (order) => order.orderStatus === "delivered",
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
            Fulfilment management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Review customer purchases, payment status, and fulfilment progress.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-text-muted">
          <ShoppingBag
            size={16}
            className="text-accent-700"
            aria-hidden="true"
          />
          <strong className="font-extrabold text-primary-950">
            {orderList.length}
          </strong>{" "}
          {orderList.length === 1 ? "order" : "orders"}
        </span>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Recorded orders"
          value={orderList.length.toLocaleString("en-IN")}
          icon={Package}
        />

        <SummaryCard
          label="Pending"
          value={pendingOrders.toLocaleString("en-IN")}
          icon={CalendarDays}
          tone="warning"
        />

        <SummaryCard
          label="Delivered"
          value={deliveredOrders.toLocaleString("en-IN")}
          icon={ShoppingBag}
          tone="success"
          description={`Revenue ${formatCurrency(totalRevenue)}`}
        />
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
        <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-subtle px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-primary-950">
              Order list
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              Open an order to review details or update its status.
            </p>
          </div>
        </div>

        {orderList.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-border bg-white">
                  <tr className="text-xs font-bold uppercase tracking-[0.08em] text-text-soft">
                    <th className="px-5 py-3.5">Order</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Total</th>
                    <th className="px-5 py-3.5">Order status</th>
                    <th className="px-5 py-3.5">Payment</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {orderList.map((order) => (
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
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-100 text-xs font-extrabold text-primary-700">
                            {getInitial(order.user?.name)}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate font-extrabold text-primary-950">
                              {order.user?.name || "Deleted user"}
                            </p>

                            <p className="mt-0.5 max-w-[190px] truncate text-xs text-text-soft">
                              {order.user?.email || "Email unavailable"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-text-muted">
                        {formatDate(order.createdAt)}
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

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-3 text-xs font-bold text-primary-900 transition hover:bg-primary-50"
                        >
                          <Eye size={15} aria-hidden="true" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-border md:hidden">
              {orderList.map((order) => (
                <article key={order._id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
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

                    <p className="shrink-0 text-base font-extrabold text-primary-950">
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

                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="mt-4 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-white text-sm font-bold text-primary-900 transition hover:bg-primary-50"
                  >
                    View order
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyOrders />
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  description,
}) {
  const toneClasses = {
    default: "bg-primary-50 text-primary-700",
    warning: "bg-amber-50 text-amber-700",
    success: "bg-green-50 text-green-700",
  };

  return (
    <article className="rounded-lg border border-border bg-white p-4 shadow-[0_1px_4px_rgba(15,24,32,0.05)]">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${toneClasses[tone]}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">
            {label}
          </p>

          <p className="mt-1 text-xl font-extrabold text-primary-950">
            {value}
          </p>

          {description && (
            <p className="mt-1 truncate text-xs text-text-muted">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function EmptyOrders() {
  return (
    <div className="px-5 py-16 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-400">
        <ShoppingBag size={25} aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-extrabold text-primary-950">
        No orders recorded
      </h3>

      <p className="mt-1 text-sm text-text-muted">
        Customer orders will appear here.
      </p>
    </div>
  );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
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

function getInitial(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

export default AdminOrdersPage;
