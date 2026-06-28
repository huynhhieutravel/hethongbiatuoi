import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';

export const prerender = false;

export const PATCH: APIRoute = async ({ request }) => {
  const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
  if (!db) return new Response(JSON.stringify({ error: { message: 'DB not configured' } }), { status: 500 });

  const body = await request.json();
  const { id, title, altText, caption, description } = body;
  
  if (!id) return new Response(JSON.stringify({ error: { message: 'Missing ID' } }), { status: 400 });

  await db.prepare(
    `UPDATE Media SET title = ?, altText = ?, caption = ?, description = ? WHERE id = ?`
  ).bind(title || '', altText || '', caption || '', description || '', id).run();

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ request }) => {
  const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
  const r2 = (env as any)?.MEDIA_BUCKET || (env as any)?.hethongbiatuoi_media;
  if (!r2 || !db) return new Response(JSON.stringify({ error: { message: 'R2/DB not configured' } }), { status: 500 });

  const body = await request.json();
  const ids = body.ids || (body.id ? [body.id] : []);
  
  if (ids.length === 0) return new Response(JSON.stringify({ error: { message: 'Missing IDs' } }), { status: 400 });

  // Get URLs to delete from R2
  const placeholders = ids.map(() => '?').join(',');
  const { results } = await db.prepare(`SELECT url FROM Media WHERE id IN (${placeholders})`).bind(...ids).all();
  
  for (const item of results) {
    const url = item.url as string;
    const key = url.split('/').slice(-2).join('/'); // uploads/123-file.jpg
    if (key.startsWith('uploads/')) {
        await r2.delete(key);
    }
  }

  // Delete from DB
  await db.prepare(`DELETE FROM Media WHERE id IN (${placeholders})`).bind(...ids).run();

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
};
