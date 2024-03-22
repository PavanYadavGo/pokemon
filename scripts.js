// Fetch list of Pokémon names for autocomplete
fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
    .then(response => response.json())
    .then(data => {
        const pokemonList = data.results.map(pokemon => pokemon.name);
        attachAutocomplete(pokemonList);
    })
    .catch(error => {
        console.error('Failed to fetch Pokémon names:', error);
    });

function attachAutocomplete(pokemonList) {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const userInput = this.value.toLowerCase();
        const filteredPokemon = pokemonList.filter(pokemon => pokemon.startsWith(userInput));
        updateAutocompleteOptions(filteredPokemon);
    });
}

function updateAutocompleteOptions(pokemonOptions) {
    const datalist = document.getElementById('pokemonList');
    
    // Clear existing options
    datalist.innerHTML = '';
    
    pokemonOptions.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon;
        datalist.appendChild(option);
    });
}


document.getElementById('searchButton').addEventListener('click', searchPokemon);

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});

document.getElementById('addMoreButton').addEventListener('click', addMoreAttacks);

function searchPokemon() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm.length === 0) {
        hideAbilityCard();
        hideAttackCard();
        return;
    }

    let pokemonPromise;
    if (!isNaN(searchTerm)) {
        // If the search term is a number (ID), fetch Pokémon by ID
        const id = searchTerm.replace(/^0+/, ''); // Remove leading zeros
        pokemonPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    } else {
        // Otherwise, fetch Pokémon by name
        pokemonPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
    }

    pokemonPromise
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon not found!');
            }
            return response.json();
        })
        .then(data => {
            displayPokemon(data);
            getDominantColorFromImage(data.sprites.other['official-artwork'].front_default)
                .then(dominantColor => {
                    applyColors(dominantColor);
                })
                .catch(error => {
                    console.error('Failed to get dominant color:', error);
                });
        })
        .catch(error => {
            console.error(error.message);
            hideAbilityCard();
            hideAttackCard();
        });
}


function applyColors(dominantColor) {
    // Apply dominant color to the background of specific elements
    document.body.style.backgroundColor = dominantColor;
    document.getElementById('searchInput').style.backgroundColor = dominantColor;
    document.getElementById('abilityCard').style.backgroundColor = dominantColor;
    document.getElementById('attackCard').style.backgroundColor = dominantColor;
    document.getElementById('attackList').style.backgroundColor = dominantColor;

    // Determine text color based on brightness of dominant color
    const textColor = getTextColor(dominantColor);

    const textElements = document.querySelectorAll('body *');
    textElements.forEach(element => {
        element.style.color = textColor;
    });

    const attackItems = document.querySelectorAll('.attack-item');
    attackItems.forEach(item => {
        item.style.backgroundColor = dominantColor;
        // Determine text color based on brightness of the background color
        const attackItemTextColor = getTextColor(dominantColor);
        item.style.color = attackItemTextColor;
    });
}
function getTextColor(dominantColor) {
    // Convert bgColor to RGB
    const rgb = dominantColor.substring(4, dominantColor.length - 1)
                        .replace(/ /g, '')
                        .split(',');
    // Calculate luminance
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    // Set text color based on luminance
    return luminance > 0.5 ? 'black' : 'white';
}

