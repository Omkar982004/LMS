import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

// // POST /api/users → create a new user
// router.post('/', userController.createUser);

// GET /api/users → get all users
router.get('/',protect, authorizeRoles('admin','teacher'), userController.getUsers);

// GET /api/users/:id → get a single user
router.get('/:id',protect, userController.getUserById);

// DELETE /api/users/:id 
router.delete('/:id',protect, authorizeRoles('admin'), userController.deleteUser);

export default router;
