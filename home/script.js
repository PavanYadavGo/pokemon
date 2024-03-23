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
          console.error('Error fetching Pokemon data:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching Pokemon list:', error);
    });
}

function fetchPokemon(limit) {
  // Fetch Pokémon data
  fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}`)
    .then(response => response.json())
    .then(data => {
      const pokemonList = data.results;
      const pokemonPromises = pokemonList.map(pokemon => fetchPokemonData(pokemon.url));
      Promise.all(pokemonPromises)
        .then(pokemons => {
          displayPokemonList(pokemons);
          document.getElementById('loader').style.display = 'none'; // Hide loader after content is loaded
          document.getElementById('pokedexContainer').style.display = 'block'; // Show Pokédex container after content is loaded
        })
        .catch(error => {
          console.error('Error fetching Pokémon data:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching Pokémon list:', error);
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

document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = document.querySelectorAll('img.lazy');
  if ("IntersectionObserver" in window) {
    var lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});