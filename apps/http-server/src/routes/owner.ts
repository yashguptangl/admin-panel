import express from 'express';
import { prisma } from '@repo/db/prisma';
import { authenticate, authorize } from '../middleware/auth';
import { getObjectURL } from '../utils/s3client';


const OwnerRouter = express.Router();

OwnerRouter.get("/not-selfverifiedProperty", authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {

    try {
        const selfNotVerified = await prisma.verificationRequest.findMany({
            where: {
                status: "PENDING",
                verificationType: "SELF",
                imagesUploaded: true,
            },
            include : {
                owner: true, 
            }
        });

        res.status(200).json(selfNotVerified);
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
});

OwnerRouter.get("/agentverifiedProperty", authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {
    const ownerId = req.query.ownerId as string;
    try {
        const agentNotVerified = await prisma.verificationRequest.findMany({
            where: {
                status: "DONE",
                verificationType: "AGENT",
                imagesUploaded: true,
            },
            include: {
                owner: true,
            }
        });

        res.status(200).json(agentNotVerified);
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
});

OwnerRouter.post("/not-selfverifiedProperty-details/", authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {
    try {
        const { id, ownerId, listingType, listingId } = req.query;
        if (!ownerId || !listingType || !listingId) {
            res.status(400).json({ message: "Please provide all the required fields" });
            return;
        }
        let details: any[] = [];

        switch (listingType) {
            case "flat":
                details = await prisma.flatInfo.findMany({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                });
                break;
            case "pg":
                details = await prisma.pgInfo.findMany({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                });
                break;
            case "room":
                details = await prisma.roomInfo.findMany({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                });
                break;
            case "hourlyroom":
                details = await prisma.hourlyInfo.findMany({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                });
                break;
            default:
                res.status(400).json({ message: "Invalid listing type" });
                return;
        }


        const imageCategories = ["inside", "front", "lobby", "bathroom", "kitchen"];
        const listingsWithImages = await Promise.all(
            details.map(async () => {
                const imageUrls = await Promise.all(
                    imageCategories.map(async (category) => {
                        const key = `images/${listingType}/${listingId}/${category}.jpeg`;
                        return await getObjectURL(key); // Fetch signed URL from S3
                    })
                );
                return { ...details, images: imageUrls };
            })
        );

        // Fetch self-verified images for each detail
        const selfVerifiedImages = await Promise.all(
            details.map(async (detail) => {
                const selfVerifiedKeys = [
                    `images/self-verification/${ownerId}/${id}/frontbuildingview.jpeg`,
                    `images/self-verification/${ownerId}/${id}/selfiewithaadhar.jpeg`,
                ];
                const selfVerifiedUrls = await Promise.all(selfVerifiedKeys.map(key => getObjectURL(key)));
                return {
                    ...detail,
                    images: (await Promise.all(
                        imageCategories.map(async (category) => {
                            const key = `images/${listingType}/${listingId}/${category}.jpeg`;
                            return await getObjectURL(key);
                        })
                    )),
                    kycDocuments: (await Promise.all([
                        `images/owner-kyc-documents/${ownerId}/aadharFront.jpeg`,
                        `images/owner-kyc-documents/${ownerId}/aadharBack.jpeg`,
                        `images/owner-kyc-documents/${ownerId}/ownerImage.jpeg`,
                        `images/owner-kyc-documents/${ownerId}/otherId.jpeg`,
                    ].map(key => getObjectURL(key)))),
                    selfVerifiedImages: selfVerifiedUrls
                };
            })
        );
        const owner = await prisma.owner.findUnique({
            where: {
                id: parseInt(ownerId as string),
            },
        });

        res.status(200).json({ details: selfVerifiedImages, message: "Self verified details fetched successfully", owner });
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
});

OwnerRouter.post("/agentverifiedProperty-details/", authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {
    try {
        const { id, ownerId, listingType, listingId, agentId } = req.query;
        if (!ownerId || !listingType || !listingId) {
            res.status(400).json({ message: "Please provide all the required fields" });
            return;
        }
        let details: any[] = [];

        switch (listingType) {
            case "flat":
                details = await prisma.flatInfo.findMany({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                });
                break;
            case "pg":
                details = await prisma.pgInfo.findMany({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                });
                break;
            case "room":
                details = await prisma.roomInfo.findMany({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                });
                break;
            case "hourlyroom":
                details = await prisma.hourlyInfo.findMany({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                });
                break;

            default:
                res.status(400).json({ message: "Invalid listing type" });
                return;
        }

        const imageCategories = ["inside", "front", "lobby", "bathroom", "kitchen" ];
        const listingsWithImages = await Promise.all(
            details.map(async () => {
                const imageUrls = await Promise.all(
                    imageCategories.map(async (category) => {
                        const key = `images/${listingType}/${listingId}/${category}.jpeg`;
                        return await getObjectURL(key); // Fetch signed URL from S3
                    })
                );
                return { ...details, images: imageUrls };
            })
        );

        // Fetch agent-verified images for each detail
        const agentVerifiedImages = await Promise.all(
            details.map(async (detail) => {
                const agentVerifiedKeys = [
                    `images/agent-verification/${agentId}/${id}/frontbuildingview.jpeg`,
                    `images/agent-verification/${agentId}/${id}/selfieWithOwner.jpeg`,
                ];
                const agentVerifiedUrls = await Promise.all(agentVerifiedKeys.map(key => getObjectURL(key)));
                return {
                    ...detail,
                    images: await Promise.all(
                        imageCategories.map(async (category) => {
                            const key = `images/${listingType}/${listingId}/${category}.jpeg`;
                            return await getObjectURL(key);
                        })
                    ),
                    agentVerifiedImages: agentVerifiedUrls
                };
            })
        );

        res.status(200).json({ details: agentVerifiedImages, message: "Agent verified details fetched successfully" });
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
});

OwnerRouter.put("/self-verified-complete", authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {
    const { id, ownerId, listingType, listingId } = req.query;
    if (!ownerId || !listingType || !listingId) {
        res.status(400).json({ message: "Please provide all the required fields" });
        return;
    }
    try {
        switch (listingType) {
            case "flat":
                await prisma.flatInfo.update({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                    data: {
                        isVerified: true,
                        verificationPending: false,
                        verifiedByAdminOrAgent : new Date().toISOString(),
                    },
                });
                break;
            case "pg":
                await prisma.pgInfo.update({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                    data: {
                        isVerified: true,
                        verificationPending: false,
                        verifiedByAdminOrAgent : new Date().toISOString(),
                    }
                });
                break;
            case "room":
                await prisma.roomInfo.update({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),

                    },
                    data: {
                        isVerified: true,
                        verificationPending: false,
                        verifiedByAdminOrAgent : new Date().toISOString(),
                    },
                });
                break;
            case "hourlyroom":
                await prisma.hourlyInfo.update({
                    where: {
                        ownerId: parseInt(ownerId as string),
                        id: parseInt(listingId as string),
                    },
                    data: {
                        isVerified: true,
                        verificationPending: false,
                        verifiedByAdminOrAgent : new Date().toISOString(),
                    },
                });
                break;
            default:
                res.status(400).json({ message: "Invalid listing type" });
                return;
        }
        await prisma.verificationRequest.update({
            where: { id: id as string },
            data: { status: "DONE" },
        });
        res.status(200).json({ message: "Property verified successfully" });
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
});

OwnerRouter.put("/agent-verified-complete", authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {
    const { id, ownerId, listingType, listingId, agentId } = req.query;
    if (!ownerId || !listingType || !listingId || !agentId) {
        res.status(400).json({ message: "Please provide all the required fields" });
        return;
    }
    const verificationRequest = await prisma.verificationRequest.findMany({
        where: {
            id: id as string,
            agentId: agentId as string,
        }
    });

    // Add 200rs to agent's wallet
    await prisma.agent.updateMany({
        where: {
            agentId: agentId as string,
        },
        data: {
            earnings : {
                increment: 200
            }
        }
    });

    await prisma.verificationRequest.update({
        where: { id: id as string },
        data: { status: "PAY" },
    });


    res.status(200).json({ verificationRequest, message: "Property and Agent Rs 200 credited successfully" });
    return;

})

OwnerRouter.put("/agent-verified-not-pay", authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {
    const { id, ownerId, listingType, listingId, agentId } = req.query;
    if (!ownerId || !listingType || !listingId || !agentId) {
        res.status(400).json({ message: "Please provide all the required fields" });
        return;
    }

    try {
        await prisma.verificationRequest.update({
            where: { id: id as string },
            data: { status: "CANCELLED_PAYMENT" },
        });

        res.status(200).json({ message: "Property and Agent Rs 200 not credited successfully" });
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
})

export default OwnerRouter;