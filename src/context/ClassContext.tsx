'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Class, Student } from '@/lib/types';

interface ClassWithStudents extends Class {
  students: Student[];
}

interface ClassContextType {
  classes: ClassWithStudents[];
  addClass: (newClass: Omit<Class, 'id'>) => void;
  addStudentToClass: (classId: string, student: Omit<Student, 'id'>) => void;
  removeStudentFromClass: (classId: string, studentId: string) => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<ClassWithStudents[]>([]);

  const addClass = (newClass: Omit<Class, 'id'>) => {
    const newClassWithDetails: ClassWithStudents = {
      id: `class_${Date.now()}`,
      ...newClass,
      students: [],
    };
    setClasses((prevClasses) => [...prevClasses, newClassWithDetails]);
  };

  const addStudentToClass = (classId: string, student: Omit<Student, 'id'>) => {
    setClasses(prevClasses =>
      prevClasses.map(c => {
        if (c.id === classId) {
          const newStudent: Student = {
            id: `student_${Date.now()}`,
            ...student,
          };
          return { ...c, students: [...c.students, newStudent] };
        }
        return c;
      })
    );
  };

  const removeStudentFromClass = (classId: string, studentId: string) => {
    setClasses(prevClasses =>
      prevClasses.map(c => {
        if (c.id === classId) {
          return { ...c, students: c.students.filter(s => s.id !== studentId) };
        }
        return c;
      })
    );
  };

  return (
    <ClassContext.Provider value={{ classes, addClass, addStudentToClass, removeStudentFromClass }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
};
