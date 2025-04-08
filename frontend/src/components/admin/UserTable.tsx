import React from "react";
import { FiTrash2 } from "react-icons/fi";

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface UserTableProps {
  users: User[];
  onToggleAdmin: (userId: string, currentStatus: boolean) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onToggleAdmin, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.isAdmin ? "Admin" : "User"}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => onToggleAdmin(user._id, user.isAdmin)}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700 mr-2"
                >
                  {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                </button>
                <button
                  onClick={() => onDelete(user._id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
