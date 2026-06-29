export const prerender = false;
import { env } from 'cloudflare:workers';

export async function POST({ request, locals }: { request: Request, locals: any }) {
    try {
        const body = await request.json();
        const { title, slug, type, excerpt, content, featuredImage } = body;

        const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
        if (!db) {
            return new Response(JSON.stringify({ error: "DB not connected" }), { status: 500 });
        }

        // Validate basic fields
        if (!title || !slug) {
            return new Response(JSON.stringify({ error: "Title and slug are required" }), { status: 400 });
        }

        const now = new Date().toISOString().replace('T', ' ').split('.')[0];
        
        const result = await db.prepare(
            `INSERT INTO Post (title, slug, type, excerpt, content, featuredImage, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            title, 
            slug, 
            type || 'post', 
            excerpt || null, 
            content || null, 
            featuredImage || null,
            now,
            now
        ).run();

        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { status: 201 });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
