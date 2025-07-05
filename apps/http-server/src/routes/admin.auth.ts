import express from 'express';
import { prisma } from '@repo/db/prisma';
import { authenticate, authorize } from '../middleware/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const AdminAuthRouter = express.Router();

// Register User
AdminAuthRouter.post('/register' ,  async (req, res) => {
  const { username ,  email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'User already exists', err });
  }
});

// Login User
AdminAuthRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.admin.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'JWT secret not configured' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role , username : user.username}, process.env.JWT_SECRET);
    res.status(200).json({ token, message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', err });
  }
});

// Get All Users (Admin Only)
AdminAuthRouter.get('/users', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', err });
  }

});

// Get all the Owner (Admin Only)
AdminAuthRouter.get("/owner", authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const owner = await prisma.owner.findMany();
    if (!owner) {
      res.status(404).json({ message: "No owner found" });
      return;
    }
    res.status(200).json({ owner, message: "All owner fetched successfully" });
    return;
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
    return;
  }
});


export default AdminAuthRouter;