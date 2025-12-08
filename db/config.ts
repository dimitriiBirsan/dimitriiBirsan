import { defineDb, defineTable, column, NOW } from 'astro:db';

const QuizAttempts = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        visitorId: column.text(), // Simple fingerprint
        score: column.number(),
        manipulationDetected: column.boolean(), // Did they spot the dark pattern?
        timestamp: column.date({ default: NOW }),
    }
});

// Track users in rooms with their current location
const RoomUsers = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        roomId: column.text(),
        username: column.text(),
        userId: column.text(), // UUID for reconnection
        currentLocation: column.text(), // 'room' | 'quiz' | 'leaderboard' | 'results'
        currentQuestionIndex: column.number({ optional: true }),
        isActive: column.boolean({ default: true }),
        lastSeen: column.date({ default: NOW }),
        createdAt: column.date({ default: NOW }),
    }
});

// Track active quiz sessions
const QuizSessions = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        roomId: column.text({ unique: true }),
        quizId: column.text(),
        quizTitle: column.text(),
        currentQuestionIndex: column.number({ default: 0 }),
        totalQuestions: column.number(),
        questionStartTime: column.date({ default: NOW }),
        isActive: column.boolean({ default: true }),
        createdAt: column.date({ default: NOW }),
        completedAt: column.date({ optional: true }),
    }
});

// Store all user answers with timestamps
const QuizAnswers = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        sessionId: column.number(), // references QuizSessions.id
        roomId: column.text(),
        username: column.text(),
        questionIndex: column.number(),
        answer: column.number(),
        isCorrect: column.boolean(),
        timeElapsed: column.number(), // milliseconds
        timestamp: column.date({ default: NOW }),
    }
});

// Track cumulative scores per user per session
const UserScores = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        sessionId: column.number(), // references QuizSessions.id
        username: column.text(),
        totalScore: column.number({ default: 0 }),
        updatedAt: column.date({ default: NOW }),
    }
});

export default defineDb({
    tables: {
        QuizAttempts,
        RoomUsers,
        QuizSessions,
        QuizAnswers,
        UserScores
    },
});