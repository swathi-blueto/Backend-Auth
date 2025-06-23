
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { createUser, findUserByEmail } from "../models/userModel.js";

export const signupService = async ({ name, email, password, role = 'user' }) => {
  
  const validRoles = ['user', 'admin']; 
  if (!validRoles.includes(role)) {
    throw { status: 400, message: 'Invalid role' };
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) throw { status: 400, message: 'User already exists' };

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, hashedPassword, role);
  const token = generateToken(user);

  return { 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      role: user.role 
    }, 
    token 
  };
};

export const loginService = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw { status: 400, message: 'Invalid credentials' };
  

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 400, message: 'Invalid credentials' };

  const token = generateToken(user);
  return { 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      role: user.role 
    }, 
    token 
  };
};

export const logoutService = async () => {
  return { message: 'Logged out successfully' };
};