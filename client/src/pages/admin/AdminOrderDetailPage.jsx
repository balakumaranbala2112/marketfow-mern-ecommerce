import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  LoaderCircle,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import {
  useAdminOrderDetail,
  useUpdateOrderStatus,
} from "../../features/admin/hooks/useAdmin.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";

import useToastStore from "../../stores/toastStore.js";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function AdminOrderDetailPage() {
  const { orderId } = useParams();

  const addToast = useToastStore((state) => state.addToast);

  const { data: order, isLoading, refetch } = useAdminOrderDetail(orderId);

  const updateStatusMutation = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="py-20">
        <PageLoader />
      </div>
    );
  }

  if (!order) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 text-center shadow-[0_2px_8px_rgba(15,24,32,0.08)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-400">
            <Package size={26} aria-hidden="true" />
          </span>

          <h1 className="mt-4 text-2xl font-extrabold text-primary-950">
            Order not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            This order may have been removed or the identifier may be invalid.
          </p>

          <Link
            to="/admin/orders"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-bold text-primary-950 transition hover:bg-accent-300"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to orders
          </Link>
        </div>
      </section>
    );
  }

  const address = order.shippingAddress;
  const orderNumber = order._id.slice(-8).toUpperCase();
  const isFinalStatus =
    order.orderStatus === "delivered" || order.orderStatus === "cancelled";

  function handleStatusChange(event) {
    const nextStatus = event.target.value;

    if (!nextStatus || nextStatus === order.orderStatus) {
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId,
        orderStatus: nextStatus,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: `Order status updated to ${formatStatus(nextStatus)}`,
          });

          refetch();
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error.message || "Failed to update order status",
          });
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 transition hover:text-blue-800 hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to orders
      </Link>

      <header className="rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
              Order management
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
                Order #{orderNumber}
              </h1>

              <Badge variant={order.orderStatus}>
                {formatStatus(order.orderStatus)}
              </Badge>

              <Badge variant={order.paymentStatus}>
                {formatStatus(order.paymentStatus)}
              </Badge>
            </div>

            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-text-muted">
              <CalendarDays size={16} aria-hidden="true" />
              Placed on {formatLongDate(order.createdAt)}
            </p>
          </div>

          <div className="w-full max-w-xs">
            <label
              htmlFor="update-order-status"
              className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.1em] text-text-soft"
            >
              Update order status
            </label>

            <div className="relative">
              <select
                id="update-order-status"
                value={order.orderStatus}
                onChange={handleStatusChange}
                disabled={updateStatusMutation.isPending || isFinalStatus}
                className="min-h-[44px] w-full rounded-md border border-border-strong bg-white px-3.5 pr-10 text-sm font-semibold text-primary-950 outline-none focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)] disabled:cursor-not-allowed disabled:bg-primary-50 disabled:text-text-soft"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>

              {updateStatusMutation.isPending && (
                <LoaderCircle
                  size={17}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary-600"
                  aria-hidden="true"
                />
              )}
            </div>

            {isFinalStatus && (
              <p className="mt-2 text-xs leading-5 text-text-muted">
                Delivered and cancelled orders cannot be changed from this
                screen.
              </p>
            )}
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile
          icon={Package}
          label="Order status"
          value={formatStatus(order.orderStatus)}
        />

        <SummaryTile
          icon={CreditCard}
          label="Payment status"
          value={formatStatus(order.paymentStatus)}
        />

        <SummaryTile
          icon={ShoppingBag}
          label="Items"
          value={`${order.orderItems?.length || 0}`}
        />

        <SummaryTile
          icon={Truck}
          label="Shipping"
          value={
            Number(order.shippingPrice) === 0
              ? "Free"
              : formatCurrency(order.shippingPrice)
          }
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
          <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-5 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-primary-950">
                Order items
              </h2>

              <p className="mt-1 text-xs text-text-muted">
                Products and quantities included in this order.
              </p>
            </div>

            <span className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-bold text-primary-700">
              {order.orderItems?.length || 0} items
            </span>
          </div>

          <div className="divide-y divide-border">
            {order.orderItems?.map((item, index) => (
              <OrderItem key={`${item.name}-${index}`} item={item} />
            ))}
          </div>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <InformationCard icon={CreditCard} title="Price details">
            <dl className="space-y-3 text-sm">
              <PriceRow
                label="Items total"
                value={formatCurrency(order.itemsPrice)}
              />

              {Number(order.discountPrice) > 0 && (
                <PriceRow
                  label="Discount"
                  value={`−${formatCurrency(order.discountPrice)}`}
                  valueClassName="text-green-700"
                />
              )}

              <PriceRow
                label="Shipping"
                value={
                  Number(order.shippingPrice) === 0
                    ? "Free"
                    : formatCurrency(order.shippingPrice)
                }
                valueClassName={
                  Number(order.shippingPrice) === 0
                    ? "text-green-700"
                    : undefined
                }
              />
            </dl>

            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-extrabold text-primary-950">Total</span>

                <span className="text-2xl font-extrabold tracking-[-0.03em] text-primary-950">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </InformationCard>

          <InformationCard icon={UserRound} title="Customer">
            <div className="text-sm leading-6 text-text-muted">
              <p className="font-extrabold text-primary-950">
                {order.user?.name || "Deleted user"}
              </p>

              <p>{order.user?.email || "Email unavailable"}</p>

              {order.user?.phone && (
                <p className="mt-1 font-semibold text-primary-900">
                  {order.user.phone}
                </p>
              )}
            </div>
          </InformationCard>

          <InformationCard icon={MapPin} title="Shipping address">
            <address className="not-italic text-sm leading-6 text-text-muted">
              <p className="font-extrabold text-primary-950">
                {address?.fullName || "Name unavailable"}
              </p>

              {address?.addressLine1 && <p>{address.addressLine1}</p>}
              {address?.addressLine2 && <p>{address.addressLine2}</p>}

              {(address?.city || address?.state || address?.postalCode) && (
                <p>
                  {[address.city, address.state, address.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {address?.country && <p>{address.country}</p>}

              {address?.phone && (
                <p className="mt-1 font-semibold text-primary-900">
                  {address.phone}
                </p>
              )}
            </address>
          </InformationCard>

          <InformationCard icon={CreditCard} title="Payment">
            <dl className="space-y-3 text-sm">
              <InfoRow
                label="Method"
                value={formatPaymentMethod(order.paymentMethod)}
              />

              <div className="flex items-center justify-between gap-4">
                <dt className="text-text-muted">Status</dt>

                <dd>
                  <Badge variant={order.paymentStatus}>
                    {formatStatus(order.paymentStatus)}
                  </Badge>
                </dd>
              </div>

              {order.paidAt && (
                <InfoRow label="Paid on" value={formatLongDate(order.paidAt)} />
              )}
            </dl>
          </InformationCard>

          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-surface-subtle px-4 py-3.5">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-green-700"
              aria-hidden="true"
            />

            <p className="text-xs leading-5 text-text-muted">
              Status updates should reflect the order&apos;s actual fulfilment
              progress.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value }) {
  return (
    <article className="rounded-lg border border-border bg-white p-4 shadow-[0_1px_4px_rgba(15,24,32,0.05)]">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
          <Icon size={17} aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">
            {label}
          </p>

          <p className="mt-1 truncate font-extrabold text-primary-950">
            {value}
          </p>
        </div>
      </div>
    </article>
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
            <ShoppingBag size={25} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-extrabold leading-6 text-primary-950">
          {item.name}
        </h3>

        <p className="mt-1 text-xs leading-5 text-text-muted sm:text-sm">
          Quantity {item.quantity} × {formatCurrency(item.price)}
        </p>
      </div>

      <div className="col-span-2 flex items-center justify-between border-t border-border pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
        <span className="text-xs font-medium text-text-soft sm:hidden">
          Item total
        </span>

        <p className="font-extrabold text-primary-950">
          {formatCurrency(item.subtotal)}
        </p>
      </div>
    </article>
  );
}

function InformationCard({ icon: Icon, title, children }) {
  return (
    <section className="rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
      <div className="flex items-center gap-2">
        <Icon size={17} className="text-accent-700" aria-hidden="true" />

        <h2 className="text-base font-extrabold text-primary-950">{title}</h2>
      </div>

      <div className="mt-4">{children}</div>
    </section>
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

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>

      <dd className="text-right font-semibold text-primary-950">{value}</dd>
    </div>
  );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatLongDate(value) {
  if (!value) return "Date unavailable";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPaymentMethod(value) {
  if (!value) return "Unavailable";

  return value.replace(/[_-]/g, " ").toUpperCase();
}

function formatStatus(value) {
  if (!value) return "Unknown";

  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default AdminOrderDetailPage;
