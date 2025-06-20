
import { signupService, loginService, logoutService } from "../services/authService.js";

export const signup = async (req, res) => {
  try {
    const result = await signupService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const result = await logoutService();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Logout failed' });
  }
};