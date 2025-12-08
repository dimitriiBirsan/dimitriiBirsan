import type { APIRoute } from 'astro';
import { roomsStore } from '../../../lib/roomStore';


export const GET: APIRoute = async ({ url }) => {
    try {
        const roomId = url.searchParams.get('roomId');

        if (!roomId) {
            return new Response(
                JSON.stringify({ message: 'Missing roomId parameter' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const users = roomsStore.get(roomId) || [];

        return new Response(
            JSON.stringify({
                success: true,
                roomId,
                users
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
