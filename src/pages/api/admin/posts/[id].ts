export const prerender = false;
import { env } from 'cloudflare:workers';

export async function GET({ params, locals }: { params: any, locals: any }) {
    try {
        const id = params.id;
        const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
        if (!db) {
            return new Response(JSON.stringify({ error: "DB not connected" }), { status: 500 });
        }

        const post = await db.prepare("SELECT * FROM Post WHERE id = ?").bind(id).first();
        if (!post) {
            return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(post), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function PUT({ params, request, locals }: { params: any, request: Request, locals: any }) {
    try {
        const id = params.id;
        const body = await request.json();
        const { title, slug, type, excerpt, content, featuredImage } = body;

        const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
        if (!db) {
            return new Response(JSON.stringify({ error: "DB not connected" }), { status: 500 });
        }

        if (!title || !slug) {
            return new Response(JSON.stringify({ error: "Title and slug are required" }), { status: 400 });
        }

        const now = new Date().toISOString().replace('T', ' ').split('.')[0];
        
        await db.prepare(
            `UPDATE Post 
             SET title = ?, slug = ?, type = ?, excerpt = ?, content = ?, featuredImage = ?, updatedAt = ?
             WHERE id = ?`
        ).bind(
            title, 
            slug, 
            type || 'post', 
            excerpt || null, 
            content || null, 
            featuredImage || null,
            now,
            id
        ).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function DELETE({ params, locals }: { params: any, locals: any }) {
    try {
        const id = params.id;
        const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
        if (!db) {
            return new Response(JSON.stringify({ error: "DB not connected" }), { status: 500 });
        }

        await db.prepare("DELETE FROM Post WHERE id = ?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
