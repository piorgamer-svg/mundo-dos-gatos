const cheerio = require("cheerio");

async function testMLGoogleBot() {
  const url = "https://produto.mercadolivre.com.br/MLB-2720930431-racao-whiskas-sache-gato-adulto-carne-ao-molho-_JM";
  console.log("Fetching with Googlebot...");
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Accept-Language": "pt-BR,pt;q=0.9",
    }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const title = $('meta[property="og:title"]').attr("content") || $("title").text();
  const imageUrl = $('meta[property="og:image"]').attr("content");
  
  console.log("Title:", title);
  console.log("Image:", imageUrl);
}

testMLGoogleBot();
