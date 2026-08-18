fetch('https://api.mercadolibre.com/items/MLB6191239086')
  .then(res => res.json())
  .then(data => console.log(data));
