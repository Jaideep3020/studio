
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Class, Student } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, query, where, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface ClassWithStudents extends Class {
  students: Student[];
  studentIds: string[];
}

interface ClassContextType {
  classes: ClassWithStudents[];
  isLoading: boolean;
  addClass: (newClass: ClassWithStudents) => void;
  addStudentToClass: (classId: string, student: Student) => void;
  removeStudentFromClass: (classId: string, studentId: string) => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<ClassWithStudents[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const classesQuery = collection(db, 'classes');
    
    // Use onSnapshot for real-time updates to the classes themselves
    const unsubscribe = onSnapshot(classesQuery, async (snapshot) => {
      const classesFromDb = await Promise.all(snapshot.docs.map(async (classDoc) => {
        const classData = classDoc.data();
        const studentIds = classData.studentIds || [];
        
        let students: Student[] = [];
        if (studentIds.length > 0) {
           // Fetch details for each student
           const studentDocs = await Promise.all(studentIds.map((id: string) => getDoc(doc(db, "users", id))));
           students = studentDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() } as Student));
        }

        return {
          id: classDoc.id,
          name: classData.name,
          subject: classData.subject,
          students,
          studentIds,
        };
      }));
      setClasses(classesFromDb);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching classes in real-time:", error);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const addClass = (newClass: ClassWithStudents) => {
    // This is primarily for optimistic UI update. The realtime listener will sync it.
    setClasses((prevClasses) => [...prevClasses, newClass]);
  };

  const addStudentToClass = (classId: string, student: Student) => {
    // Optimistic update for immediate UI feedback
    setClasses(prevClasses =>
      prevClasses.map(c => {
        if (c.id === classId && !c.students.find(s => s.id === student.id)) {
          return { 
            ...c, 
            students: [...c.students, student],
            studentIds: [...c.studentIds, student.id]
          };
        }
        return c;
      })
    );
  };

  const removeStudentFromClass = async (classId: string, studentId: string) => {
    const classRef = doc(db, 'classes', classId);
    try {
      await updateDoc(classRef, {
        studentIds: arrayRemove(studentId)
      });
      // The realtime listener will handle the local state update.
      toast({
        title: 'Student Removed',
        description: 'The student has been removed from the class.',
      });
    } catch (error) {
      console.error("Error removing student: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not remove student. Please try again.',
      });
    }
  };

  return (
    <ClassContext.Provider value={{ classes, isLoading, addClass, addStudentToClass, removeStudentFromClass }}>
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
