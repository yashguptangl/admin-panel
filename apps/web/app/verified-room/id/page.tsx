"use client";
import React, { useEffect, useState , Suspense} from "react";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import axios from "axios";
import { RoomData } from "../../types/data";
import Image from "next/image";
import { useSearchParams } from "next/navigation";


function FullVerifiedDetailsRoom() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      setError("No ID provided in the URL.");
      setLoading(false);
      return;
    }

    async function fetchRoomDetails() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/admin/verified-room-full-details?id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          }
        );
        if (response.data && response.data.room) {
          setData(response.data);
        } else {
          setError("No data found for the given ID.");
        }
      } catch (err) {
        setError("Error fetching room details.");
      } finally {
        setLoading(false);
      }
    }

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-xl">No data found</div>
      </div>
    );
  }

  const { room, owner, images } = data;

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString("en-IN");
  };

  const renderAmenities = (amenities: string[]) => (
    <div className="flex flex-wrap gap-2">
      {amenities.map((item, index) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
        >
          {item}
        </span>
      ))}
    </div>
  );

  // Convert images object to array for easier mapping
  const imageArray = [
    { label: "Front View", url: images.front },
    { label: "Inside View", url: images.inside },
    { label: "Lobby", url: images.lobby },
    { label: "Kitchen", url: images.kitchen },
    { label: "Toilet", url: images.toilet },
    { label: "Bathroom", url: images.bathroom },
  ];

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-200">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {room.Type} in {room.location}, {room.city} {room.townSector}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {room.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pricing Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Pricing Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-r border-gray-200 pr-4">
                      <p className="text-sm text-gray-800">Price Range</p>
                      <p className="text-lg font-semibold">
                        ₹{formatPrice(room.MinPrice)} - ₹{formatPrice(room.MaxPrice)}
                      </p>
                    </div>
                    <div className="border-r border-gray-200 pr-4">
                      <p className="text-sm text-gray-800">Security Deposit</p>
                      <p className="text-lg font-semibold">
                        ₹{formatPrice(room.security)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Maintenance</p>
                      <p className="text-lg font-semibold">
                        ₹{formatPrice(room.maintenance)}/month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Room Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Room Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-800">Contact</p>
                      <p className="font-medium">{room.listingShowNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">BHK</p>
                      <p className="font-medium">{room.BHK}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Furnishing</p>
                      <p className="font-medium">{room.furnishingType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Accommodation Type</p>
                      <p className="font-medium">{room.accomoType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Offer</p>
                      <p className="font-medium">{room.Offer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Total Floors</p>
                      <p className="font-medium">{room.totalFloor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Total Rooms</p>
                      <p className="font-medium">{room.totalRoom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Water Supply in hr</p>
                      <p className="font-medium">{room.waterSupply}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Power Backup in hr</p>
                      <p className="font-medium">{room.powerBackup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Notice Period in m</p>
                      <p className="font-medium">{room.noticePeriod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Room Type</p>
                      <p className="font-medium">{room.roomType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Room Available</p>
                      <p className="font-medium">{room.RoomAvailable}</p>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Location Details
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-800">Full Address</p>
                      <p className="font-medium">{room.adress}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-800">Location</p>
                        <p className="font-medium">{room.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">Landmark</p>
                        <p className="font-medium">{room.landmark}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-800">City</p>
                        <p className="font-medium">{room.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">Town/Sector</p>
                        <p className="font-medium">{room.townSector}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Owner Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Owner Details
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-800">Name</p>
                      <p className="font-medium">{owner.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Email</p>
                      <p className="font-medium">{owner.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Mobile</p>
                      <p className="font-medium">{owner.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Amenities
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        Inside Room
                      </h3>
                      {renderAmenities(room.roomInside)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        Outside Room
                      </h3>
                      {renderAmenities(room.roomOutside)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        Parking
                      </h3>
                      {renderAmenities(room.parking)}
                    </div>
                  </div>
                </div>

                {/* Tenant Preferences */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Tenant Preferences
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-800">Preferred Tenants</p>
                      <p className="font-medium">
                        {room.preferTenants.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Gender Preference</p>
                      <p className="font-medium">{room.genderPrefer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Care Taker</p>
                      <p className="font-medium">{room.careTaker}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Image Gallery Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 mt-3">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Property Images
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {/* Main Image */}
                <div className="flex flex-col gap-4">
                  {/* Main Image */}
                  <a
                    href={imageArray[activeImageIndex]?.url || "/placeholder.png"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-md mx-auto"
                  >
                    <Image
                      src={imageArray[activeImageIndex]?.url || "/placeholder.png"}
                      alt={imageArray[activeImageIndex]?.label || "Property Image"}
                      className="w-full h-56 object-cover rounded-lg border"
                      width={400}
                      height={224}
                    />
                    <div className="mt-2 text-center text-sm text-gray-700">
                      {imageArray[activeImageIndex]?.label || "Property Image"}
                    </div>
                  </a>
                  {/* Thumbnails */}
                  <div className="flex gap-2 justify-center">
                    {imageArray.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`border rounded-md overflow-hidden w-16 h-16 p-0 ${
                          activeImageIndex === index ? "ring-2 ring-blue-500" : ""
                        }`}
                        type="button"
                      >
                        <Image
                          src={image?.url || "/placeholder.png"}
                          alt={image?.label || "Property Image"}
                          className="object-cover w-full h-full"
                          width={64}
                          height={64}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
               <div className="flex justify-end">
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const VerifiedRoomDetailsPage = () => (
  <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
    <FullVerifiedDetailsRoom />
  </Suspense>
);

export default VerifiedRoomDetailsPage;