function displayPokemon(pokemon) {
    const abilityCard = document.getElementById('abilityCard');
    const attackList = document.getElementById('attackList');
    const attackCard = document.getElementById('attackCard');

    // Display Pokémon types with icons
    pokemonTypes.innerHTML = ''; // Clear previous content
    pokemon.types.forEach(type => {
        const typeIcon = document.createElement('i');
        typeIcon.classList.add('fas'); // Font Awesome icon class
        typeIcon.classList.add(`fa-${getTypeIcon(type.type.name)}`); // Add type-specific icon class
        pokemonTypes.appendChild(typeIcon);
        pokemonTypes.appendChild(document.createTextNode(type.type.name));
        pokemonTypes.appendChild(document.createElement('br')); // Add line break between types
    });
    abilityCard.appendChild(pokemonTypes);

    // Apply dominant color as background color to specific elements
    getDominantColorFromImage(pokemon.sprites.other['official-artwork'].front_default)
        .then(dominantColor => {
            abilityCard.style.backgroundColor = dominantColor;
            attackCard.style.backgroundColor = dominantColor; // Apply to the attack card container
            attackList.style.backgroundColor = dominantColor; // Apply to the attack list container
            applyColors(dominantColor); // Apply text color based on dominant color
        })
        .catch(error => {
            console.error('Failed to determine dominant color:', error);
            // If failed to determine dominant color, set a fallback color
            abilityCard.style.backgroundColor = 'white'; // Fallback color
            attackCard.style.backgroundColor = 'white'; // Fallback color
            attackList.style.backgroundColor = 'white'; // Fallback color
            applyColors('black'); // Set text color to black as fallback
        });

    // Clear previous data
    abilityCard.innerHTML = '';
    attackList.innerHTML = '';

    // Display Pokémon image
    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemon.sprites.other['official-artwork'].front_default;
    pokemonImage.alt = pokemon.name;
    pokemonImage.classList.add('img-fluid', 'mb-2');
    abilityCard.appendChild(pokemonImage);

    // Display Pokémon name
    const pokemonName = document.createElement('h2');
    pokemonName.textContent = pokemon.name.toUpperCase();
    abilityCard.appendChild(pokemonName);

    // Display Pokémon types with icons
    const pokemonTypes = document.createElement('p');
    pokemon.types.forEach(type => {
        const typeIcon = document.createElement('i');
        typeIcon.classList.add('type-icon', `type-${type.type.name}`);
        pokemonTypes.appendChild(typeIcon);
        pokemonTypes.appendChild(document.createTextNode(type.type.name));
        pokemonTypes.appendChild(document.createElement('br')); // Add line break between types
    });
    abilityCard.appendChild(pokemonTypes);

    // Display Pokémon stats
    const stats = {
        'HP': pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat,
        'Special Attack': pokemon.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
        'Special Defense': pokemon.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
        'Speed': pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat
    };

    const pokemonStats = document.createElement('ul');
    pokemonStats.classList.add('list-group', 'pokemon-stats');
    Object.entries(stats).forEach(([statName, statValue]) => {
        const statItem = document.createElement('li');
        statItem.textContent = `${statName}: ${statValue}`;
        pokemonStats.appendChild(statItem);
    });
    abilityCard.appendChild(pokemonStats);

    // Display initial 20 Pokémon moves (attacks)
    displayAttacks(pokemon.moves.slice(0, 20));

    showAbilityCard();
    showAttackCard();
}

    // Update existing pokemonTypes element if it exists, or create a new one
    let pokemonTypes = document.getElementById('pokemonTypes');
    if (!pokemonTypes) {
        pokemonTypes = document.createElement('p');
        pokemonTypes.id = 'pokemonTypes';
        abilityCard.appendChild(pokemonTypes);
    } else {
        pokemonTypes.innerHTML = ''; // Clear existing content
    }

    // Add type icons and names
    pokemon.types.forEach(type => {
        const typeIcon = document.createElement('i');
        typeIcon.classList.add('fas'); // Font Awesome icon class
        typeIcon.classList.add(`fa-${getTypeIcon(type.type.name)}`); // Add type-specific icon class
        pokemonTypes.appendChild(typeIcon);
        pokemonTypes.appendChild(document.createTextNode(type.type.name));
        pokemonTypes.appendChild(document.createElement('br')); // Add line break between types
    });

function getTypeIcon(typeName) {
    // Map Pokémon type names to Font Awesome icons
    switch (typeName) {
        case 'normal':
            return 'fa-circle'; // Example icon for Normal type
        case 'fire':
            return 'fa-fire'; // Example icon for Fire type
        case 'water':
            return 'fa-tint'; // Example icon for Water type
        // Add cases for other types as needed
        default:
            return 'fa-question'; // Default icon for unknown type
    }
}
document.getElementById('deleteAttacksButton').addEventListener('click', deleteAttacks);

