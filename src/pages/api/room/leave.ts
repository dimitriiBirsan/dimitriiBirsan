import type { APIRoute } from 'astro';
import { roomsStore } from '../../../lib/roomStore';


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

        const room = roomsStore.get(roomId);

        if (room) {
            const index = room.indexOf(username);
            if (index > -1) {
                room.splice(index, 1);
            }

            // Remove room if empty
            if (room.length === 0) {
                roomsStore.delete(roomId);
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                roomId,
                username
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
