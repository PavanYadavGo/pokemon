$(document).ready(function() {
    const cardContainer = $('#cardContainer');

    // Fetch Pokémon data
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => response.json())
        .then(data => {
            const pokemonList = data.results.sort((a, b) => {
                const idA = extractIdFromUrl(a.url);
                const idB = extractIdFromUrl(b.url);
                return idA - idB;
            });
            displayPokemonCards(pokemonList);
        })
        .catch(error => {
            console.error('Failed to fetch Pokémon data:', error);
        });

    // Function to extract ID from Pokémon URL
    function extractIdFromUrl(url) {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 2]);
    }

    // Function to get the URL of the 3D model for a Pokémon
    function getPokemonImageUrl(pokemonId) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    }

    // Function to display Pokémon cards
    function displayPokemonCards(pokemonList) {
        cardContainer.html(''); // Clear existing cards

        pokemonList.forEach(pokemon => {
            const card = createPokemonCard(pokemon);
            cardContainer.append(card);
        });
    }

    // Function to create a Pokémon card
    function createPokemonCard(pokemon) {
        const card = $('<div>').addClass('col');
        const cardContent = `
            <div class="card h-100">
                <div class="card-body">
                    <img class="pokemon-image" src="${getPokemonImageUrl(extractIdFromUrl(pokemon.url))}" alt="${pokemon.name}">
                    <h5 class="card-title">${pokemon.name}</h5>
                    <p class="card-text">ID: #${extractIdFromUrl(pokemon.url)}</p>
                </div>
            </div>
        `;
        card.html(cardContent);
        return card;
    }

    // Event listener for Mega Evolution button
    $('#megaEvolutionButton').on('click', function() {
        window.location.href = 'mega-evolutions.html'; // Change the URL to the Mega Evolution page
    });
});
