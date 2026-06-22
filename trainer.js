const username =
localStorage.getItem("username");

const email =
localStorage.getItem("email");

const age =
localStorage.getItem("age");

const trainerId =
Math.floor(Math.random() * 100000);

document.getElementById("trainerCard").innerHTML = `

<div class="pokemon-trainer-card" onclick="location.href='game.html'">
    <div class="card-info">

        <h2>TRAINER CARD</h2>

        <p><strong>Name:</strong> ${username}</p>

        <p><strong>Age:</strong> ${age}</p>

        <p><strong>ID:</strong> ${trainerId}</p>

        <p><strong>Rank:</strong> Evolution 1</p>

    </div>

</div>

`;