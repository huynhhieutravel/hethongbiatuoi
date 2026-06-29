export const prerender = false;
import { env } from 'cloudflare:workers';

export async function POST({ request, locals }: { request: Request, locals: any }) {
    try {
        const body = await request.json();
        const { title, slug, excerpt, content, featuredImage, price, volume, alcoholContent } = body as any;

        const db = locals.runtime?.env?.DB || locals.runtime?.env?.hethongbiatuoi_db || (locals as any).env?.DB || (locals as any).env?.hethongbiatuoi_db;
        if (!db) {
            return new Response(JSON.stringify({ error: "DB not connected" }), { status: 500 });
        }

        // Validate basic fields
        if (!title || !slug) {
            return new Response(JSON.stringify({ error: "Title and slug are required" }), { status: 400 });
        }

        const now = new Date().toISOString().replace('T', ' ').split('.')[0];
        
        const { success } = await db.prepare(`
            INSERT INTO Product (title, slug, excerpt, content, featuredImage, price, volume, alcoholContent) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(title, slug, excerpt, content, featuredImage, price || null, volume || null, alcoholContent || null).run();

        if (success) {
            // Get the inserted id
            const product = await db.prepare("SELECT id FROM Product WHERE slug = ? ORDER BY id DESC LIMIT 1").bind(slug).first();
            return new Response(JSON.stringify({ success: true, id: product?.id }), { status: 201 });
        } else {
            return new Response(JSON.stringify({ error: 'Database insertion failed' }), { status: 500 });
        }
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
