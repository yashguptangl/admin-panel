"use client";
import React from 'react';
import Image from 'next/image';
import { PropertyDetails } from '../types/propertyDetail';
import Sidebar from './sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import { Owner } from '../types/propertyDetail';
import { useRouter } from 'next/navigation';

const PropertyDetailsPageAgent: React.FC<{ property: PropertyDetails , owner?:Owner }> = ({ property , owner }) => {
    const router = useRouter();
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleApprovePayment = async () => {
        const id = localStorage.getItem("id");
        try {
            const res = await fetch(
                `http://localhost:3001/api/v1/admin/agent-verified-complete?id=${id}&ownerId=${property.ownerId}&listingType=${property.Type.toLowerCase()}&listingId=${property.id}&agentId=${localStorage.getItem("agentId")}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.getItem("token") || "",
                    },
                }
            );
            const data = await res.json();
            if (res.ok) {
                alert("Agent Payment successfully completed!");
                router.push("/agent-verification");
            } else {
                alert(data.message || "Verification failed!");
            }
        } catch (err) {
            alert("Something went wrong!");
        }
    };

     const handleRejectPayment = async () => {
        const id = localStorage.getItem("id");
        try {
            const res = await fetch(
                `http://localhost:3001/api/v1/admin/agent-verified-not-pay?id=${id}&ownerId=${property.ownerId}&listingType=${property.Type.toLowerCase()}&listingId=${property.id}&agentId=${localStorage.getItem("agentId")}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.getItem("token") || "",
                    },
                }
            );
            const data = await res.json();
            if (res.ok) {
                alert("Property payment rejected !");
                router.push("/agent-verification");
            } else {
                alert(data.message || "Verification failed!");
            }
        } catch (err) {
            alert("Something went wrong!");
        }
    };

    // Helper to get address (for Flat/PG/Room/HourlyRoom)
    const getAddress = () =>
        property.Adress || property.adress || property.address || "-";

    // Helper to get bed count
    const getBedCount = () =>
        property.bedCount || property.BedCount || property.bedcount || property.totalRoom || property.totalPG || property.totalFlat || "-";

    // Helper to get inside amenities
    const getInsideAmenities = () =>
        property.PGInside || property.flatInside || property.roomInside || property.roominside || [];

    // Helper to get outside amenities
    const getOutsideAmenities = () =>
        property.PGOutside || property.flatOutside || property.roomOutside || property.roomoutside  || [];

    // Helper to get parking
    const getParking = () =>
        property.parking || [];

    // Helper to get preferred tenants
    const getPreferredTenants = () =>
        property.preferTenants || [];

    // Helper to get room type
    const getRoomType = () =>
        property.roomType || property.flatType || property.PGType || property.Type || "-";

    // Helper to get food available
    const getFoodAvailable = () =>
        property.foodAvailable !== undefined ? property.foodAvailable : property.foodavailable;

    // Helper to get manager/caretaker
    const getManager = () =>
        property.careTaker || property.manager || "-";

    // Helper to get images
    const getImages = () =>
        Array.isArray(property.images) ? property.images : [];

    const getAgentVerifiedImages = () =>
        Array.isArray(property.agentVerifiedImages) ? property.agentVerifiedImages : [];

    const renderSection = (title: string, content: React.ReactNode) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
            <div className="bg-gray-50 p-4 rounded-lg">{content}</div>
        </div>
    );

    const renderList = (items: string[] | undefined, title: string) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">{title}</h4>
                <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderImageGallery = (images: string[], title: string) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Image
                            src={img}
                            alt={`${title} ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderOwnerInfo = () => {
    if (!owner) return null;
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Owner Information</h3>
        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{owner.username}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{owner.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Mobile</p>
            <p className="font-medium">{owner.mobile}</p>
          </div>
          <div>
            <p className="text-gray-600">KYC Verified</p>
            <p className={`font-medium ${owner.isKYCVerified ? "text-green-600" : "text-red-600"}`}>
              {owner.isKYCVerified ? "Yes" : "No"}
            </p>
          </div>
          
        </div>
      </div>
    );
  };

    return (
        <>
            <Header />
            <div className="flex min-h-screen bg-gray-100">
                <div className="hidden md:block">
                    <Sidebar />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg mb-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-1">
                                        {property.Type} in {property.city}, {property.townSector}
                                    </h1>
                                    <p className="text-blue-100">{property.location}</p>
                                </div>
                                <div className="mt-4 md:mt-0 bg-blue-700/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    <p className="text-xl font-semibold">
                                        ₹{property.MinPrice} - ₹{property.MaxPrice}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Property Content */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                {/* Property Images */}
                                {getImages().length > 0 && renderImageGallery(getImages(), 'Property Images')}

                                {/* Basic Details */}
                                {renderSection('Basic Details', (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-gray-600">Property Type</p>
                                            <p className="font-medium">{property.Type}</p>
                                        </div>
                                        {property.BHK && (
                                            <div>
                                                <p className="text-gray-600">BHK</p>
                                                <p className="font-medium">{property.BHK}</p>
                                            </div>
                                        )}
                                        {(property.bedCount || property.BedCount || property.totalRoom || property.totalPG || property.totalFlat) && (
                                            <div>
                                                <p className="text-gray-600">Total Bed/Room/Flat/Pg</p>
                                                <p className="font-medium">{getBedCount()}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-600">Location</p>
                                            <p className="font-medium">
                                                {property.location}, {property.townSector}, {property.city}
                                            </p>
                                        </div>
                                        {property.palaceName && (
                                            <div>
                                                <p className="text-gray-600">Palace Name</p>
                                                <p className="font-medium">{property.palaceName}</p>
                                            </div>
                                        )}
                                        {property.landmark && (
                                            <div>
                                                <p className="text-gray-600">Landmark</p>
                                                <p className="font-medium">{property.landmark}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-600">Address</p>
                                            <p className="font-medium">{getAddress()}</p>
                                        </div>
                                        {property.totalFloor && (
                                            <div>
                                                <p className="text-gray-600">Total Floors</p>
                                                <p className="font-medium">{property.totalFloor}</p>
                                            </div>
                                        )}
                                        {property.furnishingType && (
                                            <div>
                                                <p className="text-gray-600">Furnishing</p>
                                                <p className="font-medium">{property.furnishingType}</p>
                                            </div>
                                        )}
                                        {property.accomoType && (
                                            <div>
                                                <p className="text-gray-600">Accommodation Type</p>
                                                <p className="font-medium">{property.accomoType}</p>
                                            </div>
                                        )}
                                        {property.acType && (
                                            <div>
                                                <p className="text-gray-600">AC Type</p>
                                                <p className="font-medium">{property.acType}</p>
                                            </div>
                                        )}
                                        {
                                            property.noticePeriod && (
                                                <div>
                                                    <p className="text-gray-600">Notice Period</p>
                                                    <p className="font-medium">{property.noticePeriod}</p>
                                                </div>
                                            )}
                                        {property.genderPrefer && (
                                            <div>
                                                <p className="text-gray-600">Gender Preference</p>
                                                <p className="font-medium">{property.genderPrefer}</p>
                                            </div>
                                        )}
                                        {property.noofGuests && (
                                            <div>
                                                <p className="text-gray-600">No. of Guests</p>
                                                <p className="font-medium">{property.noofGuests}</p>
                                            </div>
                                        )}
                                        {
                                            <div>
                                                <p>AgentId : {localStorage.getItem("agentId")}</p>
                                            </div>
                                        }
                                    </div>
                                ))}


                                {/* Pricing Details */}
                                {renderSection('Pricing Details', (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-gray-600">Price Range</p>
                                            <p className="font-medium">₹{property.MinPrice} - ₹{property.MaxPrice}</p>
                                        </div>
                                        {property.security && (
                                            <div>
                                                <p className="text-gray-600">Security Deposit</p>
                                                <p className="font-medium">₹{property.security}</p>
                                            </div>
                                        )}
                                        {property.maintenance && (
                                            <div>
                                                <p className="text-gray-600">Maintenance</p>
                                                <p className="font-medium">₹{property.maintenance}</p>
                                            </div>
                                        )}
                                        {property.Offer && (
                                            <div>
                                                <p className="text-gray-600">Special Offer</p>
                                                <p className="font-medium text-green-600">{property.Offer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Amenities */}
                                {renderSection('Amenities', (
                                    <div>
                                        {getParking().length > 0 && renderList(getParking(), 'Parking Available')}
                                        {getInsideAmenities().length > 0 && renderList(getInsideAmenities(), 'Inside Amenities')}
                                        {getOutsideAmenities().length > 0 && renderList(getOutsideAmenities(), 'Nearby Amenities')}
                                        {getPreferredTenants().length > 0 && renderList(getPreferredTenants(), 'Preferred Tenants')}
                                    </div>
                                ))}

                                {/* Room/PG/Flat/Hourly Specific Details */}
                                {renderSection('Property Specific Details', (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {getRoomType() && (
                                            <div>
                                                <p className="text-gray-600">Type</p>
                                                <p className="font-medium">{getRoomType()}</p>
                                            </div>
                                        )}
                                        {property.waterSupply && (
                                            <div>
                                                <p className="text-gray-600">Water Supply</p>
                                                <p className="font-medium">{property.waterSupply} hours</p>
                                            </div>
                                        )}
                                        {property.powerBackup && (
                                            <div>
                                                <p className="text-gray-600">Power Backup</p>
                                                <p className="font-medium">{property.powerBackup} hours</p>
                                            </div>
                                        )}
                                        {getFoodAvailable() !== undefined && (
                                            <div>
                                                <p className="text-gray-600">Food Available</p>
                                                <p className="font-medium">{getFoodAvailable() ? 'Yes' : 'No'}</p>
                                            </div>
                                        )}
                                        {getManager() && (
                                            <div>
                                                <p className="text-gray-600">Manager/Care Taker</p>
                                                <p className="font-medium">{getManager()}</p>
                                            </div>
                                        )}
                                        {property.RoomAvailable && (
                                            <div>
                                                <p className="text-gray-600">Room Available</p>
                                                <p className="font-medium">{property.RoomAvailable}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Verification & Status */}
                                {renderSection('Verification & Status', (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-gray-600">Verification Status</p>
                                            <p className={`font-medium ${property.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {property.isVerified ? 'Verified' : 'Pending'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Last Updated</p>
                                            <p className="font-medium">{formatDate(property.updatedByOwner)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Verified On</p>
                                            <p className="font-medium">
                                                {property.isVerified ? formatDate(property.verifiedByAdminOrAgent) : 'Not Verified'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Listing Visibility</p>
                                            <p className={`font-medium ${property.isVisible ? 'text-green-600' : 'text-red-600'}`}>
                                                {property.isVisible ? 'Visible' : 'Hidden'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Payment Status</p>
                                            <p className={`font-medium ${property.paymentDone ? 'text-green-600' : 'text-red-600'}`}>
                                                {property.paymentDone ? 'Completed' : 'Pending'}
                                            </p>
                                        </div>
                                        {property.listingShowNo && (
                                            <div>
                                                <p className="text-gray-600">Contact Number</p>
                                                <p className="font-medium">{property.listingShowNo}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {renderOwnerInfo()}


                                {/* Self Verified Images */}
                                {getAgentVerifiedImages().length > 0 && renderImageGallery(getAgentVerifiedImages(), 'Agent Verified Images')}

                               <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="submit"
                                    onClick={handleRejectPayment}
                                    className="px-6 py-2 bg-red-100 text-red-700 rounded-md border border-red-200 hover:bg-red-200 transition-colors"
                                >
                                    Reject
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleApprovePayment}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    Pay to Agent
                                </button>
                        </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PropertyDetailsPageAgent;