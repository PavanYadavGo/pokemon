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

// Function to display Pokémon cards
function displayPokemonCards(pokemonList) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // Clear existing cards

    pokemonList.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        cardContainer.appendChild(card);
    });
}

// Function to create a Pokémon card
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('col');

    const cardContent = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${pokemon.name}</h5>
                <p class="card-text">ID: ${extractIdFromUrl(pokemon.url)}</p>
            </div>
        </div>
    `;
    card.innerHTML = cardContent;

    return card;
}

});
