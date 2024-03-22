function search() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
      .then(response => response.json())
      .then(data => {
        fetchPokemonImage(data.species.url);
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
      <div id="pokemonImage"></div>
      <p>ID: ${pokemon.id}</p>
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
    `;
  }
  
  function fetchPokemonImage(speciesUrl) {
    fetch(speciesUrl)
      .then(response => response.json())
      .then(data => {
        const imageUrl = data.sprites.other['official-artwork'].front_default;
        const imageContainer = document.getElementById('pokemonImage');
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Pokemon Image">`;
      })
      .catch(error => {
        console.error('Error fetching Pokemon image:', error);
      });
  }
  