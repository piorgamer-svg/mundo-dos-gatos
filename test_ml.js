const cheerio = require("cheerio");

async function testML(url) {
  try {
    // Attempt 1: Regex to find MLB ID and use official API
    const mlbMatch = url.match(/MLB[-_]?\d+/i);
    if (mlbMatch) {
      const id = mlbMatch[0].replace(/[-_]/g, "").toUpperCase();
      console.log("Found ID:", id);
      
      // Try Items API
      let apiRes = await fetch(`https://api.mercadolibre.com/items/${id}`);
      if (apiRes.ok) {
        const data = await apiRes.json();
        console.log("Found via Items API:", data.title, data.price);
        return;
      }
      
      // Try Products API (for /p/ URLs)
      apiRes = await fetch(`https://api.mercadolibre.com/products/${id}`);
      if (apiRes.ok) {
        const data = await apiRes.json();
        console.log("Found via Products API:", data.name, data.buy_box_winner?.price);
        return;
      }
    }

    // Attempt 2: Fallback scraping with better headers
    console.log("API failed, trying scraping fallback...");
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let title = $('meta[property="og:title"]').attr("content");
    let imageUrl = $('meta[property="og:image"]').attr("content");
    
    console.log("Scraped Title:", title);
    console.log("Scraped Image:", imageUrl);
    
  } catch (e) {
    console.error("Error:", e);
  }
}

testML("https://www.mercadolivre.com.br/racao-umida-whiskas-sache-gato-adulto-carne-ao-molho-85g-20-unidades/p/MLB19574488");
testML("https://produto.mercadolivre.com.br/MLB-2720930431-racao-whiskas-sache-gato-adulto-carne-ao-molho-_JM");
