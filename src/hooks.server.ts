import { env } from "$env/dynamic/private";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

// Cas particulier pour tester en local sans Authentik
const fakeAuthHandle: Handle = async ({ event, resolve }) => {
    if (env.DEV_FAKE_AUTH === "true") {
        event.locals.auth = async () => ({
            user: { name: "Utilisateur Test" },
        });
    }
    return resolve(event);
};

const realAuthHandle: Handle = async ({ event, resolve }) => {
    if (env.DEV_FAKE_AUTH === "true") {
        return resolve(event);
    }
    
    const { handle: authjsHandle } = await import("$lib/server/auth");
    return authjsHandle({ event, resolve });
};

export const handle = sequence(fakeAuthHandle, realAuthHandle);
