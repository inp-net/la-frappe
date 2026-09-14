import { env } from "$env/dynamic/private";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { handle as authjsHandle } from "$lib/server/auth";

const fakeAuthHandle: Handle = async ({ event, resolve }) => {
    if (env.DEV_FAKE_AUTH === "true") {
        event.locals.auth = async () => ({
            user: { name: "Utilisateur Test" },
            expires: new Date(Date.now() + 86400000).toISOString(),
        });
        event.locals.isAdmin = true;
    }
    return resolve(event);
};

const realAuthHandle: Handle = async ({ event, resolve }) => {
    if (env.DEV_FAKE_AUTH === "true") {
        return resolve(event);
    }
    
    return authjsHandle({ 
        event, 
        resolve: async (event) => {
            const session = await event.locals.auth();
            const groups = (session?.user as any)?.groups || [];
            
            event.locals.isAdmin = groups.includes('root-inp');
            
            return resolve(event);
        } 
    });
};

export const handle = sequence(fakeAuthHandle, realAuthHandle);
