import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];

const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Root route info — fixes "Cannot GET /"
app.get('/', (_req, res) => {
  res.json({
    name: 'Connecting Social Problem API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        verifyOtp: 'POST /api/auth/verify-otp',
        resendOtp: 'POST /api/auth/resend-otp',
      },
      posts: {
        list: 'GET /api/posts',
        create: 'POST /api/posts',
        like: 'POST /api/posts/:id/like',
        comments: 'GET /api/posts/:id/comments',
        addComment: 'POST /api/posts/:id/comments',
        share: 'POST /api/posts/:id/share',
      },
    },
  });
});

// Routes
import authRoutes from './modules/auth/auth.route';
import postRoutes from './modules/posts/posts.route';
import adminRoutes from './modules/admin/admin.route';

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// WebSocket events
io.on('connection', (socket) => {
  console.log('[WS] User connected:', socket.id);

  socket.on('join-post', (postId: string) => {
    socket.join(`post:${postId}`);
  });

  socket.on('disconnect', () => {
    console.log('[WS] User disconnected:', socket.id);
  });
});

// Export io for use in controllers
export { io };

// Global Error Handler (Prevents HTML error pages on crash)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[GLOBAL ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected server error occurred.',
    details: err.name === 'MulterError' ? 'File upload failed.' : undefined,
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
