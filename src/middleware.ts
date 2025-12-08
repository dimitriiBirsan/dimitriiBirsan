// Astro middleware for WebSocket setup
import type { MiddlewareHandler } from 'astro';
import { defineMiddleware } from 'astro:middleware';

// This middleware doesn't directly handle WebSockets (that's done in the server),
// but it can handle WebSocket-related auth/session management if needed

export const onRequest: MiddlewareHandler = async (context, next) => {
    // For WebSocket endpoint, just pass through
    if (context.url.pathname === '/api/ws') {
        return next();
    }

    // For all other requests, continue normally
    return next();
};
