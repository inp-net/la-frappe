import { signOut } from '#lib/server/auth.js';
import type { Actions } from './$types.js';
export const actions: Actions = { default: signOut };
