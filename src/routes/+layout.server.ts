import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
    const themeCookie = cookies.get('theme');
    
    return {
        theme: themeCookie || 'light',
        isAdmin: locals.isAdmin
    };
};
