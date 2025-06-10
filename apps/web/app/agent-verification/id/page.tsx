"use client";
import React, { useEffect, useState } from "react";
import PropertyDetailsCardAgent from "../../components/PropertyDetailsAgent";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { PropertyDetails } from "../../types/propertyDetail";
import { Owner } from "../../types/propertyDetail";


const AgentVerificationDetailsPage = () => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchDetails() {
      try {
        const id = searchParams.get("id");
        const ownerId = searchParams.get("ownerId") || "";
        const listingType = searchParams.get("listingType") || "";
        const listingId = searchParams.get("listingId") || "";
        const agentId = searchParams.get("agentId") || "";

        const response = await axios.post(
          `http://localhost:3001/api/v1/admin/agentverifiedProperty-details/?id=${id}&ownerId=${ownerId}&listingType=${listingType}&listingId=${listingId}&agentId=${agentId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          }
        );
        if (response.data.details && response.data.details.length > 0) {
          setProperty(response.data.details[0]);
          localStorage.setItem("id" , id || "");
          localStorage.setItem("agentId" , agentId || "");
        }
        if (response.data.owner) {
          setOwner(response.data.owner);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [searchParams]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!property) return <div className="p-10 text-center text-red-500">No details found.</div>;

  // Pass property and owner to the card
  return <PropertyDetailsCardAgent property={property} owner={owner ?? undefined} />;
};

export default AgentVerificationDetailsPage;