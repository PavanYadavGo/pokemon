document.addEventListener('DOMContentLoaded', function() {
    // Array of Mega Evolution Pokémon names
    const megaPokemonNames = [
        'venusaur-mega', 'charizard-mega-x', 'charizard-mega-y', 'blastoise-mega',
        'alakazam-mega', 'gengar-mega', 'kangaskhan-mega', 'pinsir-mega',
        'gyarados-mega', 'aerodactyl-mega', 'mewtwo-mega-x', 'mewtwo-mega-y',
        'ampharos-mega', 'scizor-mega', 'heracross-mega', 'houndoom-mega',
        'tyranitar-mega', 'blaziken-mega', 'gardevoir-mega', 'mawile-mega',
        'aggron-mega', 'medicham-mega', 'manectric-mega', 'banette-mega',
        'absol-mega', 'garchomp-mega', 'lucario-mega', 'abomasnow-mega',
        'beedrill-mega', 'pidgeot-mega', 'slowbro-mega', 'steelix-mega',
        'sceptile-mega', 'swampert-mega', 'sableye-mega', 'sharpedo-mega',
        'camerupt-mega', 'altaria-mega', 'glalie-mega', 'salamence-mega',
        'metagross-mega', 'latias-mega', 'latios-mega', 'rayquaza-mega',
        'lopunny-mega', 'gallade-mega', 'audino-mega', 'diancie-mega',
        'charizard-mega-x', 'charizard-mega-y' // Charizard listed twice for both X and Y forms
    ];

    // Fetch data for each Mega Evolution Pokémon
    megaPokemonNames.forEach(pokemonName => {
        fetchPokemonData(pokemonName);
    });

    function fetchPokemonData(pokemonName) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokemon not found!');
                }
                return response.json();
            })
            .then(data => {
                displayPokemonCard(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function displayPokemonCard(pokemon) {
        const pokemonList = document.getElementById('pokemonList');

        // Create card element
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'pokemon-card');

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card', 'shadow');

        // Create image element
        const image = document.createElement('img');
        image.src = pokemon.sprites.other['official-artwork'].front_default;
        image.alt = pokemon.name;
        image.classList.add('card-img-top');

        // Create card title
        const cardTitle = document.createElement('h5');
        cardTitle.textContent = pokemon.name.toUpperCase();
        cardTitle.classList.add('card-title', 'text-center', 'mt-2');

        // Create ID element
        const idElement = document.createElement('p');
        idElement.textContent = `#${pokemon.id}`;
        idElement.classList.add('text-center', 'mb-2');

        // Append elements
        cardBody.appendChild(image);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(idElement);
        card.appendChild(cardBody);
        pokemonList.appendChild(card);
    }
    const pokemonList = document.getElementById('pokemonList');

    // Fetch data for all Pokémon
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Pokémon data');
            }
            return response.json();
        })
        .then(data => {
            const sortedPokemon = data.results.sort((a, b) => {
                const idA = extractIdFromUrl(a.url);
                const idB = extractIdFromUrl(b.url);
                return idA - idB;
            });
            sortedPokemon.forEach(pokemon => {
                fetchPokemonData(pokemon.url);
            });
        })
        .catch(error => {
            console.error(error);
        });

    function fetchPokemonData(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokemon not found!');
                }
                return response.json();
            })
            .then(data => {
                displayPokemonCard(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function extractIdFromUrl(url) {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 2]);
    }

    function displayPokemonCard(pokemon) {
        // Create card element
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'pokemon-card');

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card', 'shadow');

        // Create image element
        const image = document.createElement('img');
        image.src = pokemon.sprites.other['official-artwork'].front_default;
        image.alt = pokemon.name;
        image.classList.add('card-img-top');

        // Create card title (using h2 for the Pokémon ID)
        const cardTitle = document.createElement('h2');
        cardTitle.textContent = `#${pokemon.id}`; // Display Pokémon ID
        cardTitle.classList.add('card-title', 'text-center', 'mt-2');

        // Create paragraph element for Pokémon name
        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = pokemon.name.toUpperCase(); // Display Pokémon name
        nameParagraph.classList.add('card-text', 'text-center', 'mb-1');

        // Create paragraph element for Pokémon types
        const typesParagraph = document.createElement('p');
        const types = pokemon.types.map(type => type.type.name).join(', '); // Get Pokémon types
        typesParagraph.textContent = `Type: ${types}`; // Display Pokémon types
        typesParagraph.classList.add('card-text', 'text-center');

        // Append elements
        cardBody.appendChild(image);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(nameParagraph);
        cardBody.appendChild(typesParagraph);
        card.appendChild(cardBody);
        pokemonList.appendChild(card);
    }
});