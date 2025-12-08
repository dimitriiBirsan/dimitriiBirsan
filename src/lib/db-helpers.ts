// Database helper functions for quiz state management
import { db, RoomUsers, QuizSessions, QuizAnswers, UserScores, eq, and, sql } from 'astro:db';

export interface UserInfo {
    username: string;
    userId: string;
    currentLocation: string;
    isActive: boolean;
}

// Room User Management
export async function addUserToRoom(roomId: string, username: string, userId: string) {
    // Deactivate any existing sessions for this user in this room
    await db.update(RoomUsers)
        .set({ isActive: false })
        .where(and(
            eq(RoomUsers.roomId, roomId),
            eq(RoomUsers.username, username)
        ));

    // Add new session
    await db.insert(RoomUsers).values({
        roomId,
        username,
        userId,
        currentLocation: 'room',
        isActive: true,
        lastSeen: new Date(),
        createdAt: new Date(),
    });
}

export async function getUsersInRoom(roomId: string): Promise<UserInfo[]> {
    const users = await db.select()
        .from(RoomUsers)
        .where(and(
            eq(RoomUsers.roomId, roomId),
            eq(RoomUsers.isActive, true)
        ));

    return users.map(u => ({
        username: u.username,
        userId: u.userId,
        currentLocation: u.currentLocation,
        isActive: u.isActive,
    }));
}

export async function updateUserLocation(roomId: string, username: string, location: string, questionIndex?: number) {
    await db.update(RoomUsers)
        .set({
            currentLocation: location,
            currentQuestionIndex: questionIndex,
            lastSeen: new Date(),
        })
        .where(and(
            eq(RoomUsers.roomId, roomId),
            eq(RoomUsers.username, username),
            eq(RoomUsers.isActive, true)
        ));
}

export async function removeUserFromRoom(roomId: string, username: string) {
    await db.update(RoomUsers)
        .set({ isActive: false })
        .where(and(
            eq(RoomUsers.roomId, roomId),
            eq(RoomUsers.username, username)
        ));
}

// Quiz Session Management
// Clear all quiz data for a room (answers and scores from previous sessions)
export async function clearRoomQuizData(roomId: string) {
    // Get all session IDs for this room
    const sessions = await db.select()
        .from(QuizSessions)
        .where(eq(QuizSessions.roomId, roomId));

    const sessionIds = sessions.map(s => s.id);

    if (sessionIds.length > 0) {
        // Delete all quiz answers for these sessions
        for (const sessionId of sessionIds) {
            await db.delete(QuizAnswers)
                .where(eq(QuizAnswers.sessionId, sessionId));
        }

        // Delete all user scores for these sessions
        for (const sessionId of sessionIds) {
            await db.delete(UserScores)
                .where(eq(UserScores.sessionId, sessionId));
        }
    }

    console.log(`Cleared quiz data for room ${roomId}: ${sessionIds.length} sessions cleaned`);
}

export async function createQuizSession(roomId: string, quizId: string, quizTitle: string, totalQuestions: number) {
    // First, clear all old quiz data (answers and scores)
    await clearRoomQuizData(roomId);

    // Delete any existing quiz sessions for this room (roomId has unique constraint)
    await db.delete(QuizSessions)
        .where(eq(QuizSessions.roomId, roomId));

    // Create new session
    const result = await db.insert(QuizSessions).values({
        roomId,
        quizId,
        quizTitle,
        totalQuestions,
        currentQuestionIndex: 0,
        questionStartTime: new Date(),
        isActive: true,
        createdAt: new Date(),
    });

    // Initialize scores for all users in room
    const users = await getUsersInRoom(roomId);
    for (const user of users) {
        await db.insert(UserScores).values({
            sessionId: result.lastInsertRowid as number,
            username: user.username,
            totalScore: 0,
            updatedAt: new Date(),
        });
    }

    return result.lastInsertRowid as number;
}

