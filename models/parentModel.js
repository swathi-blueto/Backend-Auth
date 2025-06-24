import prisma from '../config/prisma.js';


export const createParent = async (name, email, phone) => {
  return await prisma.parent.create({
    data: { name, email, phone },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true
    }
  });
};

export const getParentWithChildren = async (id) => {
  return await prisma.parent.findUnique({
    where: { id },
    include: {
      students: {
        include: {
          school: true
        }
      }
    }
  });
};


export const updateParent = async (id, updateData) => {
  return await prisma.parent.update({
    where: { id },
    data: updateData
  });
};


export const deleteParent = async (id) => {
  return await prisma.parent.delete({
    where: { id }
  });
};