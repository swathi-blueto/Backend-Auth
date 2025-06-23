import prisma from '../config/prisma.js';

export const createUser = async (name, email, password, role = 'user') => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};
