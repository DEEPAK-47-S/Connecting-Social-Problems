import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/users — List all users (excluding passwords)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        sector: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (error) {
    console.error('[GET USERS ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// DELETE /api/admin/users/:id — Delete a user permanently
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Attempt to delete user. Prisma's schema handles cascades if configured,
    // otherwise we just delete the user record. We'll wrap in a try block.
    await prisma.user.delete({ where: { id } });

    console.log(`[DELETE USER] User ${id} deleted by Admin.`);
    res.json({ message: 'User deleted successfully.', id });
  } catch (error) {
    console.error('[DELETE USER ERROR]', error);
    res.status(500).json({ error: 'Failed to delete user. They may have dependent records.' });
  }
};
