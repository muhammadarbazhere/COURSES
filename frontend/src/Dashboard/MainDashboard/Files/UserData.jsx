import React, { useEffect, useState } from "react";
import { FaClipboardUser } from "react-icons/fa6";
import { useSelector } from "react-redux";

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.auth.token); // ✅ Get token from Redux

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/route/allUsers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Correct way
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    const user = users.find((u) => u._id === userId);
    const confirmationMessage = `Are you sure you want to change ${user.firstName} ${user.lastName}'s role to ${newRole}?`;
    const isConfirmed = window.confirm(confirmationMessage);

    if (!isConfirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/route/updateUserRole`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Auth header added
          },
          body: JSON.stringify({ userId, newRole }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? updatedUser.user : u))
        );
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      setError(error.message);
    }
  };

  return (
    <div className="ml-24 sm:ml-56 h-dvh">
      <div className="bg-blue-100 mt-8 p-4 font-[Chivo]">
        <div className="font-bold text-lg flex gap-1 items-center">
          <FaClipboardUser size={20} />
          <h1>All Users</h1>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <table className="w-full mt-4">
          <thead>
            <tr className="bg-gray-200 text-center font-bold">
              <th className="p-2">NAME</th>
              <th className="p-2">EMAIL</th>
              <th className="p-2">ROLE</th>
              <th className="p-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="bg-white text-center">
                <td className="p-2">{`${user.firstName} ${user.lastName}`}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <button
                    className={`w-24 p-2 rounded cursor-default ${
                      user.role === "admin"
                        ? "border-green-500 border"
                        : "border-blue-500 border"
                    } text-black`}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() =>
                      handleRoleChange(
                        user._id,
                        user.role === "admin" ? "user" : "admin"
                      )
                    }
                    className="bg-yellow-500 hover:bg-yellow-700 duration-700 text-white p-2 w-28 rounded"
                  >
                    Make {user.role === "admin" ? "user" : "admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserData;
