import prisma from '../config/prisma.js';


export const upsertMarks = async (studentId, subject, examName, marksObtained, totalMarks, date, enteredById) => {
  return await prisma.mark.upsert({
    where: {
      studentId_subject_examName: {
        studentId,
        subject,
        examName
      }
    },
    update: {
      marksObtained,
      totalMarks,
      date: new Date(date),
      enteredById
    },
    create: {
      studentId,
      subject,
      examName,
      marksObtained,
      totalMarks,
      date: new Date(date),
      enteredById
    }
  });
};


export const getStudentMarks = async (studentId, subject = null) => {
  const where = { studentId };
  if (subject) where.subject = subject;
  
  return await prisma.mark.findMany({
    where,
    orderBy: {
      date: 'asc'
    },
    include: {
      enteredBy: {
        select: {
          name: true
        }
      }
    }
  });
};


export const getClassMarks = async (class_, section, examName) => {
  return await prisma.student.findMany({
    where: {
      class: class_,
      section
    },
    select: {
      id: true,
      name: true,
      marks: {
        where: {
          examName
        },
        select: {
          subject: true,
          marksObtained: true,
          totalMarks: true
        }
      }
    }
  });
};