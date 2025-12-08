import type { APIRoute } from 'astro';
import { roomsStore } from '../../../lib/roomStore';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { roomId, username } = body;

        if (!roomId || !username) {
            return new Response(
                JSON.stringify({ message: 'Missing roomId or username' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Get or create room
        if (!roomsStore.has(roomId)) {
            roomsStore.set(roomId, []);
        }

        const room = roomsStore.get(roomId)!;

        // Check if username already exists in room
        if (room.includes(username)) {
            return new Response(
                JSON.stringify({ message: 'Username already taken in this room' }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Add user to room
        room.push(username);

        return new Response(
            JSON.stringify({
                success: true,
                roomId,
                username,
                users: room
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
