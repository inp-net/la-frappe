import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const themeCookie = cookies.get('theme');
    
    return {
        theme: themeCookie || 'light'
    };
};
