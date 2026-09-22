import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createChallenge = async (req: Request, res: Response) => {
  try {
    const { title, description, category, district, citizenId } = req.body;

    const userId = citizenId || (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        category: category || 'General',
        district,
        userId,
        status: 'SUBMITTED',
      },
    });

    res.status(201).json({
      message: 'Challenge submitted successfully.',
      challenge: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, name: true } } },
    });
    res.status(200).json({ challenges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
