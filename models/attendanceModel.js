import prisma from '../config/prisma.js';


export const markAttendance = async (studentId, date, status, markedById) => {
  return await prisma.attendance.upsert({
    where: {
      studentId_date: {
        studentId,
        date: new Date(date)
      }
    },
    update: {
      status,
      markedById
    },
    create: {
      studentId,
      date: new Date(date),
      status,
      markedById
    }
  });
};


export const getStudentAttendance = async (studentId, fromDate, toDate) => {
  return await prisma.attendance.findMany({
    where: {
      studentId,
      date: {
        gte: new Date(fromDate),
        lte: new Date(toDate)
      }
    },
    orderBy: {
      date: 'asc'
    },
    include: {
      markedBy: {
        select: {
          name: true
        }
      }
    }
  });
};


export const getClassAttendance = async (class_, section, date) => {
  return await prisma.student.findMany({
    where: {
      class: class_,
      section
    },
    select: {
      id: true,
      name: true,
      attendances: {
        where: {
          date: new Date(date)
        },
        select: {
          status: true
        }
      }
    }
  });
};