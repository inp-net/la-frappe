import '@auth/sveltekit';

declare module '@auth/core/types' {
    interface User {
        nickname?: string;
        groups?: string[];
    }
    interface Session {
        user: User;
    }
}

declare module '@auth/sveltekit' {
    interface User {
        nickname?: string;
        groups?: string[];
    }
    interface Session {
        user: User;
    }
}

declare global {
    namespace App {
        interface Locals {
            auth(): Promise<import('@auth/sveltekit').Session | null>;
            isAdmin?: boolean;
        }
    }
}

export {};
