// Make sure this matches your API response!
export default interface VerifiedRequestItem {
    id: string;
    listingType: string;
    agentId: string | null;
    createdAt: string;
    ownerId: number;
    verificationType: string;
    listingId: number;
    imagesUploaded: boolean;
    listingShowNo: string;
    verifiedByAdminOrAgent: string;
    updatedAt: string;
    status: string;
    city: string;
    townSector: string;
    location: string;
    owner ?: {
        id: number;
        username: string;
        mobile: string;
        email: string;
    };
    
}