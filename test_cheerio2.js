const cheerio = require('cheerio');
fetch('https://produto.mercadolivre.com.br/MLB-6191239086-mac-cosmetics-batom-matte-macximal-velvet-teddy')
  .then(res => res.text())
  .then(html => {
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") || $('title').text();
    const image = $('meta[property="og:image"]').attr("content");
    let priceText = $('.ui-pdp-price__second-line .andes-money-amount__fraction').first().text();
    console.log({title, image, priceText});
  });
