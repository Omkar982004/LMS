import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';

// POST /api/users → create a new user
router.post('/', userController.createUser);

// GET /api/users → get all users
router.get('/', userController.getUsers);

// GET /api/users/:id → get a single user
router.get('/:id', userController.getUserById);

// DELETE /api/users/:id 
router.delete('/:id', userController.deleteUser);

export default router;
