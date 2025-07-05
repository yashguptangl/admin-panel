"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import axios from 'axios';
import VerifiedRequestItem from "../types/verification"; // Adjust the import path as necessary

export default function SelfVerified() {
    const [selfVerified, setSelfVerified] = useState<VerifiedRequestItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
    const fetchSelfVerified = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/admin/not-selfverifiedProperty`, {
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.getItem("token"),
                },
            });
            // Support both array and object response
            const arr = Array.isArray(response.data)
                ? response.data
                : response.data.selfverifiedProperty || [];
            setSelfVerified(arr);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                console.log("Authorization error: You are not authorized to view this page.");
                alert("You are not authorized to view this page. Please log in as an admin.");
            } else {
                console.log("Error fetching owner:", error);
            }
        }
    }
    fetchSelfVerified();
}, []);

    return (
        <>
            <Header />
            <div className="flex">
                {/* Sidebar */}
                <div className="w-1/4 min-h-screen text-white">
                    <Sidebar />
                </div>
                {/* Main Content */}
                <div className="flex-grow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-center flex-1">Self Verification List</h2>
                        <input
                            type="text"
                            placeholder="Search "
                            className="w-56 p-2 border border-gray-700 placeholder-gray-800 rounded ml-4"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border p-2 text-left">#</th>
                                    <th className="border p-2 text-left">Listing Type</th>
                                    <th className="border p-2 text-left">Owner Name</th>
                                    <th className="border p-2 text-left">City</th>
                                    <th className="border p-2 text-left">Town Sector</th>
                                    <th className="border p-2 text-left">Location</th>
                                    <th className="border p-2 text-left">Owner Contact No</th>
                                    <th className="border p-2 text-left">Status</th>
                                    <th className="border p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selfVerified.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="border p-2 text-center">
                                            No records found.
                                        </td>
                                    </tr>
                                ) : (
                                    selfVerified.
                                    filter(self =>
                                        self.owner?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        self.owner?.mobile?.includes(searchTerm) ||
                                        self.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        self.townSector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        self.location?.toLowerCase().includes(searchTerm.toLowerCase()) 
                                    ).
                                    map((self, index) => (
                                        <tr key={self.id} className="hover:bg-gray-100">
                                            <td className="border p-2">{index + 1}</td>
                                            <td className="border p-2 capitalize">{self.listingType}</td>
                                            <td className="border p-2">{self.owner?.username || "-"}</td>
                                            <td className="border p-2">{self.city}</td>
                                            <td className="border p-2">{self.townSector}</td>
                                            <td className="border p-2">{self.location}</td>
                                            <td className="border p-2">{self.owner?.mobile}</td>
                                            <td className="border p-2">{self.status}</td>
                                            <td className="border p-2 text-center">
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                    onClick={() => {
                                                        window.open(
                                                            `/self-verification/id?id=${self.id}&ownerId=${self.ownerId}&listingType=${self.listingType}&listingId=${self.listingId}`,
                                                        );
                                                    }}
                                                >
                                                    Open
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}