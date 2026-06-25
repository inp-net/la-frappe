import { env } from "$env/dynamic/private";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { handle as authjsHandle } from "$lib/server/auth";

const fakeAuthHandle: Handle = async ({ event, resolve }) => {
    if (env.DEV_FAKE_AUTH === "true") {
        event.locals.auth = async () => ({
            user: { name: "Utilisateur Test", groups: ["admin"] },
        });
        return resolve(event);
    }
    return resolve(event);
};

const realAuthHandle: Handle = async ({ event, resolve }) => {
    if (env.DEV_FAKE_AUTH === "true") {
        return resolve(event);
    }
    
    return authjsHandle({ event, resolve });
};

export const handle = sequence(fakeAuthHandle, realAuthHandle);
