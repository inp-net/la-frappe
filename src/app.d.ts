import '@auth/sveltekit';

declare module '@auth/sveltekit' {
    interface User {
        nickname?: string;
        groups?: string[];
    }
}

declare global {
    namespace App {
        interface Locals {
            auth(): Promise<import("@auth/sveltekit").Session | null>;
            isAdmin?: boolean;
        }
        // interface Error {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
