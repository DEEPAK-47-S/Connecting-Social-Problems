import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'socialimpact_jwt_secret_change_me';

function normalizeRole(r?: string): string {
  if (!r) return 'CITIZEN';
  const upper = r.toUpperCase().trim();
  if (upper === 'ADMIN' || upper === 'SUPERADMIN') return 'ADMIN';
  if (upper === 'COLLEGE' || upper === 'UNIVERSITY') return 'UNIVERSITY';
  if (upper === 'INDUSTRY') return 'INDUSTRY';
  if (upper === 'GOVERNMENT') return 'GOVERNMENT';
  return 'CITIZEN';
}

function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'System Administrator';
    case 'UNIVERSITY':
      return 'College / University';
    case 'INDUSTRY':
      return 'Industry Partner';
    case 'GOVERNMENT':
      return 'Government Authority';
    default:
      return 'Citizen';
  }
}

// POST /api/auth/register — Direct instant registration
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, companyName, sector } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({
        error: `An account with this email already exists as a ${getRoleDisplayName(existing.role)} account. Please use the appropriate portal.`,
      });
    }

    const assignedRole = normalizeRole(role);
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        name: name?.trim() || normalizedEmail.split('@')[0],
        role: assignedRole,
        companyName: companyName?.trim() || null,
        sector: sector?.trim() || null,
        isVerified: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ [AUTH] Registered ${user.role} user: ${user.email} (ID: ${user.id})`);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName,
        sector: user.sector,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err: any) {
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// POST /api/auth/login — Direct instant login with strict portal role isolation
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, expectedRole, role: reqRole } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Role verification against expected portal
    const targetRole = expectedRole || reqRole;
    if (targetRole) {
      const requiredRole = normalizeRole(targetRole);
      const actualRole = normalizeRole(user.role);

      if (requiredRole !== actualRole) {
        return res.status(403).json({
          error: `Access Denied: This account is registered as a ${getRoleDisplayName(actualRole)} account. You cannot log into the ${getRoleDisplayName(requiredRole)} portal with these credentials.`,
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ [AUTH] ${user.role} logged in: ${user.email} (ID: ${user.id})`);

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName,
        sector: user.sector,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err: any) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// POST /api/auth/verify-otp (Kept for compatibility)
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Verification failed.' });
  }
};

// POST /api/auth/resend-otp (Kept for compatibility)
export const resendOtp = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'No OTP required.' });
};
