import prisma from '../config/prisma.js';
import { STUDENT_STATUS } from '../config/constants.js';

const generateAdmissionNumber = async (schoolId) => {
  const currentYear = new Date().getFullYear();
  const lastStudent = await prisma.student.findFirst({
    where: { schoolId },
    orderBy: { admissionNumber: 'desc' },
    select: { admissionNumber: true }
  });

  let nextNumber = 1;
  if (lastStudent?.admissionNumber) {
    const lastNumber = parseInt(lastStudent.admissionNumber.split('-').pop());
    if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }

  return `SCH-${currentYear}-${String(nextNumber).padStart(4, '0')}`;
};

const findStudentById = async (id) => {
  return prisma.student.findUnique({
    where: { id },
    include: {
      parent: true,
      attendances: true,
      marks: true,
      healthRecords: true,
      achievements: true
    }
  });
};

const findStudentByNameAndNumber = async (name, admissionNumber) => {
  return prisma.student.findFirst({
    where: {
      AND: [
        { name },
        { admissionNumber }
      ]
    }
  });
};

const createStudentRecord = async (data) => {
  if (!data.admissionNumber) {
    data.admissionNumber = await generateAdmissionNumber(data.schoolId);
  }

  const studentData = {
    name: data.name,
    dob: data.dob ? new Date(data.dob) : null,
    gender: data.gender,
    class: data.class,
    section: data.section,
    currentAcademicYear: data.currentAcademicYear,
    schoolId: data.schoolId,
    admissionNumber: data.admissionNumber,
    
    ...(data.bloodGroup && { bloodGroup: data.bloodGroup }),
    ...(data.parentId && { parentId: data.parentId }),
    ...(data.photoUrl && { photoUrl: data.photoUrl }),

  };

  return prisma.student.create({
    data: studentData
  });
};

const updateStudentRecord = async (id, data) => {
  return prisma.student.update({ 
    where: { id }, 
    data 
  });
};

const deleteStudentRecord = async (id) => {
  return prisma.student.delete({ where: { id } });
};

const findAllStudents = async ({ filters, pagination }) => {
  const [students, total] = await prisma.$transaction([
    prisma.student.findMany({
      where: filters,
      include: { parent: true },
      orderBy: { admissionDate: 'desc' },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.student.count({ where: filters })
  ]);

  return { data: students, total };
};

const findStudentsWithMarks = async (filters = {}) => {
  return prisma.student.findMany({
    where: filters,
    include: { marks: true }
  });
};

const searchStudents = async ({ name, class: className, section, admissionNumber }, { page, limit }) => {
  const where = {};
  
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (className) where.class = className;
  if (section) where.section = section;
  if (admissionNumber) where.admissionNumber = admissionNumber;

  const [students, total] = await prisma.$transaction([
    prisma.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { parent: true }
    }),
    prisma.student.count({ where })
  ]);

  return { data: students, total };
};

const findStudentsByClassAndSection = async (className, section) => {
  return prisma.student.findMany({
    where: {
      class: className,
      section: section
    },
    include: {
      parent: true,
      marks: {
        orderBy: {
          date: 'desc'
        },
        take: 5 
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
};

export default {
  findStudentById,
  searchStudents,
  findStudentByNameAndNumber,
  findStudentsByClassAndSection,
  createStudentRecord,
  updateStudentRecord,
  deleteStudentRecord,
  findAllStudents,
  findStudentsWithMarks,
  generateAdmissionNumber
};