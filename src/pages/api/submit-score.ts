import type { APIRoute } from 'astro';
import db from '../../../db/config';
import QuizAttempts from '../../../db/config';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.json();

    // Validate data here...

    await db.insert(QuizAttempts).values({
        visitorId: data.visitorId,
        score: data.score,
        manipulationDetected: data.didSpotTrick,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}