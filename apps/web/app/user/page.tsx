"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import axios from 'axios';

export default function AdminUserTable() {
  interface User {
    id: number;
    username: string;
    email: string;
    mobile: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/admin/users`, {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
        });
        setUsers(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          console.log("Authorization error: You are not authorized to view this page.");
          alert("You are not authorized to view this page. Please log in as an admin.");
        } else {
          console.error("Error fetching owner:", error);
        }
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 min-h-screen  text-white">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-center flex-1">User List</h2>
            <input
              type="text"
              placeholder="Search"
              className="w-56 p-2 border border-gray-700 placeholder-gray-800 rounded ml-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2 text-left">Sr No</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Mobile No</th>
                </tr>
              </thead>
              <tbody>
                {users.
                filter(user =>
                  user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.mobile.includes(searchTerm)
                ).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                    <td className="border p-2">{user.id}</td>
                    <td className="border p-2">{user.username}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.mobile}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
