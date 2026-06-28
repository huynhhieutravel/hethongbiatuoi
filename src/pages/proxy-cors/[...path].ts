import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const path = params.path;
  if (!path) return new Response('Not found', { status: 404 });

  // Pass along the query parameters (like ?ver=3.17.0)
  const urlObj = new URL(request.url);
  const search = urlObj.search;
  
  const targetUrl = `https://hethongbiatuoi.com/${path}${search}`;
  
  try {
    const response = await fetch(targetUrl);
    const headers = new Headers(response.headers);
    // Force allow CORS
    headers.set('Access-Control-Allow-Origin', '*');
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (e) {
    return new Response('Proxy Error', { status: 500 });
  }
};
