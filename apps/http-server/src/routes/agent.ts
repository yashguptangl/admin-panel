// src/routes/agent.ts
import express from 'express';
import { prisma } from '@repo/db/prisma';
import { authenticate, authorize } from '../middleware/auth';
import { getObjectURL } from '../utils/s3client';

const AgentRouter = express.Router();

// Get All Agents (Admin/Employee) NotVerify
AgentRouter.get("/agents-notverified" , authenticate , authorize(['ADMIN', 'EMPLOYEE']) , async (req,res) => {
  try{
    const agents = await prisma.agent.findMany({
      where : {
        isVerifiedByAdmin: false
      }
    });
    res.status(200).json({agents, message : "All agents fetched successfully"});
    return;
  }catch(err) {
    res.status(500).json({message : "Internal server error",err});
    return;
  }
});

// Verified 
AgentRouter.get("/agents-verified" , authenticate , authorize(['ADMIN']) , async (req , res) =>{
    try{
      const agents = await prisma.agent.findMany({
        where : {
          isVerifiedByAdmin : true
        }
      })
      res.status(200).json({agents , message : "All verified agents fetched successfully"});
      return;
    }catch(err){
      res.status(500).json({message : "Internal server error", err});
    }
});

// Verify Agent (Admin/Employee)
AgentRouter.put('/agents/verify', authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {
  try{
    const { id , personverified } = req.query;
    const agent = await prisma.agent.update({
      where: { agentId: String(id) },
      data: { isVerifiedByAdmin: true , isKYCVerified : true  , personverifiedName : String(personverified) },
    });
    res.status(200).json(agent);
  }catch(err){
    res.status(500).json({message : "Internal server error  " , err});
    return;
  }
});

// Unverify Agent (Admin Only)
AgentRouter.put('/agents/unverify', authenticate, authorize(['ADMIN']), async (req, res) => {
  try{
    const { id } = req.query; 
    const agent = await prisma.agent.update({
      where: { agentId: String(id) },
      data: { isVerifiedByAdmin: false  },
    });
    res.json(agent);
  }catch(err){
    res.status(500).json({message : "Internal server error  " , err});
    return;
  }
});

AgentRouter.get("/agents/details", authenticate, authorize(['ADMIN', 'EMPLOYEE']), async (req, res) => {
  try {
    const id = req.query.id as string;

    // Fetch agent details from the database
    const agent = await prisma.agent.findUnique({
      where: { agentId: id },
      include : {
        Agentprogress : true,
      }
    });

    if (!agent) {
       res.status(404).json({ message: "Agent not found" });
       return;
    }

    // Construct the S3 object keys based on your directory structure
    const agentImage = `images/agent-kyc-documents/${agent.agentId}/agentImage.jpeg`;
    const aadharFrontKey = `images/agent-kyc-documents/${agent.agentId}/aadharFront.jpeg`;
    const aadharBackKey = `images/agent-kyc-documents/${agent.agentId}/aadharBack.jpeg`;
    const pancardKey = `images/agent-kyc-documents/${agent.agentId}/panCard.jpeg`;
    const passbook = `images/agent-kyc-documents/${agent.agentId}/passbook.jpeg`;

    // Fetch signed URLs for the agent's KYC documents
    const [agentImageURL , aadharFrontURL, aadharBackURL, pancardURL, passbookURL] = await Promise.all([
      getObjectURL(agentImage),
      getObjectURL(aadharFrontKey),
      getObjectURL(aadharBackKey),
      getObjectURL(pancardKey),
      getObjectURL(passbook)
    ]);

    res.status(200).json({
      agent,
      kycDocuments: {
        agentImage: agentImageURL,
        aadharFront: aadharFrontURL,
        aadharBack: aadharBackURL,
        pancard: pancardURL,
        passbook: passbookURL
      },
      message: "Agent fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      err
    });
  }
});

AgentRouter.get("/agents-wallet", authenticate, authorize(['ADMIN']), async (req, res) => {
  try{
    const agents = await prisma.agent.findMany();
    res.status(200).json({ agents, message: "All agents fetched successfully" });
  }catch(err){
    res.status(500).json({message : "Internal server error", err});
  }
});

export default AgentRouter;