export async function getActiveQuizSession(roomId: string) {
    const sessions = await db.select()
        .from(QuizSessions)
        .where(and(
            eq(QuizSessions.roomId, roomId),
            eq(QuizSessions.isActive, true)
        ))
        .limit(1);

    return sessions[0] || null;
}

export async function advanceQuestion(sessionId: number) {
    const session = await db.select()
        .from(QuizSessions)
        .where(eq(QuizSessions.id, sessionId))
        .limit(1);

    if (!session[0]) return null;

    const newIndex = session[0].currentQuestionIndex + 1;
    const isComplete = newIndex >= session[0].totalQuestions;

    await db.update(QuizSessions)
        .set({
            currentQuestionIndex: newIndex,
            questionStartTime: new Date(),
            isActive: !isComplete,
            completedAt: isComplete ? new Date() : undefined,
        })
        .where(eq(QuizSessions.id, sessionId));

    return {
        currentQuestionIndex: newIndex,
        isComplete,
    };
}

// Answer Management
export async function saveAnswer(
    sessionId: number,
    roomId: string,
    username: string,
    questionIndex: number,
    answer: number,
    isCorrect: boolean,
    timeElapsed: number
) {
    await db.insert(QuizAnswers).values({
        sessionId,
        roomId,
        username,
        questionIndex,
        answer,
        isCorrect,
        timeElapsed,
        timestamp: new Date(),
    });
}

export async function getAnswersForQuestion(sessionId: number, questionIndex: number) {
    return await db.select()
        .from(QuizAnswers)
        .where(and(
            eq(QuizAnswers.sessionId, sessionId),
            eq(QuizAnswers.questionIndex, questionIndex)
        ));
}

export async function hasUserAnswered(sessionId: number, questionIndex: number, username: string): Promise<boolean> {
    const answers = await db.select()
        .from(QuizAnswers)
        .where(and(
            eq(QuizAnswers.sessionId, sessionId),
            eq(QuizAnswers.questionIndex, questionIndex),
            eq(QuizAnswers.username, username)
        ))
        .limit(1);

    return answers.length > 0;
}

// Score Management
export async function updateUserScore(sessionId: number, username: string, pointsToAdd: number) {
    const scores = await db.select()
        .from(UserScores)
        .where(and(
            eq(UserScores.sessionId, sessionId),
            eq(UserScores.username, username)
        ))
        .limit(1);

    if (scores[0]) {
        await db.update(UserScores)
            .set({
                totalScore: scores[0].totalScore + pointsToAdd,
                updatedAt: new Date(),
            })
            .where(eq(UserScores.id, scores[0].id));
    }
}

export async function getLeaderboard(sessionId: number, questionIndex: number) {
    // Get all scores
    const scores = await db.select()
        .from(UserScores)
        .where(eq(UserScores.sessionId, sessionId));

    // Get answers for this question
    const answers = await getAnswersForQuestion(sessionId, questionIndex);

    // Combine data
    return scores.map(score => {
        const userAnswer = answers.find(a => a.username === score.username);
        return {
            username: score.username,
            totalScore: score.totalScore,
            answeredThisQuestion: !!userAnswer,
            isCorrect: userAnswer?.isCorrect || false,
            pointsEarned: userAnswer?.isCorrect ? 100 : 0, // You can make this dynamic based on question points
            timeElapsed: userAnswer?.timeElapsed || 0,
        };
    }).sort((a, b) => {
        // Sort by total score (descending), then by time (ascending)
        if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
        }
        return a.timeElapsed - b.timeElapsed;
    });
}

// Cleanup inactive users (optional, can be run periodically)
export async function cleanupInactiveUsers(inactiveThresholdMinutes = 30) {
    const threshold = new Date(Date.now() - inactiveThresholdMinutes * 60 * 1000);

    await db.update(RoomUsers)
        .set({ isActive: false })
        .where(sql`${RoomUsers.lastSeen} < ${threshold} AND ${RoomUsers.isActive} = true`);
}
