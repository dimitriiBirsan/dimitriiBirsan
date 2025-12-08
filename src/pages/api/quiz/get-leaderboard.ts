import type { APIRoute } from 'astro';
import { quizStore } from '../../../lib/quizStore';
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
        if (!quizState) {
            return new Response(
                JSON.stringify({ message: 'No quiz found for this room' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
        const currentAnswers = quizState.answers.get(quizState.currentQuestionIndex) || [];

        // Build leaderboard sorted by score (descending) and then by time (ascending)
        const leaderboard = Array.from(quizState.scores.entries())
            .map(([username, totalScore]) => {
                const userAnswer = currentAnswers.find(a => a.username === username);
                return {
                    username,
                    totalScore,
                    answeredThisQuestion: !!userAnswer,
                    isCorrect: userAnswer?.isCorrect || false,
                    pointsEarned: userAnswer?.isCorrect ? currentQuestion.points : 0,
                    timeElapsed: userAnswer?.timeElapsed || 0
                };
            })
            .sort((a, b) => {
                // Sort by total score (descending)
                if (b.totalScore !== a.totalScore) {
                    return b.totalScore - a.totalScore;
                }
                // If scores are equal, sort by time elapsed (ascending, faster is better)
                return a.timeElapsed - b.timeElapsed;
            });

        return new Response(
            JSON.stringify({
                success: true,
                leaderboard,
                correctAnswer: currentQuestion.correctAnswer,
                correctAnswerText: currentQuestion.options[currentQuestion.correctAnswer],
                currentQuestionIndex: quizState.currentQuestionIndex,
                totalQuestions: quizState.questions.length
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
