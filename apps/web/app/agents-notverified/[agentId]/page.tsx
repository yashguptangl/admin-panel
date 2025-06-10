"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import Footer from "../../components/footer";
import axios from "axios";
interface AgentData {
    agent: {
        id: number;
        username: string;
        email: string;
        mobile: string;
        agentId: string;
        isKYCVerified: boolean;
        isVerifiedByAdmin: boolean;
        Agentprogress: {
            data: {
                bankName: string;
                ifscCode: string;
                accountNumber: string;
                accountHolderName: string;
            };
        };
    };
    kycDocuments: {
        agentImage: string;
        aadharFront: string;
        aadharBack: string;
        pancard: string;
        passbook: string;
    };
}

interface AgentDetailsProps {
    params: { agentId: string };
}

export default function AgentDetails({ params }: AgentDetailsProps) {
    const { agentId } = params;
    const router = useRouter();
    const [agent, setAgent] = useState<AgentData["agent"] | null>(null);
    const [kycDocuments, setKycDocuments] = useState<AgentData["kycDocuments"] | null>(null);
    const [decoded , setDecoded] = useState<{ username: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = token.split('.')[1];
                if (payload) {
                    const jsonPayload = atob(payload);
                    const decoded = JSON.parse(jsonPayload);
                    setDecoded(decoded);
                    console.log("Decoded token:", decoded);
                } else {
                    console.error("Token payload is undefined.");
                }
            } catch (err) {
                console.error("Failed to decode token:", err);
            }
        }
        console.log("Decoded token:", decoded);
    }, []);


    useEffect(() => {
        if (!agentId) return;

        async function fetchAgentDetails() {
            try {
                const res = await fetch(`http://localhost:3001/api/v1/admin/agents/details/?id=${agentId}`, {
                    headers: {
                        token: localStorage.getItem("token") || "",
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch agent details: ${res.statusText}`);
                }

                const data: AgentData = await res.json();
                setAgent(data.agent);
                setKycDocuments(data.kycDocuments);
            } catch (error) {
                console.error("Error fetching agent details:", error);
            }
        }

        fetchAgentDetails();
    }, [agentId]);



    if (!agent || !kycDocuments) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 p-6 ml-64 bg-gray-50">
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-2xl font-bold text-gray-800">Loading agent details...</h1>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }
    async function onClick(event: React.MouseEvent<HTMLButtonElement>){
        try {
            const response = await fetch(`http://localhost:3001/api/v1/admin/agents/verify/?id=${agentId}&personverified=${decoded?.username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.getItem("token") || "",
                },

            });
            if(response.status === 200){
                alert("Agent verified successfully");
                router.push("/agents-notverified");
            }
        }catch (error) {
            console.log("Error verifying agent:", error);
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                console.log("Authorization error: You are not authorized to view this page.");
                alert("You are not authorized to view this page. Please log in as an admin.");
            }
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6  bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Agent Verification - {agent.username}
                            </h1>
                            <div className="flex gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        agent.isVerifiedByAdmin
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {agent.isVerifiedByAdmin ? "Verified" : "Pending Verification"}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        agent.isKYCVerified
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {agent.isKYCVerified ? "KYC Verified" : "KYC Pending"}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Agent Summary Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6 col-span-1">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={kycDocuments.agentImage}
                                        alt="Agent"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4"
                                    />
                                    <h2 className="text-xl font-semibold">Name: {agent.username}</h2>
                                    <p className="text-black text-sm">Email: {agent.email}</p>
                                    <p className="text-black text-sm mt-2">Agent ID: {agent.agentId}</p>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-evenly">
                                        <span className="text-black">Mobile: </span>
                                        <span className="font-medium">{agent.mobile}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Bank Details */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Bank Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: "Bank Name", value: agent.Agentprogress.data.bankName },
                                            { label: "Account Holder", value: agent.Agentprogress.data.accountHolderName },
                                            { label: "Account Number", value: agent.Agentprogress.data.accountNumber },
                                            { label: "IFSC Code", value: agent.Agentprogress.data.ifscCode },
                                        ].map((item, index) => (
                                            <div key={index}>
                                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                                    {item.label}
                                                </label>
                                                <div className="p-2 bg-gray-50 rounded-md text-gray-800">{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* KYC Documents */}
                                <div className="bg-white rounded-lg shadow-sm p-6"></div>
                                    <h2 className="text-lg font-semibold mb-4 pb-2 border-b">KYC Documents</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {[
                                            { label: "Agent Photo", key: "agentImage", url: kycDocuments.agentImage },
                                            { label: "Aadhar Front", key: "aadharFront", url: kycDocuments.aadharFront },
                                            { label: "Aadhar Back", key: "aadharBack", url: kycDocuments.aadharBack },
                                            { label: "PAN Card", key: "pancard", url: kycDocuments.pancard },
                                            { label: "Passbook", key: "passbook", url: kycDocuments.passbook },
                                        ].map((item) => (
                                            <div key={item.key} className="text-center">
                                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                                    {item.label}
                                                </label>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block"
                                                >
                                                    <img
                                                        src={item.url}
                                                        alt={item.label}
                                                        className="w-full h-32 object-contain rounded border border-gray-200 bg-gray-100 p-1 hover:shadow-md transition-shadow"
                                                    />
                                                </a>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
                                                >
                                                    View Full Size
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                        </div>

                        {/* Verification Actions */}
                        <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="submit"
                                    onClick={() => router.push("/agents-notverified")}
                                    className="px-6 py-2 bg-red-100 text-red-700 rounded-md border border-red-200 hover:bg-red-200 transition-colors"
                                >
                                    Reject Verification
                                </button>
                                <button
                                    type="submit"
                                    onClick={(event) => onClick(event)}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    Approve Verification
                                </button>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}