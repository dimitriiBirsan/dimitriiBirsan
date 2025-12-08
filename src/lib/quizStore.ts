// Shared in-memory storage for quiz state across API endpoints

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
}

export interface UserAnswer {
    username: string;
    answer: number;
    timestamp: Date;
    isCorrect: boolean;
    timeElapsed: number; // milliseconds since question started
}

export interface QuizState {
    roomId: string;
    quizId: string; // reference to MDX file
    title: string;
    questions: QuizQuestion[];
    currentQuestionIndex: number;
    questionStartTime: Date; // when current question started
    answers: Map<number, UserAnswer[]>; // questionIndex -> answers
    scores: Map<string, number>; // username -> total score
    isActive: boolean;
}

const store = globalThis as any;

if (!store.__quizStore) {
    store.__quizStore = new Map<string, QuizState>();
}

export const quizStore: Map<string, QuizState> = store.__quizStore;
