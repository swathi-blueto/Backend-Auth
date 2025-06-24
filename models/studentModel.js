import prisma from '../config/prisma.js';


export const createStudent = async (schoolId, name, dob, gender, class_, section, parentId, photoUrl = null) => {
  return await prisma.student.create({
    data: {
      schoolId,
      name,
      dob: new Date(dob),
      gender,
      class: class_,
      section,
      parentId,
      photoUrl
    },
    select: {
      id: true,
      name: true,
      class: true,
      section: true
    }
  });
};


export const getStudentWithDetails = async (id) => {
  return await prisma.student.findUnique({
    where: { id },
    include: {
      school: true,
      parent: true,
      attendances: true,
      marks: true,
      goals: true,
      healthRecords: true,
      achievements: true,
      aiInsights: true
    }
  });
};


export const updateStudent = async (id, updateData) => {
  if (updateData.dob) {
    updateData.dob = new Date(updateData.dob);
  }
  return await prisma.student.update({
    where: { id },
    data: updateData
  });
};


export const deleteStudent = async (id) => {
  return await prisma.student.delete({
    where: { id }
  });
};


export const listClassStudents = async (schoolId, class_, section = null) => {
  const where = { schoolId, class: class_ };
  if (section) where.section = section;
  
  return await prisma.student.findMany({
    where,
    select: {
      id: true,
      name: true,
      class: true,
      section: true,
      photoUrl: true
    }
  });
};