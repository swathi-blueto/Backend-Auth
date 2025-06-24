import prisma from "../config/prisma.js";


export const createTeacher = async (
  schoolId,
  name,
  email,
  phone,
  role,
  subjects,
  sections
) => {
  return await prisma.teacher.create({
    data: {
      schoolId,
      name,
      email,
      phone,
      role,
      subjects,
      sections,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      subjects: true,
      sections: true,
    },
  });
};

export const getTeacherById = async (id) => {
  return await prisma.teacher.findUnique({
    where: { id },
    include: {
      school: true,
      setGoals: true,
    },
  });
};

export const updateTeacher = async (id, updateData) => {
  return await prisma.teacher.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const deleteTeacher = async (id) => {
  return await prisma.teacher.delete({
    where: { id },
  });
};


export const listSchoolTeachers = async (schoolId) => {
  return await prisma.teacher.findMany({
    where: { schoolId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};
