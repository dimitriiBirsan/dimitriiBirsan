// Shared in-memory storage for rooms across API endpoints
// This ensures the same Map instance is used by all API routes

const store = globalThis as any;

if (!store.__roomsStore) {
    store.__roomsStore = new Map<string, string[]>();
}

export const roomsStore: Map<string, string[]> = store.__roomsStore;
