const puppeteer = require('puppeteer');

async function testScrape() {
  const url = "https://produto.mercadolivre.com.br/MLB-2720930431-racao-whiskas-sache-gato-adulto-carne-ao-molho-_JM";
  console.log("Launching puppeteer...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set user agent to appear like a normal browser
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  
  console.log("Navigating...");
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  
  console.log("Extracting...");
  const data = await page.evaluate(() => {
    // Tenta pegar o título
    let title = document.querySelector('h1.ui-pdp-title')?.innerText;
    if (!title) {
        title = document.querySelector('meta[property="og:title"]')?.content;
    }
    
    // Tenta pegar a imagem
    let imageUrl = document.querySelector('meta[property="og:image"]')?.content;
    if (imageUrl && imageUrl.includes('logo__small')) imageUrl = null;
    if (!imageUrl) {
        imageUrl = document.querySelector('.ui-pdp-gallery__figure img')?.src;
    }

    // Tenta pegar o preço
    let priceText = document.querySelector('.ui-pdp-price__second-line .andes-money-amount__fraction')?.innerText;
    let price = priceText ? `R$ ${priceText}` : null;
    
    return { title, imageUrl, price };
  });
  
  console.log("Result:", data);
  await browser.close();
}

testScrape().catch(console.error);
