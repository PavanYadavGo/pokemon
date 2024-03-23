document.addEventListener('DOMContentLoaded', function() {
  fetchAllPokemon();
});

function fetchAllPokemon() {
  fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000')
    .then(response => response.json())
    .then(data => {
      const pokemonList = data.results;
      const pokemonPromises = pokemonList.map(pokemon => fetchPokemonData(pokemon.url));
      Promise.all(pokemonPromises)
        .then(pokemons => {
          const sortedPokemons = pokemons.sort((a, b) => a.id - b.id);
          displayPokemonList(sortedPokemons);
        })
        .catch(error => {
          console.error('Error fetching Pokémon data:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching Pokémon list:', error);
    });
}

function fetchPokemonData(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return {
        name: data.name,
        id: data.id,
        height: data.height,
        weight: data.weight,
        image: data.sprites.front_default
      };
    })
    .catch(error => {
      console.error('Error fetching Pokémon data:', error);
    });
}

function displayPokemonList(pokemons) {
  const pokemonInfo = document.getElementById('pokemonInfo');
  pokemonInfo.innerHTML = '';
  pokemons.forEach(pokemon => {
    pokemonInfo.innerHTML += `
      <div class="pokemon">
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>ID: ${pokemon.id}</p>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
      </div>
    `;
  });
}
