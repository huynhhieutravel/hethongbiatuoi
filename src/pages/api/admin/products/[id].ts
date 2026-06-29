export const prerender = false;
import { env } from 'cloudflare:workers';

export async function GET({ params, locals }: { params: any, locals: any }) {
    try {
        const id = params.id;
        const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
        if (!db) {
            return new Response(JSON.stringify({ error: "DB not connected" }), { status: 500 });
        }

        const product = await db.prepare("SELECT * FROM Product WHERE id = ?").bind(id).first();
        if (!product) {
            return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(product), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function PUT({ params, request, locals }: { params: any, request: Request, locals: any }) {
    try {
        const id = params.id;
        const body = await request.json();
        const { title, slug, excerpt, content, featuredImage, price, volume, alcoholContent } = body;

        const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
        if (!db) {
            return new Response(JSON.stringify({ error: "DB not connected" }), { status: 500 });
        }

        if (!title || !slug) {
            return new Response(JSON.stringify({ error: "Title and slug are required" }), { status: 400 });
        }

        await db.prepare(
            `UPDATE Product 
             SET title = ?, slug = ?, excerpt = ?, content = ?, featuredImage = ?, price = ?, volume = ?, alcoholContent = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ?`
        ).bind(
            title, 
            slug, 
            excerpt || null, 
            content || null, 
            featuredImage || null,
            price || null,
            volume || null,
            alcoholContent || null,
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

        await db.prepare("DELETE FROM Product WHERE id = ?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
