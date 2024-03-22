$(document).ready(function() {
    const cardContainer = $('#cardContainer');

    // Fetch Pokémon data
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(response => response.json())
        .then(data => {
            const pokemons = data.results;
            pokemons.forEach(pokemon => {
                fetchPokemonData(pokemon.url);
            });
        })
        .catch(error => {
            console.error('Failed to fetch Pokémon data:', error);
        });

    // Function to fetch individual Pokémon data
    function fetchPokemonData(url) {
        fetch(url)
            .then(response => response.json())
            .then(pokemon => {
                createPokemonCard(pokemon);
            })
            .catch(error => {
                console.error('Failed to fetch Pokémon data:', error);
            });
    }

    // Function to create a Pokémon card
    function createPokemonCard(pokemon) {
        const card = $('<div class="card"></div>');
        const name = $('<h2>' + pokemon.name.toUpperCase() + '</h2>');
        const image = $('<img src="' + pokemon.sprites.other['official-artwork'].front_default + '" alt="' + pokemon.name + '">');
        const types = $('<p>Types: ' + pokemon.types.map(type => type.type.name).join(', ') + '</p>');

        card.append(name, image, types);
        cardContainer.append(card);
    }
});
