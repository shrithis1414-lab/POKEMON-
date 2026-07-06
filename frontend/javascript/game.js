const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let score = 0;
let streak = 0;
let level = 1;
let allPokemon = [];

const pokemonImg = document.getElementById("pokemonImg");
const optionsDiv = document.getElementById("options");
const scoreText = document.getElementById("score");

let correctPokemon = "";
let recentlyShown = [];

function showPopup(message) {

    let popup = document.getElementById("customPopup");

    if (!popup) {
        popup = document.createElement("div");
        popup.id = "customPopup";
        document.body.appendChild(popup);
    }

    popup.textContent = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 2000);

}

function revealPokemon() {
    pokemonImg.style.filter = "brightness(1)";
}

async function fetchAllPokemon() {
    const response = await fetch("http://localhost:3000/pokemon");
    const data = await response.json();
    allPokemon = data;
}

async function loadProgress() {

    const response = await fetch("http://localhost:3000/progress", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    score = data.score;
    level = data.level;
    streak = data.streak;

}

async function saveProgress() {

    await fetch("http://localhost:3000/progress", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ score, level, streak })
    });

}

// Returns a random Pokemon, weighted by current level
function getRandomPokemon() {

    let weights;

    if (level <= 2) {
        weights = { easy: 100, medium: 0, hard: 0 };
    } else if (level <= 4) {
        weights = { easy: 70, medium: 30, hard: 0 };
    } else if (level <= 6) {
        weights = { easy: 50, medium: 35, hard: 15 };
    } else if (level <= 8) {
        weights = { easy: 30, medium: 40, hard: 30 };
    } else {
        weights = { easy: 15, medium: 35, hard: 50 };
    }

    const roll = Math.random() * 100;
    let chosenDifficulty;

    if (roll < weights.easy) {
        chosenDifficulty = "easy";
    } else if (roll < weights.easy + weights.medium) {
        chosenDifficulty = "medium";
    } else {
        chosenDifficulty = "hard";
    }

    let pool = allPokemon.filter(p => p.difficulty === chosenDifficulty);

    let freshPool = pool.filter(p => !recentlyShown.includes(p.name));

    if (freshPool.length === 0) {
        freshPool = pool.length > 0 ? pool : allPokemon;
    }

    const chosen = freshPool[Math.floor(Math.random() * freshPool.length)];

    recentlyShown.push(chosen.name);
    if (recentlyShown.length > 10) {
        recentlyShown.shift();
    }

    return chosen;
}

function loadPokemon() {
    optionsDiv.innerHTML = "";

    const correctData = getRandomPokemon();

    correctPokemon = correctData.name;

    pokemonImg.src = correctData.image_url;

    pokemonImg.style.filter = "brightness(0)";

    let choices = [correctPokemon];

    while (choices.length < 4) {
        const fakeData = allPokemon[Math.floor(Math.random() * allPokemon.length)];

        if (!choices.includes(fakeData.name)) {
            choices.push(fakeData.name);
        }
    }

    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    choices.forEach(name => {
        const button = document.createElement("button");
        button.textContent = name;

        button.addEventListener("click", () => {

            revealPokemon();

            if (name === correctPokemon) {

                showPopup("Correct! ");
                score++;
                streak++;

                if (streak === 5) {
                    level++;
                    streak = 0;
                    showPopup(`Level Up! You're now on Level ${level}`);
                }

            } else {

                showPopup(`Wrong! It was ${correctPokemon}`);
                streak = 0;

            }

            scoreText.textContent = `Score: ${score} | Level: ${level} | Streak: ${streak}/5`;

            saveProgress();

            setTimeout(() => {
                loadPokemon();
            }, 1000);

        });

        optionsDiv.appendChild(button);
    });
}

async function startGame() {
    await fetchAllPokemon();
    await loadProgress();
    scoreText.textContent = `Score: ${score} | Level: ${level} | Streak: ${streak}/5`;
    loadPokemon();
}

startGame();

document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.clear();

    window.location.href = "login.html";

});