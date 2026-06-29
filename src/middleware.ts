import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
    const { url, cookies, redirect } = context;

    const path = url.pathname.endsWith('/') && url.pathname.length > 1 
        ? url.pathname.slice(0, -1) 
        : url.pathname;

    // Protect all /admin routes except /admin/login
    if (path.startsWith('/admin') && path !== '/admin/login') {
        const sessionCookie = cookies.get('admin_session');
        
        if (!sessionCookie || !sessionCookie.value) {
            return redirect('/admin/login', 302);
        }
    }

    // Protect all /api/admin routes except /api/admin/auth
    if (path.startsWith('/api/admin') && path !== '/api/admin/auth') {
        const sessionCookie = cookies.get('admin_session');
        
        if (!sessionCookie || !sessionCookie.value) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { 
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    return next();
});
