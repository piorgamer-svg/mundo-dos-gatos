fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.mercadolibre.com/items/MLB6191239086'))
  .then(response => {
    if (response.ok) return response.json();
    throw new Error('Network response was not ok.')
  })
  .then(data => console.log(data.contents))
  .catch(error => console.error(error));
