import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { authenticate, optionalAuth } from '../../middleware/auth.middleware';
import {
  getPosts,
  createPost,
  updatePost,
  getPost,
  deletePost,
  toggleLike,
  getPostLikes,
  getComments,
  addComment,
  toggleCommentLike,
  deleteComment,
  incrementShare,
  updatePostStatus,
  acceptIndustryChallenge,
  rejectCollegeChallenge,
  rejectIndustryChallenge,
  getCollaborationMessages,
  sendCollaborationMessage,
} from './posts.controller';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'citizen-complaints', // The name of the folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
  } as any,
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = Router();

router.get('/', optionalAuth, getPosts);
router.post('/', authenticate, upload.single('image'), createPost);
router.put('/:id', authenticate, upload.single('image'), updatePost);
router.get('/:id', optionalAuth, getPost);
router.patch('/:id/status', optionalAuth, updatePostStatus);
router.post('/:id/college/reject', optionalAuth, rejectCollegeChallenge);
router.post('/:id/industry/accept', optionalAuth, acceptIndustryChallenge);
router.post('/:id/industry/reject', optionalAuth, rejectIndustryChallenge);
router.get('/:id/collaboration-messages', optionalAuth, getCollaborationMessages);
router.post('/:id/collaboration-messages', optionalAuth, sendCollaborationMessage);
router.post('/:id/like', authenticate, toggleLike);
router.get('/:id/likes', optionalAuth, getPostLikes);
router.get('/:id/comments', optionalAuth, getComments);
router.post('/:id/comments', authenticate, addComment);
router.post('/comments/:commentId/like', authenticate, toggleCommentLike);
router.delete('/comments/:commentId', optionalAuth, deleteComment);
router.post('/:id/share', optionalAuth, incrementShare);
router.delete('/:id', optionalAuth, deletePost);

export default router;
