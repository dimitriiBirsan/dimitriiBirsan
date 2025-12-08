// WebSocket upgrade endpoint
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    return new Response('WebSocket endpoint - upgrade connection required', {
        status: 426, // Upgrade Required
        headers: {
            'Content-Type': 'text/plain',
        },
    });
};
