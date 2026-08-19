fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://produto.mercadolivre.com.br/MLB-6191239086-mac-cosmetics-batom-matte-macximal-velvet-teddy-cor-velvet-teddy-matte'))
  .then(response => {
    if (response.ok) return response.json();
    throw new Error('Network response was not ok.')
  })
  .then(data => {
    const html = data.contents;
    if (html.includes('Verifique que no eres un robot')) {
       console.log("BLOCKED BY CAPTCHA");
    } else {
       console.log("SUCCESS! HTML Length: " + html.length);
    }
  })
  .catch(error => console.error(error));
