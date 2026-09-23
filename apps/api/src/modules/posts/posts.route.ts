import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

// Configure Multer for image uploads
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type.'));
  },
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
