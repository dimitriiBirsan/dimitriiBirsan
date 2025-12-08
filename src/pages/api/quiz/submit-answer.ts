import type { APIRoute } from 'astro';
import { quizStore } from '../../../lib/quizStore';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { roomId, username, answer } = body;

        if (!roomId || !username || answer === undefined) {
            return new Response(
                JSON.stringify({ message: 'Missing required parameters' }),
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

        // Check if user already answered this question
        if (currentAnswers.some(a => a.username === username)) {
            return new Response(
                JSON.stringify({ message: 'You have already answered this question' }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Calculate time elapsed
        const timeElapsed = Date.now() - quizState.questionStartTime.getTime();

        // Check if answer is correct
        const isCorrect = answer === currentQuestion.correctAnswer;

        // Award points if correct
        let pointsEarned = 0;
        if (isCorrect) {
            pointsEarned = currentQuestion.points;
            const currentScore = quizState.scores.get(username) || 0;
            quizState.scores.set(username, currentScore + pointsEarned);
        }

        // Record answer
        const userAnswer = {
            username,
            answer,
            timestamp: new Date(),
            isCorrect,
            timeElapsed
        };

        currentAnswers.push(userAnswer);
        quizState.answers.set(quizState.currentQuestionIndex, currentAnswers);

        return new Response(
            JSON.stringify({
                success: true,
                isCorrect,
                pointsEarned,
                totalScore: quizState.scores.get(username) || 0
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error submitting answer:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
