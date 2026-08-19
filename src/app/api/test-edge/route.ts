export const runtime = 'edge';
export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || 'MLB6191239086';
  
  try {
    const response = await fetch('https://api.mercadolibre.com/items/' + id, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return new Response(JSON.stringify({ success: true, price: data.price, title: data.title }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const errorText = await response.text();
      return new Response(JSON.stringify({ success: false, status: response.status, error: errorText }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.toString() }));
  }
}
