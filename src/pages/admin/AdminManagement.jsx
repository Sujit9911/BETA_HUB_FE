import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function AdminManagement() {
  const { isAdmin } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const [adminsRes, membersRes] = await Promise.all([
        axiosInstance.get("/admin/admins"),
        axiosInstance.get("/admin/members"),
      ]);

      setAdmins(adminsRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const makeAdmin = async (id) => {
    if (!confirm("Make this user an admin?")) return;

    setActionLoading(id);
    setError("");

    try {
      await axiosInstance.put(`/admin/users/${id}/make-admin`);
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to promote user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const removeAdmin = async (id) => {
    if (!confirm("Remove admin privileges from this user?")) return;

    setActionLoading(id);
    setError("");

    try {
      await axiosInstance.put(`/admin/users/${id}/remove-admin`);
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to remove admin"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (user) => {
    if (
      !confirm(
        `Delete ${user.name}'s account permanently?`
      )
    ) {
      return;
    }

    setActionLoading(user.id);
    setError("");

    try {
      await axiosInstance.delete(`/admin/users/${user.id}`);
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Admin Management
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage administrators and registered BETA members
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading users...</p>
      ) : (
        <div className="space-y-8">

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Administrators
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Users with administrative access
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                {admins.length} Admin{admins.length !== 1 ? "s" : ""}
              </span>
            </div>

            {admins.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                No administrators found.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {admins.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    type="admin"
                    loading={actionLoading === user.id}
                    onRemoveAdmin={removeAdmin}
                    onDelete={deleteUser}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Members
                </h2>

            <p className="text-sm text-slate-400 mt-1">
  Registered BETA accounts
</p>
              </div>

              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                {members.length} Member{members.length !== 1 ? "s" : ""}
              </span>
            </div>

            {members.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                No members found.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {members.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    type="member"
                    loading={actionLoading === user.id}
                    onMakeAdmin={makeAdmin}
                    onDelete={deleteUser}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

function UserCard({
  user,
  type,
  loading,
  onMakeAdmin,
  onRemoveAdmin,
  onDelete,
}) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200">

      <div className="flex items-start gap-4">

        <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-bold">
          {initials}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-900 dark:text-white">
              {user.name}
            </p>

            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                type === "admin"
                  ? "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30"
                  : "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30"
              }`}
            >
              {type === "admin" ? "ADMIN" : "MEMBER"}
            </span>
          </div>

          <p className="text-sm text-slate-400 truncate mt-1">
            {user.email}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 dark:text-slate-400">
            {user.branch && (
              <span>{user.branch}</span>
            )}

            {user.year && (
              <span>{user.year}</span>
            )}

            {user.prnNumber && (
              <span>PRN: {user.prnNumber}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">

        {type === "member" && (
          <button
            onClick={() => onMakeAdmin(user.id)}
            disabled={loading}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-950/60 hover:border-blue-300 dark:hover:border-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Make Admin"}
          </button>
        )}

        {type === "admin" && (
          <button
            onClick={() => onRemoveAdmin(user.id)}
            disabled={loading}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:border-amber-300 dark:hover:border-amber-700 transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Remove Admin"}
          </button>
        )}

        <button
          onClick={() => onDelete(user)}
          disabled={loading}
          className="px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-100 dark:hover:border-red-900/40 transition-all disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}