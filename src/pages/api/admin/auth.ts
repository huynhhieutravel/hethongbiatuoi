export const prerender = false;
import { env } from 'cloudflare:workers';

async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST({ request, cookies, locals }: { request: Request, cookies: any, locals: any }) {
    try {
        const body = await request.json();
        const { action, username, password, newPassword } = body;
        
        const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
        if (!db) {
            return new Response(JSON.stringify({ error: "DB not connected" }), { status: 500 });
        }

        if (action === 'login') {
            const user: any = await db.prepare("SELECT * FROM User WHERE username = ?").bind(username).first();
            
            if (!user) {
                return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
            }

            const inputHash = await sha256(password);
            
            if (inputHash === user.password_hash) {
                // Set cookie for 30 days
                cookies.set('admin_session', user.id.toString(), {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 30
                });
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            } else {
                return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
            }
        }
        
        if (action === 'change_password') {
            const sessionCookie = cookies.get('admin_session');
            if (!sessionCookie) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }
            const userId = sessionCookie.value;

            const oldHash = await sha256(password);
            const newHash = await sha256(newPassword);

            const user: any = await db.prepare("SELECT password_hash FROM User WHERE id = ?").bind(userId).first();
            
            if (!user || user.password_hash !== oldHash) {
                return new Response(JSON.stringify({ error: "Mật khẩu cũ không chính xác" }), { status: 400 });
            }

            await db.prepare("UPDATE User SET password_hash = ? WHERE id = ?").bind(newHash, userId).run();

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        if (action === 'logout') {
            cookies.delete('admin_session', { path: '/' });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
