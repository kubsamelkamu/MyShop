import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import UserTable, { User } from "@/components/admin/UserTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers, toggleAdminStatus, deleteUser } from "@/store/slices/userSlice";
import { toast } from "react-toastify";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return users.filter(
      (user: User) =>
        user.name.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower)
    );
  }, [users, searchTerm]);

  const handleToggleAdmin = (userId: string, currentStatus: boolean) => {
    dispatch(toggleAdminStatus({ userId, isAdmin: !currentStatus }))
      .unwrap()
      .then((updatedUser: User) => {
        toast.success(
          updatedUser.isAdmin ? "User promoted to Admin!" : "Admin rights revoked!"
        );
      })
      .catch((err) => {
        console.error("Failed to update user role:", err);
        toast.error("Failed to update user role: " + err);
      });
  };

  const handleDelete = (userId: string) => {
    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => {
        toast.success("User deleted successfully!");
      })
      .catch((err) => {
        console.error("Failed to delete user:", err);
        toast.error("Failed to delete user: " + err);
      });
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <UserTable users={filteredUsers} onToggleAdmin={handleToggleAdmin} onDelete={handleDelete} />
      </div>
    </AdminLayout>
  );
};

export default Users;
