import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { roomsStore } from '../../../lib/roomStore';
import { quizStore } from '../../../lib/quizStore';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { roomId, quizId } = body;

        if (!roomId || !quizId) {
            return new Response(
                JSON.stringify({ message: 'Missing roomId or quizId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if room exists and has users
        const room = roomsStore.get(roomId);
        if (!room || room.length === 0) {
            return new Response(
                JSON.stringify({ message: 'Room not found or has no users' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Load quiz from MDX content collection
        const quizEntry = await getEntry('quiz', quizId);
        if (!quizEntry) {
            return new Response(
                JSON.stringify({ message: 'Quiz not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { title, questions } = quizEntry.data;

        // Initialize quiz state
        const quizState = {
            roomId,
            quizId,
            title,
            questions,
            currentQuestionIndex: 0,
            questionStartTime: new Date(),
            answers: new Map(),
            scores: new Map(room.map(username => [username, 0])),
            isActive: true
        };

        quizStore.set(roomId, quizState);

        return new Response(
            JSON.stringify({
                success: true,
                roomId,
                quizId,
                title,
                totalQuestions: questions.length
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error starting quiz:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
