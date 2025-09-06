
export interface Student {
    id: string;
    name: string;
    goal?: string;
}

export interface Lecture {
    id: string;
    description: string;
}

export interface LecturePayload {
    id: string;
    description: string;
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
