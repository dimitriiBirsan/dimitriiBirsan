import type { APIRoute } from 'astro';
import { quizStore } from '../../../lib/quizStore';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { roomId } = body;

        if (!roomId) {
            return new Response(
                JSON.stringify({ message: 'Missing roomId' }),
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

        // Move to next question
        quizState.currentQuestionIndex++;

        // Check if quiz is completed
        const completed = quizState.currentQuestionIndex >= quizState.questions.length;

        if (completed) {
            quizState.isActive = false;
        } else {
            // Reset question start time for new question
            quizState.questionStartTime = new Date();
        }

        return new Response(
            JSON.stringify({
                success: true,
                completed,
                currentQuestionIndex: quizState.currentQuestionIndex,
                totalQuestions: quizState.questions.length
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error advancing question:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
