function search() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
      .then(response => response.json())
      .then(data => {
        displayPokemon(data);
      })
      .catch(error => {
        console.error('Error fetching Pokemon data:', error);
        document.getElementById('pokemonInfo').innerHTML = 'Pokemon not found.';
      });
  }
  
  function displayPokemon(pokemon) {
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>ID: ${pokemon.id}</p>
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
    `;
  }
  