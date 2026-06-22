let score = 0;

const pokemonImg = document.getElementById("pokemonImg");
const optionsDiv = document.getElementById("options");
const scoreText = document.getElementById("score");

let correctPokemon = "";


function revealPokemon() {
    pokemonImg.style.filter = "brightness(1)";
}

async function loadPokemon() {
    optionsDiv.innerHTML = "";

    const randomId = Math.floor(Math.random() * 151) + 1;

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
    );

    const data = await response.json();

    correctPokemon = data.name;

    pokemonImg.src = data.sprites.front_default;

    // hide Pokémon at start
    pokemonImg.style.filter = "brightness(0)";

    let choices = [correctPokemon];

    while (choices.length < 4) {
        const fakeId = Math.floor(Math.random() * 151) + 1;

        const fakeResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${fakeId}`
        );

        const fakeData = await fakeResponse.json();

        if (!choices.includes(fakeData.name)) {
            choices.push(fakeData.name);
        }
    }

    choices.sort(() => Math.random() - 0.5);

    choices.forEach(name => {
        const button = document.createElement("button");
        button.textContent = name;

        button.addEventListener("click", () => {

            // ALWAYS reveal first (correct or wrong)
            revealPokemon();

            if (name === correctPokemon) {
                alert("Correct! ");
                score++;
            } else {
                alert(`Wrong! It was ${correctPokemon}`);
            }

            scoreText.textContent = `Score: ${score}`;

            setTimeout(() => {
                loadPokemon();
            }, 1000);

        });

        optionsDiv.appendChild(button);
    });
}

loadPokemon();