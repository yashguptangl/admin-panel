import express from "express";
import { getObjectURL } from '../utils/s3client';
const notverifiedProperty = express.Router();
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/auth";
import { prisma } from "@repo/db/prisma";

notverifiedProperty.get("/not-verified-flat", authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const notverifiedProperty = await prisma.flatInfo.findMany({
            where: {
                isVerified: false
            }, 
            include: {
                owner: true, 
            }
        });
        res.status(200).json({ notverifiedProperty, message: "All not verified flat fetched successfully" });
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
});

notverifiedProperty.get("/not-verified-pg", authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const notverifiedProperty = await prisma.pgInfo.findMany({
            where: {
                isVerified: false
            },
            include: {
                owner: true, 
            }
        });
        res.status(200).json({ notverifiedProperty, message: "All not verified pg fetched successfully" });
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
});

notverifiedProperty.get("/not-verified-room", authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const notverifiedProperty = await prisma.roomInfo.findMany({
            where: {
                isVerified: false
            },
            include: {
                owner: true, 
            }

        });
        res.status(200).json({ notverifiedProperty, message: "All not verified room fetched successfully" });
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
});

notverifiedProperty.get("/not-verified-hourlyroom", authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const notverifiedProperty = await prisma.hourlyInfo.findMany({
            where: {
                isVerified: false
            },
            include: {
                Owner: true, 
            }
        });
        res.status(200).json({ notverifiedProperty, message: "All not verified hourly room fetched successfully" });
        return;
    } catch (err) {
        res.status(500).json({ message: "Internal server error", err });
        return;
    }
})

notverifiedProperty.get("/not-verified-flat-full-details", authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const id = Number(req.query.id);

        const flat = await prisma.flatInfo.findUnique({
            where: { id: id },
        });

        if (!flat) {
            res.status(404).json({ message: "Flat not found" });
            return;
        }

        const owner = await prisma.owner.findUnique({
            where: { id: flat.ownerId },
        });

        if (!owner) {
            res.status(404).json({ message: "Owner not found" });
            return;
        }
        // Construct the S3 object keys based on your directory structure
        const frontKey = `images/flat/${id}/front.jpeg`;
        const insideKey = `images/flat/${id}/inside.jpeg`;
        const lobbyKey = `images/flat/${id}/lobby.jpeg`;
        const kitchenKey = `images/flat/${id}/kitchen.jpeg`;
        const toiletKey = `images/flat/${id}/toilet.jpeg`;
        const bathroomKey = `images/flat/${id}/bathroom.jpeg`;

        
        // Fetch signed URLs for the owner's KYC documents
        const [frontURL, insideURL, lobbyURL, kitchenURL, toiletURL, bathroomURL] = await Promise.all([
            getObjectURL(frontKey),
            getObjectURL(insideKey),
            getObjectURL(lobbyKey),
            getObjectURL(kitchenKey),
            getObjectURL(toiletKey),
            getObjectURL(bathroomKey)
        ]);

        res.status(200).json({
            flat, owner,
            images: {
                front: frontURL,
                inside: insideURL,
                lobby: lobbyURL,
                kitchen: kitchenURL,
                toilet: toiletURL,
                bathroom: bathroomURL
            },

            message: "Flat and owner details fetched successfully"
        });
        return;

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error", err });
    }
});

notverifiedProperty.get("/not-verified-pg-full-details", authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const id = Number(req.query.id);

        const pg = await prisma.pgInfo.findUnique({
            where: { id: id },
        });

        if (!pg) {
            res.status(404).json({ message: "PG not found" });
            return;
        }

        const owner = await prisma.owner.findUnique({
            where: { id: pg.ownerId },
        });

        if (!owner) {
            res.status(404).json({ message: "Owner not found" });
            return;
        }
        // Construct the S3 object keys based on your directory structure
        const frontKey = `images/pg/${id}/front.jpeg`;
        const insideKey = `images/pg/${id}/inside.jpeg`;
        const lobbyKey = `images/pg/${id}/lobby.jpeg`;
        const kitchenKey = `images/pg/${id}/kitchen.jpeg`;
        const toiletKey = `images/pg/${id}/toilet.jpeg`;
        const bathroomKey = `images/pg/${id}/bathroom.jpeg`;

        // Fetch signed URLs for the owner's KYC documents
        const [frontURL, insideURL, lobbyURL, kitchenURL, toiletURL, bathroomURL] = await Promise.all([
            getObjectURL(frontKey),
            getObjectURL(insideKey),
            getObjectURL(lobbyKey),
            getObjectURL(kitchenKey),
            getObjectURL(toiletKey),
            getObjectURL(bathroomKey)
        ]);

        res.status(200).json({
            pg, owner,
            images: {
                front: frontURL,
                inside: insideURL,
                lobby: lobbyURL,
                kitchen: kitchenURL,
                toilet: toiletURL,
                bathroom: bathroomURL
            },
            message: "PG and owner details fetched successfully"
        });
        return;

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error", err });
    }
});

