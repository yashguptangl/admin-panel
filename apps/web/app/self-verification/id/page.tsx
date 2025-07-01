"use client";
import React, { useEffect, useState, Suspense } from "react";
import PropertyDetailsCard from "../../components/PropertyDetails";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { PropertyDetails } from "../../types/propertyDetail";
import { Owner } from "../../types/propertyDetail";

const SelfVerificationDetailsPageInner = () => {
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

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/admin/not-selfverifiedProperty-details/?id=${id}&ownerId=${ownerId}&listingType=${listingType}&listingId=${listingId}`,
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
          localStorage.setItem("id", id || "");
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

  return <PropertyDetailsCard property={property} owner={owner ?? undefined} />;
};

const SelfVerificationDetailsPage = () => (
  <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
    <SelfVerificationDetailsPageInner />
  </Suspense>
);

export default SelfVerificationDetailsPage;