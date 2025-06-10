"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function NotVerifiedFlat() {
    const router = useRouter();
    const [notVerified, setNotVerified] = useState<HourlyRoom[]>([]);
    interface HourlyRoom {
        id: number;
        city: string;
        townSector: string;
        MinPrice: string;
        MaxPrice: string;
        listingShowNo: string;
        location: string;
    }

    useEffect(() => {
        const fetchNotVerifiedHourlyRooms = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/v1/admin/not-verified-hourlyroom", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.getItem("token"),
                    },
                });
                setNotVerified(response.data.notverifiedProperty);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    console.log("Authorization error: You are not authorized to view this page.");
                    alert("You are not authorized to view this page. Please log in as an admin.");
                } else {
                    console.log("Error fetching owner:", error);
                }
            }
        }
        fetchNotVerifiedHourlyRooms();
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
                    <h2 className="text-xl font-semibold mb-4 text-center">Not Verified HourlyRoom List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border p-2 text-left">Sr No</th>
                                    <th className="border p-2 text-left">City</th>
                                    <th className="border p-2 text-left">Town Sector</th>
                                    <th className="border p-2 text-left">Min Price</th>
                                    <th className="border p-2 text-left">Max Price</th>
                                    <th className="border p-2 text-left">Location</th>
                                    <th className="border p-2 text-left">Mobile</th>
                                    <th className="border p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notVerified.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="border p-2 text-center">
                                            No records found.
                                        </td>
                                    </tr>
                                ) : (
                                    notVerified.map((hourlyroom, index) => (
                                        <tr key={hourlyroom.id} className="hover:bg-gray-100">
                                            <td className="border p-2">{index + 1}</td>
                                            <td className="border p-2">{hourlyroom.city}</td>
                                            <td className="border p-2">{hourlyroom.townSector}</td>
                                            <td className="border p-2">{hourlyroom.MinPrice}</td>
                                            <td className="border p-2">{hourlyroom.MaxPrice}</td>
                                            <td className="border p-2">{hourlyroom.location}</td>
                                            <td className="border p-2">{hourlyroom.listingShowNo}</td>

                                            <td className="border p-2 text-center">
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                    onClick={() => {
                                                        router.push(`/not-verified-hourlyroom/${hourlyroom.id}`);
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