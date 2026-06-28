import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const db = (env as any)?.DB || (env as any)?.hethongbiatuoi_db;
  const r2 = (env as any)?.MEDIA_BUCKET || (env as any)?.hethongbiatuoi_media;
  if (!r2 || !db) return new Response(JSON.stringify({ error: { message: 'R2/DB not configured' } }), { status: 500 });

  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) return new Response(JSON.stringify({ error: { message: 'No file' } }), { status: 400 });

  const timestamp = Date.now();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
  const key = `uploads/${timestamp}-${safeName}`;

  await r2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });

  const mediaUrl = 'https://media.hethongbiatuoi.com';
  const url = `${mediaUrl}/${key}`;
  const mediaId = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.prepare(
    `INSERT INTO Media (id, url, filename, mimeType, sizeBytes, createdAt) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(mediaId, url, file.name, file.type, file.size, now).run();

  return new Response(JSON.stringify({
    success: true,
    data: { id: mediaId, url, filename: file.name, title: '', size: file.size, createdAt: now }
  }), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