function deleteAttacks() {
    const attackList = document.getElementById('attackList');
    const numAttacksToRemove = 10;
    
    // Remove the last 10 attack items from the attack list
    for (let i = 0; i < numAttacksToRemove; i++) {
        if (attackList.lastChild) {
            attackList.removeChild(attackList.lastChild);
        } else {
            break; // No more attacks to remove
        }
    }
}

function addMoreAttacks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm.length === 0) {
        return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon not found!');
            }
            return response.json();
        })
        .then(data => {
            const attackList = document.getElementById('attackList');
            const startIndex = attackList.children.length;
            displayAttacks(data.moves.slice(startIndex, startIndex + 10));

            // Get the dominant color and apply it to the attack items
            getDominantColorFromImage(data.sprites.other['official-artwork'].front_default)
                .then(dominantColor => {
                    const attackItems = document.querySelectorAll('.attack-item');
                    attackItems.forEach(item => {
                        item.style.backgroundColor = dominantColor;
                        // Determine text color based on brightness of the background color
                        const attackItemTextColor = getTextColor(dominantColor);
                        item.style.color = attackItemTextColor;
                    });
                })
                .catch(error => {
                    console.error('Failed to get dominant color:', error);
                });
        })
        .catch(error => {
            console.error(error.message);
        });
}

function displayAttacks(attacks) {
    const attackList = document.getElementById('attackList');

    attacks.forEach(move => {
        const li = document.createElement('li');
        li.textContent = move.move.name;
        li.classList.add('attack-item');
        if (move.move.damage_class && move.move.damage_class.name === 'special') {
            li.classList.add('special-attack');
        }
        attackList.appendChild(li);
    });
}

function showAbilityCard() {
    document.getElementById('abilityCard').classList.remove('hidden');
}

function showAttackCard() {
    document.getElementById('attackCard').classList.remove('hidden');
}

function hideAbilityCard() {
    document.getElementById('abilityCard').classList.add('hidden');
}

function hideAttackCard() {
    document.getElementById('attackCard').classList.add('hidden');
}

function getDominantColorFromImage(imageSrc) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.crossOrigin = 'Anonymous';

        img.onload = function() {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            const dominantColorString = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
            resolve(dominantColorString);
        };

        img.onerror = function() {
            reject(new Error('Failed to load image'));
        };

        img.src = imageSrc;
    });
}
// JavaScript for adding animation classes
function showAbilityCard() {
    const abilityCard = document.getElementById('abilityCard');
    abilityCard.classList.remove('hidden');
    abilityCard.classList.add('animated'); // Add animated class
}

function showAttackCard() {
    const attackCard = document.getElementById('attackCard');
    attackCard.classList.remove('hidden');
    attackCard.classList.add('animated'); // Add animated class
}

function animateButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)'; // Scale the button on hover
        });
        button.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)'; // Reset button scale on mouseout
        });
    });
}

function searchPokemon() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm.length === 0) {
        hideAbilityCard();
        hideAttackCard();
        return;
    }

    let pokemonPromise;
    if (!isNaN(searchTerm)) {
        // If the search term is a number (ID), fetch Pokémon by ID
        const id = searchTerm.replace(/^0+/, ''); // Remove leading zeros
        pokemonPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    } else {
        // Otherwise, fetch Pokémon by name
        pokemonPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
    }

    pokemonPromise
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon not found!');
            }
            return response.json();
        })
        .then(data => {
            displayPokemon(data);
            getDominantColorFromImage(data.sprites.other['official-artwork'].front_default)
                .then(dominantColor => {
                    applyColors(dominantColor);
                    animateButtons(); // Add animation to buttons
                })
                .catch(error => {
                    console.error('Failed to get dominant color:', error);
                });
        })
        .catch(error => {
            console.error(error.message);
            hideAbilityCard();
            hideAttackCard();
        });
}
