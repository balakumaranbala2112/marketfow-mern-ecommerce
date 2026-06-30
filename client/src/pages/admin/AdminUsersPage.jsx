import { useAdminUsers, useBlockUser, useUnblockUser } from "../../features/admin/hooks/useAdmin.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import Badge from "../../components/common/Badge.jsx";
import useToastStore from "../../stores/toastStore.js";
import { UserX, UserCheck } from "lucide-react";

function AdminUsersPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { data: users, isLoading, refetch } = useAdminUsers();

  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();

  function handleBlock(userId) {
    blockMutation.mutate(userId, {
      onSuccess: () => {
        addToast({ type: "success", message: "User blocked successfully" });
        refetch();
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message || "Failed to block user" });
      },
    });
  }

  function handleUnblock(userId) {
    unblockMutation.mutate(userId, {
      onSuccess: () => {
        addToast({ type: "success", message: "User unblocked successfully" });
        refetch();
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message || "Failed to unblock user" });
      },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <p className="text-sm text-slate-400">View customer profiles and manage permissions</p>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map((user) => (
                <tr key={user._id} className="hover:bg-white/5">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                      {user.avatar?.url ? (
                        <img src={user.avatar.url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        user.name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={user.role}>{user.role}</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={user.isBlocked ? "blocked" : "active"}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never"}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {user.role !== "admin" && (
                      user.isBlocked ? (
                        <button
                          onClick={() => handleUnblock(user._id)}
                          disabled={unblockMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
                        >
                          <UserCheck size={12} /> Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(user._id)}
                          disabled={blockMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-xl bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                        >
                          <UserX size={12} /> Block
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No users found.
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

export default AdminUsersPage;
