// Client-side WebSocket utility
export type ClientEventType = 'join_room' | 'leave_room' | 'start_quiz' | 'submit_answer' | 'request_leaderboard' | 'advance_question' | 'get_current_state';
export type ServerEventType = 'connected' | 'users_updated' | 'quiz_started' | 'question_update' | 'user_answered' | 'show_leaderboard' | 'next_question' | 'quiz_complete' | 'error';

interface ClientEvent {
    type: ClientEventType;
    roomId: string;
    username?: string;
    userId?: string;
    quizId?: string;
    answer?: number;
}

interface ServerEvent {
    type: ServerEventType;
    data?: any;
}

type EventHandler = (data: any) => void;

export class QuizWebSocket {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private eventHandlers: Map<ServerEventType, EventHandler[]> = new Map();
    private roomId: string = '';
    private username: string = '';
    private userId: string = '';
    private shouldReconnect = true;

    constructor() {
        // Generate or retrieve user ID from localStorage
        this.userId = this.getOrCreateUserId();
    }

    private getOrCreateUserId(): string {
        let userId = localStorage.getItem('quiz_user_id');
        if (!userId) {
            userId = this.generateUUID();
            localStorage.setItem('quiz_user_id', userId);
        }
        return userId;
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    connect(roomId: string, username: string): Promise<void> {
        this.roomId = roomId;
        this.username = username;
        this.shouldReconnect = true;

        return new Promise((resolve, reject) => {
            // Connect to standalone WebSocket server on port 8080
            const wsUrl = `ws://localhost:8080`;

            console.log(`Connecting to WebSocket: ${wsUrl}`);

            try {
                this.ws = new WebSocket(wsUrl);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.reconnectAttempts = 0;

                    // Join room immediately
                    this.send({
                        type: 'join_room',
                        roomId: this.roomId,
                        username: this.username,
                        userId: this.userId,
                    });

                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message: ServerEvent = JSON.parse(event.data);
                        this.handleServerMessage(message);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                this.ws.onclose = (event) => {
                    console.log('WebSocket closed', event.code, event.reason);
                    this.ws = null;

                    if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnect();
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };
            } catch (error) {
                console.error('Error creating WebSocket:', error);
                reject(error);
            }
        });
    }

    private reconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(() => {
            if (this.shouldReconnect) {
                this.connect(this.roomId, this.username).catch(console.error);
            }
        }, delay);
    }

    private handleServerMessage(message: ServerEvent) {
        const handlers = this.eventHandlers.get(message.type);
        if (handlers) {
            handlers.forEach(handler => handler(message.data));
        }
    }

    on(eventType: ServerEventType, handler: EventHandler) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType)!.push(handler);
    }

    off(eventType: ServerEventType, handler: EventHandler) {
        const handlers = this.eventHandlers.get(eventType);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    send(event: Partial<ClientEvent>) {
        const fullEvent: ClientEvent = {
            roomId: this.roomId,
            username: this.username,
            userId: this.userId,
            ...event,
            type: event.type!,
        };

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(fullEvent));
        } else {
            console.warn('WebSocket not connected, cannot send message');
        }
    }

    close() {
        this.shouldReconnect = false;

        if (this.ws) {
            // Send leave room message before closing
            this.send({
                type: 'leave_room',
            });

            this.ws.close();
            this.ws = null;
        }

        this.eventHandlers.clear();
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    getUserId(): string {
        return this.userId;
    }
}

// Global singleton instance
let globalWs: QuizWebSocket | null = null;

export function getWebSocket(): QuizWebSocket {
    if (!globalWs) {
        globalWs = new QuizWebSocket();
    }
    return globalWs;
}

export function closeWebSocket() {
    if (globalWs) {
        globalWs.close();
        globalWs = null;
    }
}
