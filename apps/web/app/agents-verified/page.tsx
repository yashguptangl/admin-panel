"use client";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminAgentTable() {
  interface Agent {
    id: number;
    username: string;
    mobile: string;
    email: string;
    agentId: string;
    isKYCVerified: boolean;
    isVerifiedByAdmin: boolean;
  }

  const [VerifiedAgents, setVerifiedAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchVerifiedAgents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/admin/agents-verified`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });
        setVerifiedAgents(response.data.agents);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          console.log("Authorization error: You are not authorized to view this page.");
          alert("You are not authorized to view this page. Please log in as an admin.");
        } else {
          console.log("Error fetching owner:", error);
        }
      }
    };

    fetchVerifiedAgents();
  }, []);

  return (
    <>
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-0.5/4 min-h-screen bg-gray-800 text-white">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6">
          {/* Agent Table */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-center flex-1">Verified Agent List</h2>
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
                  <th className="border p-2 text-left">Mobile No</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Agent ID</th>
                  <th className="border p-2 text-left">KYC Verified</th>
                  <th className="border p-2 text-left">Admin Verified</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {VerifiedAgents.length === 0 ? (
                  <tr>
                  <td colSpan={8} className="border p-2 text-center">
                    No records found.
                  </td>
                  </tr>
                ) : (
                  VerifiedAgents.
                  filter(agent =>
                    agent.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.mobile.includes(searchTerm) || 
                    agent.agentId.includes(searchTerm) ||
                    agent.isKYCVerified.toString().includes(searchTerm) ||
                    agent.isVerifiedByAdmin.toString().includes(searchTerm)
                  )
                  .map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-100">
                    <td className="border p-2">{agent.id}</td>
                    <td className="border p-2">{agent.username}</td>
                    <td className="border p-2">{agent.mobile}</td>
                    <td className="border p-2">{agent.email}</td>
                    <td className="border p-2">{agent.agentId}</td>
                    <td className="border p-2 text-center">
                    {agent.isKYCVerified ? "✅ Yes" : "❌ No"}
                    </td>
                    <td className="border p-2 text-center">
                    {agent.isVerifiedByAdmin ? "✅ Yes" : "❌ No"}
                    </td>
                    <td className="border p-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        router.push(`/agents-verified/agentId?agentId=${agent.agentId}`);
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
  );
}
