import express from "express";
import {signup, login, logout } from "../controllers/authController.js"
import {verifyToken} from "../middlewares/authMiddleware.js"
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post('/signup' ,signup);
router.post('/login', login);
router.post('/logout', verifyToken, logout);


router.get('/admin-only', verifyToken, allowRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

export default router;