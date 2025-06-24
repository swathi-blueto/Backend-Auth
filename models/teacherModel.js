import { prisma } from '../config/prisma.js';

export const findTeacherById = async (id) => {
  return await prisma.teacher.findUnique({
    where: { id },
  });
};

export const findTeacherByEmail = async (email) => {
  return await prisma.teacher.findUnique({
    where: { email },
  });
};

export const listSchoolTeachers = async (schoolId) => {
  return await prisma.teacher.findMany({
    where: { schoolId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      subjects: true,
      sections: true,
    },
  });
};

export const createTeacher = async (teacherData) => {
  return await prisma.teacher.create({
    data: teacherData,
  });
};

export const updateTeacher = async (id, teacherData) => {
  return await prisma.teacher.update({
    where: { id },
    data: teacherData,
  });
};

export const deleteTeacher = async (id) => {
  return await prisma.teacher.delete({
    where: { id },
  });
};

export const getTeacherWithRelations = async (id) => {
  return await prisma.teacher.findUnique({
    where: { id },
    include: {
      school: true,
      markedAttendances: true,
      enteredMarks: true,
      setGoals: true,
    },
  });
};


export const getTeachersBySection = async (schoolId, section) => {
  return await prisma.teacher.findMany({
    where: {
      schoolId,
      sections: {
        has: section,
      },
    },
    select: {
      id: true,
      name: true,
      subjects: true,
    },
  });
};

export const getTeacherClassStudents = async (teacherId, className, section) => {
  return await prisma.student.findMany({
    where: {
      class: className,
      section,
      school: {
        teachers: {
          some: { id: teacherId },
        },
      },
    },
    include: {
      marks: {
        where: {
          enteredById: teacherId,
        },
        take: 5,
        orderBy: { date: 'desc' },
      },
      attendances: {
        where: {
          markedById: teacherId,
          date: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      },
    },
  });
};