import { Link } from "react-router";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Eye,
  Package,
  ShoppingBag,
} from "lucide-react";

import { useMyOrders } from "../../features/orders/hooks/useOrders.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Badge from "../../components/common/Badge.jsx";

import routePaths from "../../routes/routePaths.js";

function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <main className="min-h-[65vh] bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
          <PageLoader />
        </div>
      </main>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <main className="min-h-[70vh] bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-white py-8 shadow-[0_2px_8px_rgba(15,24,32,0.06)]">
            <EmptyState
              icon={Package}
              title="No orders yet"
              message="Your completed purchases and order updates will appear here."
              actionLabel="Start shopping"
              actionTo={routePaths.products}
            />
          </div>
        </div>
      </main>
    );
  }

  const totalItems = orders.reduce(
    (sum, order) => sum + (order.orderItems?.length || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-surface-muted">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
                Account activity
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-primary-950 sm:text-4xl">
                Your orders
              </h1>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                Review past purchases, payment status, and order progress.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-muted">
              <ShoppingBag
                size={16}
                className="text-accent-600"
                aria-hidden="true"
              />

              <span>
                <strong className="font-extrabold text-primary-950">
                  {orders.length}
                </strong>{" "}
                {orders.length === 1 ? "order" : "orders"} ·{" "}
                <strong className="font-extrabold text-primary-950">
                  {totalItems}
                </strong>{" "}
                {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            Most recent orders appear first.
          </p>

          <Link
            to={routePaths.products}
            className="hidden items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline sm:inline-flex"
          >
            Continue shopping
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>

        <Link
          to={routePaths.products}
          className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-5 text-sm font-semibold text-primary-900 transition hover:bg-primary-50 sm:hidden"
        >
          Continue shopping
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

function OrderCard({ order }) {
  const orderNumber = order._id.slice(-8).toUpperCase();
  const orderItems = order.orderItems || [];

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)] transition hover:border-border-strong hover:shadow-[0_3px_10px_rgba(15,24,32,0.08)]">
      <div className="border-b border-border bg-surface-subtle px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-soft">
              Order #{orderNumber}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} aria-hidden="true" />
                {formatOrderDate(order.createdAt)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CreditCard size={15} aria-hidden="true" />
                {formatPaymentMethod(order.paymentMethod)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={order.orderStatus}>
              {formatStatus(order.orderStatus)}
            </Badge>

            <Badge variant={order.paymentStatus}>
              {formatStatus(order.paymentStatus)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              {orderItems.slice(0, 4).map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="h-14 w-14 overflow-hidden rounded-md border border-border bg-white sm:h-16 sm:w-16"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary-50 text-primary-300">
                      <ShoppingBag
                        size={22}
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              ))}

              {orderItems.length > 4 && (
                <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border bg-primary-50 text-xs font-extrabold text-primary-700 sm:h-16 sm:w-16">
                  +{orderItems.length - 4}
                </div>
              )}
            </div>

            <p className="mt-3 text-sm text-text-muted">
              {orderItems.length}{" "}
              {orderItems.length === 1 ? "product" : "products"}
            </p>
          </div>

          <div className="flex items-end justify-between gap-5 border-t border-border pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">
                Order total
              </p>

              <p className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-primary-950">
                ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <Link
              to={`/orders/${order._id}`}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-4 text-sm font-bold text-primary-900 transition hover:bg-primary-50 sm:mt-4"
            >
              <Eye size={16} aria-hidden="true" />
              View details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatOrderDate(dateValue) {
  if (!dateValue) {
    return "Date unavailable";
  }

  return new Date(dateValue).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPaymentMethod(method) {
  if (!method) {
    return "Payment method unavailable";
  }

  return method.replace(/[_-]/g, " ").toUpperCase();
}

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return status
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default OrdersPage;
