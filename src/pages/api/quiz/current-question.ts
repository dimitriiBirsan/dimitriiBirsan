import type { APIRoute } from 'astro';
import { quizStore } from '../../../lib/quizStore';
import { roomsStore } from '../../../lib/roomStore';
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    try {
        const roomId = url.searchParams.get('roomId');

        if (!roomId) {
            return new Response(
                JSON.stringify({ message: 'Missing roomId parameter' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const quizState = quizStore.get(roomId);
        if (!quizState || !quizState.isActive) {
            return new Response(
                JSON.stringify({ message: 'No active quiz found for this room' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
        const currentAnswers = quizState.answers.get(quizState.currentQuestionIndex) || [];

        // Get list of users in room
        const roomUsers = roomsStore.get(roomId) || [];

        // Determine which users have answered
        const answeredUsers = currentAnswers.map(a => a.username);
        const allAnswered = roomUsers.length > 0 && answeredUsers.length === roomUsers.length;

        // Return question without showing the correct answer
        return new Response(
            JSON.stringify({
                success: true,
                question: {
                    question: currentQuestion.question,
                    options: currentQuestion.options,
                    // Don't send correctAnswer to frontend yet
                },
                currentQuestionIndex: quizState.currentQuestionIndex,
                totalQuestions: quizState.questions.length,
                questionStartTime: quizState.questionStartTime,
                answeredUsers,
                allAnswered
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching current question:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
