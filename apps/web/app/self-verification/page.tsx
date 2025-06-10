"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import VerifiedRequestItem from "../types/verification"; // Adjust the import path as necessary

export default function SelfVerified() {
    const router = useRouter();
    const [selfVerified, setSelfVerified] = useState<VerifiedRequestItem[]>([]);

    useEffect(() => {
    const fetchSelfVerified = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/v1/admin/not-selfverifiedProperty", {
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
                    <h2 className="text-xl font-semibold mb-4 text-center">Self Verification List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border p-2 text-left">#</th>
                                    <th className="border p-2 text-left">Listing Type</th>
                                    <th className="border p-2 text-left">City</th>
                                    <th className="border p-2 text-left">Town Sector</th>
                                    <th className="border p-2 text-left">Location</th>
                                    <th className="border p-2 text-left">Listing Show No</th>
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
                                    selfVerified.map((self, index) => (
                                        <tr key={self.id} className="hover:bg-gray-100">
                                            <td className="border p-2">{index + 1}</td>
                                            <td className="border p-2 capitalize">{self.listingType}</td>
                                            <td className="border p-2">{self.city}</td>
                                            <td className="border p-2">{self.townSector}</td>
                                            <td className="border p-2">{self.location}</td>
                                            <td className="border p-2">{self.listingShowNo}</td>
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
            <Footer />
        </>
    )
}