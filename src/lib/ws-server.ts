// WebSocket server for real-time quiz communication
import { WebSocketServer, WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
import * as dbHelpers from './db-helpers.ts';
import { getEntry } from 'astro:content';

// WebSocket message types
export interface ClientMessage {
    type: 'join_room' | 'leave_room' | 'start_quiz' | 'submit_answer' | 'request_leaderboard' | 'advance_question' | 'get_current_state';
    roomId: string;
    username?: string;
    userId?: string;
    quizId?: string;
    answer?: number;
}

export interface ServerMessage {
    type: 'connected' | 'users_updated' | 'quiz_started' | 'question_update' | 'user_answered' | 'show_leaderboard' | 'next_question' | 'quiz_complete' | 'error';
    data?: any;
}

interface RoomConnection {
    ws: WebSocket;
    roomId: string;
    username: string;
    userId: string;
}

// Store active connections by room
const connections = new Map<string, RoomConnection[]>();

// Quiz state cache (to avoid repeated DB queries)
const quizCache = new Map<string, any>();

export function setupWebSocketServer(wss: WebSocketServer) {
    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        console.log('New WebSocket connection');

        ws.on('message', async (message: string) => {
            try {
                const msg: ClientMessage = JSON.parse(message.toString());
                await handleClientMessage(ws, msg);
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
                sendToClient(ws, {
                    type: 'error',
                    data: { message: 'Invalid message format' }
                });
            }
        });

        ws.on('close', () => {
            // Remove connection from all rooms
            for (const [roomId, conns] of connections.entries()) {
                const index = conns.findIndex(c => c.ws === ws);
                if (index !== -1) {
                    const conn = conns[index];
                    conns.splice(index, 1);

                    // Update database
                    dbHelpers.removeUserFromRoom(roomId, conn.username).catch(console.error);

                    // Notify others
                    broadcastToRoom(roomId, {
                        type: 'users_updated',
                        data: { users: conns.map(c => ({ username: c.username, userId: c.userId })) }
                    });

                    if (conns.length === 0) {
                        connections.delete(roomId);
                    }
                }
            }
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });
}

async function handleClientMessage(ws: WebSocket, msg: ClientMessage) {
    switch (msg.type) {
        case 'join_room':
            await handleJoinRoom(ws, msg);
            break;
        case 'leave_room':
            await handleLeaveRoom(ws, msg);
            break;
        case 'start_quiz':
            await handleStartQuiz(msg);
            break;
        case 'submit_answer':
            await handleSubmitAnswer(msg);
            break;
        case 'request_leaderboard':
            await handleRequestLeaderboard(msg);
            break;
        case 'advance_question':
            await handleAdvanceQuestion(msg);
            break;
        case 'get_current_state':
            console.log('Getting current state for room:', msg.roomId);
            await handleGetCurrentState(ws, msg);
            break;
    }
}

async function handleJoinRoom(ws: WebSocket, msg: ClientMessage) {
    const { roomId, username, userId } = msg;
    if (!roomId || !username || !userId) {
        sendToClient(ws, { type: 'error', data: { message: 'Missing required fields' } });
        return;
    }

    // Add to database
    await dbHelpers.addUserToRoom(roomId, username, userId);

    // Add to connections
    if (!connections.has(roomId)) {
        connections.set(roomId, []);
    }

    const roomConns = connections.get(roomId)!;

    // Remove any existing connection for this user
    const existingIndex = roomConns.findIndex(c => c.username === username);
    if (existingIndex !== -1) {
        roomConns.splice(existingIndex, 1);
    }

    roomConns.push({ ws, roomId, username, userId });

    // Send connection confirmation to the newly connected client
    sendToClient(ws, {
        type: 'connected',
        data: { userId, username, roomId }
    });

    // Get all users from database
    const users = await dbHelpers.getUsersInRoom(roomId);

    // Broadcast updated user list
    broadcastToRoom(roomId, {
        type: 'users_updated',
        data: { users }
    });

    // If there's an active quiz, send the current state to the new user
    const session = await dbHelpers.getActiveQuizSession(roomId);
    if (session) {
        const quiz = quizCache.get(roomId);
        if (quiz) {
            const currentQuestion = quiz.questions[session.currentQuestionIndex];
            const answers = await dbHelpers.getAnswersForQuestion(session.id, session.currentQuestionIndex);
            const answeredUsers = answers.map(a => a.username);

            // Calculate question end time (30 seconds after start + buffer for transmission)
            const questionStartTime = new Date(session.questionStartTime);
            const questionEndTime = new Date(questionStartTime.getTime() + 30200); // 30s + 200ms buffer

            // Send current quiz state to the newly joined user
            sendToClient(ws, {
                type: 'quiz_started',
                data: {
                    quizId: quiz.quizId,
                    title: quiz.title,
                    totalQuestions: quiz.questions.length,
                    question: {
                        question: currentQuestion.question,
                        options: currentQuestion.options,
                    },
                    questionIndex: session.currentQuestionIndex,
                    questionEndTime: questionEndTime,
                    answeredUsers,
                }
            });
        }
    }
}

async function handleGetCurrentState(ws: WebSocket, msg: ClientMessage) {
    try {
        const { roomId } = msg;
        if (!roomId) return;

        // Get the active quiz session
        const session = await dbHelpers.getActiveQuizSession(roomId);
        if (!session) {
            console.log('No active quiz session found for room:', roomId);
            // No active quiz, nothing to send
            return;
        }

        const quiz = quizCache.get(roomId);
        if (!quiz) {
            console.log('No quiz found for room:', roomId);
            return;
        }

        const currentQuestion = quiz.questions[session.currentQuestionIndex];
        const answers = await dbHelpers.getAnswersForQuestion(session.id, session.currentQuestionIndex);
        const answeredUsers = answers.map(a => a.username);

        // Calculate question end time (30 seconds after start)
        const questionStartTime = new Date(session.questionStartTime);
        const questionEndTime = new Date(questionStartTime.getTime() + 30000);
        console.log('Sending current state for room:', roomId);
        // Send current quiz state
        sendToClient(ws, {
            type: 'question_update',
            data: {
                quizId: quiz.quizId,
                title: quiz.title,
                totalQuestions: quiz.questions.length,
                question: {
                    question: currentQuestion.question,
                    options: currentQuestion.options,
                },
                questionIndex: session.currentQuestionIndex,
                questionEndTime: questionEndTime,
                answeredUsers,
            }
        });
    } catch (error) {
        console.error('Error getting current state:', error);
    }
}

async function handleLeaveRoom(ws: WebSocket, msg: ClientMessage) {
    const { roomId, username } = msg;
    if (!roomId || !username) return;

    await dbHelpers.removeUserFromRoom(roomId, username);

    const roomConns = connections.get(roomId);
    if (roomConns) {
        const index = roomConns.findIndex(c => c.username === username);
        if (index !== -1) {
            roomConns.splice(index, 1);
        }

        const users = await dbHelpers.getUsersInRoom(roomId);
        broadcastToRoom(roomId, {
            type: 'users_updated',
            data: { users }
        });

        if (roomConns.length === 0) {
            connections.delete(roomId);
        }
    }
}

async function handleStartQuiz(msg: ClientMessage) {
    const { roomId, quizId } = msg;
    if (!roomId || !quizId) return;

    try {
        // Clear any existing quiz cache for this room
        quizCache.delete(roomId);
        console.log(`Starting new quiz - cleared cache for room ${roomId}`);

        // Load quiz from content collection
        const quizEntry = await getEntry('quiz', quizId);
        if (!quizEntry) {
            broadcastToRoom(roomId, {
                type: 'error',
                data: { message: 'Quiz not found' }
            });
            return;
        }

        const { title, questions } = quizEntry.data;

        // Create quiz session in database
        const sessionId = await dbHelpers.createQuizSession(roomId, quizId, title, questions.length);

        // Cache quiz data
        quizCache.set(roomId, {
            sessionId,
            quizId,
            title,
            questions,
        });

        // Update all users' location
        const users = await dbHelpers.getUsersInRoom(roomId);
        for (const user of users) {
            await dbHelpers.updateUserLocation(roomId, user.username, 'quiz', 0);
        }

        // Broadcast quiz started with first question (combined to prevent race condition)
        const firstQuestion = {
            question: questions[0].question,
            options: questions[0].options,
        };

        const questionStartTime = new Date();
        const questionEndTime = new Date(questionStartTime.getTime() + 30200); // 30s + 200ms buffer for transmission

        broadcastToRoom(roomId, {
            type: 'quiz_started',
            data: {
                quizId,
                title,
                totalQuestions: questions.length,
                question: firstQuestion,
                questionIndex: 0,
                questionEndTime: questionEndTime,
                answeredUsers: [],
            }
        });
    } catch (error) {
        console.error('Error starting quiz:', error);
        broadcastToRoom(roomId, {
            type: 'error',
            data: { message: 'Failed to start quiz' }
        });
    }
}

async function handleSubmitAnswer(msg: ClientMessage) {
    const { roomId, username, answer } = msg;
    if (!roomId || !username || answer === undefined) return;

    try {
        const session = await dbHelpers.getActiveQuizSession(roomId);
        if (!session) {
            console.error('No active quiz session');
            return;
        }

        // Check if already answered
        const hasAnswered = await dbHelpers.hasUserAnswered(
            session.id,
            session.currentQuestionIndex,
            username
        );

        if (hasAnswered) {
            return; // Already answered
        }

        // Get quiz from cache
        const quiz = quizCache.get(roomId);
        if (!quiz) {
            console.error('Quiz not in cache');
            return;
        }

        const currentQuestion = quiz.questions[session.currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;
        const timeElapsed = Date.now() - new Date(session.questionStartTime).getTime();

        // Save answer
        await dbHelpers.saveAnswer(
            session.id,
            roomId,
            username,
            session.currentQuestionIndex,
            answer,
            isCorrect,
            timeElapsed
        );

        // Update score
        if (isCorrect) {
            await dbHelpers.updateUserScore(session.id, username, currentQuestion.points || 100);
        }

        // Get all answers for this question
        const answers = await dbHelpers.getAnswersForQuestion(session.id, session.currentQuestionIndex);
        const answeredUsers = answers.map(a => a.username);

        // Notify all users that someone answered
        broadcastToRoom(roomId, {
            type: 'user_answered',
            data: {
                username,
                answeredUsers,
            }
        });

        // Check if all users have answered
        const users = await dbHelpers.getUsersInRoom(roomId);
        const allAnswered = users.length > 0 && answeredUsers.length === users.length;

        if (allAnswered) {
            // Trigger leaderboard
            await showLeaderboard(roomId);
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
    }
}

async function handleRequestLeaderboard(msg: ClientMessage) {
    const { roomId } = msg;
    if (!roomId) return;

    await showLeaderboard(roomId);
}

async function showLeaderboard(roomId: string) {
    const session = await dbHelpers.getActiveQuizSession(roomId);
    if (!session) return;

    const quiz = quizCache.get(roomId);
    if (!quiz) return;

    const currentQuestion = quiz.questions[session.currentQuestionIndex];
    const leaderboard = await dbHelpers.getLeaderboard(session.id, session.currentQuestionIndex);

    // Update all users' location
    const users = await dbHelpers.getUsersInRoom(roomId);
    for (const user of users) {
        await dbHelpers.updateUserLocation(roomId, user.username, 'leaderboard', session.currentQuestionIndex);
    }

    broadcastToRoom(roomId, {
        type: 'show_leaderboard',
        data: {
            leaderboard,
            correctAnswer: currentQuestion.correctAnswer,
            correctAnswerText: currentQuestion.options[currentQuestion.correctAnswer],
            currentQuestionIndex: session.currentQuestionIndex,
            totalQuestions: session.totalQuestions,
        }
    });
}

async function handleAdvanceQuestion(msg: ClientMessage) {
    const { roomId } = msg;
    if (!roomId) return;

    const session = await dbHelpers.getActiveQuizSession(roomId);
    if (!session) return;

    const result = await dbHelpers.advanceQuestion(session.id);
    if (!result) return;

    if (result.isComplete) {
        // Quiz complete
        const users = await dbHelpers.getUsersInRoom(roomId);
        for (const user of users) {
            await dbHelpers.updateUserLocation(roomId, user.username, 'results');
        }

        broadcastToRoom(roomId, {
            type: 'quiz_complete',
            data: {}
        });

        // Clear cache
        quizCache.delete(roomId);
    } else {
        // Next question
        const quiz = quizCache.get(roomId);
        if (!quiz) return;

        const nextQuestion = quiz.questions[result.currentQuestionIndex];

        // Update all users' location
        const users = await dbHelpers.getUsersInRoom(roomId);
        for (const user of users) {
            await dbHelpers.updateUserLocation(roomId, user.username, 'quiz', result.currentQuestionIndex);
        }

        broadcastToRoom(roomId, {
            type: 'next_question',
            data: {
                questionIndex: result.currentQuestionIndex,
            }
        });

        const questionStartTime = new Date();
        const questionEndTime = new Date(questionStartTime.getTime() + 30000); // 30 seconds

        broadcastToRoom(roomId, {
            type: 'question_update',
            data: {
                question: {
                    question: nextQuestion.question,
                    options: nextQuestion.options,
                },
                questionIndex: result.currentQuestionIndex,
                totalQuestions: quiz.questions.length,
                questionEndTime: questionEndTime,
                answeredUsers: [],
            }
        });
    }
}

function sendToClient(ws: WebSocket, message: ServerMessage) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    }
}

function broadcastToRoom(roomId: string, message: ServerMessage) {
    const roomConns = connections.get(roomId);
    if (!roomConns) return;

    const messageStr = JSON.stringify(message);
    for (const conn of roomConns) {
        if (conn.ws.readyState === WebSocket.OPEN) {
            conn.ws.send(messageStr);
        }
    }
}

// Export for external use
export function getActiveConnections() {
    return connections;
}
