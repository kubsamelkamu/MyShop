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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);


  const totalPages = Math.ceil(filteredUsers.length / pageSize);

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <UserTable
          users={paginatedUsers}
          onToggleAdmin={handleToggleAdmin}
          onDelete={handleDelete}
        />
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-l disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1 border-t border-b">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