notverifiedProperty.get("/not-verified-room-full-details", authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const id = Number(req.query.id);

        const room = await prisma.roomInfo.findUnique({
            where: { id: id },
        });

        if (!room) {
            res.status(404).json({ message: "Room not found" });
            return;
        }

        const owner = await prisma.owner.findUnique({
            where: { id: room.ownerId },
        });

        if (!owner) {
            res.status(404).json({ message: "Owner not found" });
            return;
        }
        // Construct the S3 object keys based on your directory structure
        const frontKey = `images/room/${id}/front.jpeg`;
        const insideKey = `images/room/${id}/inside.jpeg`;
        const lobbyKey = `images/room/${id}/lobby.jpeg`;
        const kitchenKey = `images/room/${id}/kitchen.jpeg`;
        const toiletKey = `images/room/${id}/toilet.jpeg`;
        const bathroomKey = `images/room/${id}/bathroom.jpeg`;

        
        // Fetch signed URLs for the owner's KYC documents
        const [frontURL, insideURL, lobbyURL, kitchenURL, toiletURL, bathroomURL] = await Promise.all([
            getObjectURL(frontKey),
            getObjectURL(insideKey),
            getObjectURL(lobbyKey),
            getObjectURL(kitchenKey),
            getObjectURL(toiletKey),
            getObjectURL(bathroomKey)
        ]);

        res.status(200).json({
        room , owner,
            images: {
                front: frontURL,
                inside: insideURL,
                lobby: lobbyURL,
                kitchen: kitchenURL,
                toilet: toiletURL,
                bathroom: bathroomURL
            },

            message: "Room and owner details fetched successfully"
        });
        return;

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error", err });
    }
});

notverifiedProperty.get("/not-verified-hourlyroom-full-details", authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const id = Number(req.query.id);

        const hourlyRoom = await prisma.hourlyInfo.findUnique({
            where: { id: id },
        });

        if (!hourlyRoom) {
            res.status(404).json({ message: "Hourly room not found" });
            return;
        }

        const owner = await prisma.owner.findUnique({
            where: { id: hourlyRoom.ownerId },
        });

        if (!owner) {
            res.status(404).json({ message: "Owner not found" });
            return;
        }
        // Construct the S3 object keys based on your directory structure
        const frontKey = `images/hourlyroom/${id}/front.jpeg`;
        const insideKey = `images/hourlyroom/${id}/inside.jpeg`;
        const lobbyKey = `images/hourlyroom/${id}/lobby.jpeg`;
        const toiletKey = `images/hourlyroom/${id}/toilet.jpeg`;
        const bathroomKey = `images/hourlyroom/${id}/bathroom.jpeg`;

        
        // Fetch signed URLs for the owner's KYC documents
        const [frontURL, insideURL, lobbyURL, toiletURL, bathroomURL] = await Promise.all([
            getObjectURL(frontKey),
            getObjectURL(insideKey),
            getObjectURL(lobbyKey),
            getObjectURL(toiletKey),
            getObjectURL(bathroomKey)
        ]);

        res.status(200).json({
            hourlyRoom, owner,
            images: {
                front: frontURL,
                inside: insideURL,
                lobby: lobbyURL,
                toilet: toiletURL,
                bathroom: bathroomURL
            },

            message: "Hourly Room and owner details fetched successfully"
        });
        return;
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error", err });
    }
});


export default notverifiedProperty;