import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useMyOrder } from "../../features/orders/hooks/useOrders.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";

import routePaths from "../../routes/routePaths.js";

function OrderDetailPage() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useMyOrder(orderId);

  if (isLoading) {
    return (
      <main className="min-h-[65vh] bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
          <PageLoader />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-surface-muted px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 text-center shadow-[0_2px_8px_rgba(15,24,32,0.08)]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-400">
            <Package size={30} strokeWidth={1.6} aria-hidden="true" />
          </span>

          <h1 className="mt-5 text-2xl font-extrabold text-primary-950">
            Order not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            This order may not exist or may not belong to the current account.
          </p>

          <Link
            to={routePaths.orders}
            className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-6 text-sm font-bold text-primary-950 transition hover:bg-accent-300"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to orders
          </Link>
        </div>
      </main>
    );
  }

  const address = order.shippingAddress;
  const orderNumber = order._id.slice(-8).toUpperCase();
  const orderItems = order.orderItems || [];

  return (
    <main className="min-h-screen bg-surface-muted">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={routePaths.orders}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 transition hover:text-blue-800 hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to orders
          </Link>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-accent-700">
                Order details
              </p>

              <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
                Order #{orderNumber}
              </h1>

              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-text-muted">
                <CalendarDays size={16} aria-hidden="true" />
                Placed on {formatLongDate(order.createdAt)}
              </p>
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
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="rounded-lg border border-border bg-white p-4 shadow-[0_1px_4px_rgba(15,24,32,0.06)] sm:p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatusSummary
              icon={Package}
              label="Order status"
              value={formatStatus(order.orderStatus)}
            />

            <StatusSummary
              icon={CreditCard}
              label="Payment status"
              value={formatStatus(order.paymentStatus)}
            />

            <StatusSummary
              icon={Truck}
              label="Delivery"
              value={
                order.shippingPrice === 0
                  ? "Free shipping"
                  : `₹${Number(order.shippingPrice || 0).toLocaleString("en-IN")}`
              }
            />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0">
            <div className="rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
              <div className="border-b border-border px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-extrabold text-primary-950">
                    Order items
                  </h2>

                  <span className="text-sm text-text-muted">
                    {orderItems.length}{" "}
                    {orderItems.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border">
                {orderItems.map((item, index) => (
                  <OrderItem key={`${item.name}-${index}`} item={item} />
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-lg border border-border bg-white p-5 shadow-[0_2px_8px_rgba(15,24,32,0.07)]">
              <h2 className="text-lg font-extrabold text-primary-950">
                Price details
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <PriceRow
                  label="Items total"
                  value={`₹${Number(order.itemsPrice || 0).toLocaleString(
                    "en-IN",
                  )}`}
                />

                {Number(order.discountPrice) > 0 && (
                  <PriceRow
                    label="Discount"
                    value={`−₹${Number(order.discountPrice).toLocaleString(
                      "en-IN",
                    )}`}
                    valueClassName="text-green-700"
                  />
                )}

                <PriceRow
                  label="Shipping"
                  value={
                    Number(order.shippingPrice) === 0
                      ? "Free"
                      : `₹${Number(order.shippingPrice || 0).toLocaleString(
                          "en-IN",
                        )}`
                  }
                  valueClassName={
                    Number(order.shippingPrice) === 0
                      ? "text-green-700"
                      : undefined
                  }
                />
              </dl>

              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-base font-extrabold text-primary-950">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold tracking-[-0.03em] text-primary-950">
                    ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
              <div className="flex items-center gap-2">
                <MapPin
                  size={17}
                  className="text-accent-700"
                  aria-hidden="true"
                />

                <h2 className="text-base font-extrabold text-primary-950">
                  Shipping address
                </h2>
              </div>

              <address className="mt-4 not-italic text-sm leading-6 text-text-muted">
                <p className="font-extrabold text-primary-950">
                  {address?.fullName || "Name unavailable"}
                </p>

                {address?.addressLine1 && <p>{address.addressLine1}</p>}
                {address?.addressLine2 && <p>{address.addressLine2}</p>}

                {(address?.city || address?.state || address?.postalCode) && (
                  <p>
                    {[address?.city, address?.state, address?.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {address?.country && <p>{address.country}</p>}

                {address?.phone && (
                  <p className="mt-2 font-semibold text-primary-900">
                    {address.phone}
                  </p>
                )}
              </address>
            </section>

            <section className="rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
              <div className="flex items-center gap-2">
                <CreditCard
                  size={17}
                  className="text-accent-700"
                  aria-hidden="true"
                />

                <h2 className="text-base font-extrabold text-primary-950">
                  Payment
                </h2>
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-text-muted">Method</dt>

                  <dd className="text-right font-bold text-primary-950">
                    {formatPaymentMethod(order.paymentMethod)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-text-muted">Status</dt>

                  <dd>
                    <Badge variant={order.paymentStatus}>
                      {formatStatus(order.paymentStatus)}
                    </Badge>
                  </dd>
                </div>

                {order.paidAt && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-text-muted">Paid on</dt>

                    <dd className="text-right font-semibold text-primary-950">
                      {formatLongDate(order.paidAt)}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <div className="flex items-start gap-2.5 rounded-lg border border-border bg-surface-subtle px-4 py-3.5">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-green-700"
                aria-hidden="true"
              />

              <p className="text-xs leading-5 text-text-muted">
                This page shows the order information saved by MarketFlow at
                checkout.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function OrderItem({ item }) {
  return (
    <article className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:p-5">
      <div className="h-18 w-18 overflow-hidden rounded-md border border-border bg-white sm:h-22 sm:w-22">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain p-1.5"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-50 text-primary-300">
            <ShoppingBag size={25} strokeWidth={1.4} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-extrabold leading-6 text-primary-950">
          {item.name}
        </h3>

        <p className="mt-1 text-xs leading-5 text-text-muted sm:text-sm">
          Quantity {item.quantity} × ₹
          {Number(item.price || 0).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="col-span-2 flex items-center justify-between border-t border-border pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
        <span className="text-xs font-medium text-text-soft sm:hidden">
          Item total
        </span>

        <p className="text-base font-extrabold text-primary-950">
          ₹{Number(item.subtotal || 0).toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
}

function StatusSummary({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-surface-subtle px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-accent-700">
        <Icon size={17} aria-hidden="true" />
      </span>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">
          {label}
        </p>

        <p className="mt-1 text-sm font-extrabold text-primary-950">{value}</p>
      </div>
    </div>
  );
}

function PriceRow({ label, value, valueClassName = "text-primary-950" }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>

      <dd className={`shrink-0 font-semibold ${valueClassName}`}>{value}</dd>
    </div>
  );
}

function formatLongDate(dateValue) {
  if (!dateValue) {
    return "Date unavailable";
  }

  return new Date(dateValue).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPaymentMethod(method) {
  if (!method) {
    return "Unavailable";
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

export default OrderDetailPage;
