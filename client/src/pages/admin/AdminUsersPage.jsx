import { useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import {
  useAdminUsers,
  useBlockUser,
  useUnblockUser,
} from "../../features/admin/hooks/useAdmin.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";

import useToastStore from "../../stores/toastStore.js";

function AdminUsersPage() {
  const addToast = useToastStore((state) => state.addToast);

  const { data: users, isLoading, refetch } = useAdminUsers();

  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();

  const [activeUserAction, setActiveUserAction] = useState(null);

  const userList = Array.isArray(users) ? users : [];

  const activeUsers = userList.filter((user) => !user.isBlocked).length;

  const blockedUsers = userList.filter((user) => user.isBlocked).length;

  const adminUsers = userList.filter((user) => user.role === "admin").length;

  function handleBlock(userId) {
    setActiveUserAction({
      userId,
      action: "block",
    });

    blockMutation.mutate(userId, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "User blocked successfully",
        });

        refetch();
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message || "Failed to block user",
        });
      },
      onSettled: () => {
        setActiveUserAction(null);
      },
    });
  }

  function handleUnblock(userId) {
    setActiveUserAction({
      userId,
      action: "unblock",
    });

    unblockMutation.mutate(userId, {
      onSuccess: () => {
        addToast({
          type: "success",
          message: "User activated successfully",
        });

        refetch();
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message || "Failed to activate user",
        });
      },
      onSettled: () => {
        setActiveUserAction(null);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="py-20">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
            Account administration
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
            Users
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Review customer accounts and manage access status.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-text-muted">
          <Users size={16} className="text-accent-700" aria-hidden="true" />
          <strong className="font-extrabold text-primary-950">
            {userList.length}
          </strong>{" "}
          users
        </span>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Active accounts"
          value={activeUsers}
          icon={CheckCircle2}
          tone="success"
        />

        <SummaryCard
          label="Blocked accounts"
          value={blockedUsers}
          icon={UserX}
          tone="danger"
        />

        <SummaryCard
          label="Administrators"
          value={adminUsers}
          icon={ShieldCheck}
          tone="default"
        />
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
        <div className="border-b border-border bg-surface-subtle px-5 py-4">
          <h2 className="text-lg font-extrabold text-primary-950">
            User directory
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            Administrator accounts cannot be blocked from this screen.
          </p>
        </div>

        {userList.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-border bg-white">
                  <tr className="text-xs font-bold uppercase tracking-[0.08em] text-text-soft">
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Last login</th>
                    <th className="px-5 py-3.5">Registered</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {userList.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-primary-50/50"
                    >
                      <td className="px-5 py-4">
                        <UserIdentity user={user} />
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant={user.role}>
                          {formatStatus(user.role)}
                        </Badge>
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant={user.isBlocked ? "blocked" : "active"}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-xs text-text-muted">
                        {user.lastLoginAt
                          ? formatDateTime(user.lastLoginAt)
                          : "Never"}
                      </td>

                      <td className="px-5 py-4 text-xs text-text-muted">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {user.role === "admin" ? (
                          <span className="text-xs font-semibold text-text-soft">
                            Protected
                          </span>
                        ) : (
                          <UserActionButton
                            user={user}
                            activeUserAction={activeUserAction}
                            onBlock={handleBlock}
                            onUnblock={handleUnblock}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-border md:hidden">
              {userList.map((user) => (
                <article key={user._id} className="p-4">
                  <UserIdentity user={user} />

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant={user.role}>{formatStatus(user.role)}</Badge>

                    <Badge variant={user.isBlocked ? "blocked" : "active"}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-border bg-surface-subtle p-3 text-xs">
                    <InfoStat
                      label="Last login"
                      value={
                        user.lastLoginAt
                          ? formatDate(user.lastLoginAt)
                          : "Never"
                      }
                    />

                    <InfoStat
                      label="Registered"
                      value={formatDate(user.createdAt)}
                    />
                  </dl>

                  {user.role === "admin" ? (
                    <div className="mt-4 rounded-md border border-border bg-primary-50 px-3 py-2.5 text-center text-xs font-semibold text-text-muted">
                      Administrator account is protected.
                    </div>
                  ) : (
                    <div className="mt-4">
                      <UserActionButton
                        user={user}
                        activeUserAction={activeUserAction}
                        onBlock={handleBlock}
                        onUnblock={handleUnblock}
                        fullWidth
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyUsers />
        )}
      </section>
    </div>
  );
}

function UserIdentity({ user }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {user.avatar?.url ? (
        <img
          src={user.avatar.url}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
        />
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-extrabold text-primary-700">
          {getInitial(user.name)}
        </span>
      )}

      <div className="min-w-0">
        <p className="truncate font-extrabold text-primary-950">
          {user.name || "Unnamed user"}
        </p>

        <p className="mt-0.5 max-w-[240px] truncate text-xs text-text-soft">
          {user.email || "Email unavailable"}
        </p>
      </div>
    </div>
  );
}

function UserActionButton({
  user,
  activeUserAction,
  onBlock,
  onUnblock,
  fullWidth = false,
}) {
  const isCurrentAction = activeUserAction?.userId === user._id;

  const isUnblocking =
    isCurrentAction && activeUserAction?.action === "unblock";

  const isBlocking = isCurrentAction && activeUserAction?.action === "block";

  if (user.isBlocked) {
    return (
      <button
        type="button"
        onClick={() => onUnblock(user._id)}
        disabled={Boolean(activeUserAction)}
        className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 text-xs font-bold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {isUnblocking ? (
          <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <UserCheck size={14} aria-hidden="true" />
        )}
        Activate
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onBlock(user._id)}
      disabled={Boolean(activeUserAction)}
      className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {isBlocking ? (
        <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
      ) : (
        <UserX size={14} aria-hidden="true" />
      )}
      Block
    </button>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  const tones = {
    success: "bg-green-50 text-green-700",
    danger: "bg-red-50 text-red-600",
    default: "bg-primary-50 text-primary-700",
  };

  return (
    <article className="rounded-lg border border-border bg-white p-4 shadow-[0_1px_4px_rgba(15,24,32,0.05)]">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${tones[tone]}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">
            {label}
          </p>

          <p className="mt-1 text-xl font-extrabold text-primary-950">
            {Number(value || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </article>
  );
}

function InfoStat({ label, value }) {
  return (
    <div>
      <dt className="font-semibold uppercase tracking-[0.08em] text-text-soft">
        {label}
      </dt>

      <dd className="mt-1 font-bold text-primary-950">{value}</dd>
    </div>
  );
}

function EmptyUsers() {
  return (
    <div className="px-5 py-16 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-400">
        <Users size={25} aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-extrabold text-primary-950">
        No users found
      </h3>

      <p className="mt-1 text-sm text-text-muted">
        Registered accounts will appear here.
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Unavailable";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "Unavailable";

  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export default AdminUsersPage;
