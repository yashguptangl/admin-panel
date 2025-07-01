"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function VerifiedRoom() {
    const router = useRouter();
    const [Verified, setVerified] = useState<Room[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    interface Room {
        id: number;
        city: string;
        townSector: string;
        BHK: string;
        verifiedByAdminOrAgent: string;
        location: string;
        listingShowNo: string;
        owner?: {
            id: number;
            username: string;
            mobile: string;
            email: string;
        };
    }

    useEffect(() => {
        const fetchVerifiedRooms = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/admin/verified-room`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.getItem("token"),
                    },
                });
                setVerified(response.data.verifiedProperty);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    console.log("Authorization error: You are not authorized to view this page.");
                    alert("You are not authorized to view this page. Please log in as an admin.");
                } else {
                    console.log("Error fetching owner:", error);
                }
            }
        }
        fetchVerifiedRooms();
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
                    {/* Agent Table */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-center flex-1">Verified Room List</h2>
                        <input
                            type="text"
                            placeholder="Search by Name or Mobile"
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
                                    <th className="border p-2 text-left">Owner Name</th>
                                    <th className="border p-2 text-left">City</th>
                                    <th className="border p-2 text-left">Town Sector</th>
                                    <th className="border p-2 text-left">BHK</th>
                                    <th className="border p-2 text-left">Verified on</th>
                                    <th className="border p-2 text-left">Location</th>
                                    <th className="border p-2 text-left">Mobile</th>
                                    <th className="border p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Verified
                                    .filter(room =>
                                        room.owner?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        room.owner?.mobile?.includes(searchTerm)
                                    )
                                    .length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="border p-2 text-center">
                                            No records found.
                                        </td>
                                    </tr>
                                ) : (
                                    Verified
                                        .filter(room =>
                                            room.owner?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            room.owner?.mobile?.includes(searchTerm)
                                        )
                                        .map((room, index) => (
                                            <tr key={room.id} className="hover:bg-gray-100">
                                                <td className="border p-2">{index + 1}</td>
                                                <td className="border p-2">{room.owner?.username || "-"}</td>
                                                <td className="border p-2">{room.city}</td>
                                                <td className="border p-2">{room.townSector}</td>
                                                <td className="border p-2">{room.BHK}</td>
                                                <td className="border p-2">{new Date(room.verifiedByAdminOrAgent).toLocaleDateString()}</td>
                                                <td className="border p-2">{room.location}</td>
                                                <td className="border p-2">{room.owner?.mobile || "-"}</td>
                                                <td className="border p-2 text-center">
                                                    <button
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                        onClick={() => {
                                                            router.push(`/verified-room/id?id=${room.id}`);
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