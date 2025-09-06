
'use server';
/**
 * @fileOverview A flow to mark a student's attendance in Firestore.
 *
 * - markAttendance - A function that records a student as present for a specific lecture.
 * - MarkAttendanceInput - The input type for the markAttendance function.
 * - MarkAttendanceOutput - The return type for the markAttendance function.
 */

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import type { Student } from '@/lib/types';

const MarkAttendanceInputSchema = z.object({
  lectureId: z.string().describe('The unique ID of the lecture session.'),
  student: z.object({
    id: z.string(),
    name: z.string(),
  }).describe('The student to mark as present.'),
});
export type MarkAttendanceInput = z.infer<typeof MarkAttendanceInputSchema>;

const MarkAttendanceOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type MarkAttendanceOutput = z.infer<typeof MarkAttendanceOutputSchema>;

export async function markAttendance(input: MarkAttendanceInput): Promise<MarkAttendanceOutput> {
  try {
    const lectureRef = doc(db, 'attendance', input.lectureId);
    const lectureSnap = await getDoc(lectureRef);

    if (!lectureSnap.exists()) {
      return { success: false, message: 'Lecture session not found.' };
    }
    
    // Type assertion for the student object to match the Firestore structure
    const studentDataForDb: Student = { id: input.student.id, name: input.student.name };

    // Use arrayUnion to add the student to the 'presentStudents' array.
    // This also prevents duplicate entries if the student scans multiple times.
    await updateDoc(lectureRef, {
      presentStudents: arrayUnion(studentDataForDb)
    });

    return { success: true, message: 'Attendance marked successfully.' };
  } catch (error) {
    console.error('Error marking attendance:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to mark attendance: ${errorMessage}` };
  }
}
