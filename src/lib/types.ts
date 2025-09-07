
export interface Student {
    id: string;
    name: string;
    email: string;
    goal?: string;
}

export interface Lecture {
    id: string;
    description: string;
}

export interface LecturePayload {
    id: string;
    description: string;
    timestamp: number;
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number; // index of the correct option
    topic: string;
}

export interface Quiz {
    id: string;
    title: string;
    subject: string;
    questions: number;
    timeLimit: number; // in minutes
}

export interface QuizSubmission {
    id: string;
    studentId: string;
    quizId: string;
    answers: (number | null)[]; // array of selected option indices
    score: number;
    submittedAt: Date;
}

export interface Class {
  id:string;
  name: string;
  subject: string;
}

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  status: 'Pending' | 'Submitted' | 'Graded';
  grade?: string; // e.g., 'A+', '85/100'
  fileUrl?: string; // Link to the uploaded file
}
