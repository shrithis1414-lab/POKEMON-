const token = localStorage.getItem("token");
const email = localStorage.getItem("email");

if (!token) {

    window.location.href = "login.html";

}

if (email !== "admin@gmail.com") {

    alert("Access Denied! Admins only.");

    window.location.href = "../frontend/trainer.html";

}

async function loadTrainers() {

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/trainers", {

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    const trainers = await response.json();

    const table = document.getElementById("trainerTable");

    table.innerHTML = "";

    trainers.forEach(trainer => {

        table.innerHTML += `

        <tr>

            <td>${trainer.id}</td>

            <td>${trainer.username}</td>

            <td>${trainer.email}</td>

            <td>${trainer.age}</td>

            <td>

                <button onclick="editTrainer(${trainer.id}, '${trainer.username}', '${trainer.email}', ${trainer.age})">
                    Edit
                </button>

                <button onclick="deleteTrainer(${trainer.id})">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

async function deleteTrainer(id) {

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/trainers/${id}`, {

        method: "DELETE",

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    loadTrainers();

}

async function editTrainer(id, username, email, age) {

    const token = localStorage.getItem("token");

    const newName = prompt("Username:", username);

    const newEmail = prompt("Email:", email);

    const newAge = prompt("Age:", age);

    await fetch(`http://localhost:3000/trainers/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({

            username: newName,
            email: newEmail,
            age: newAge

        })

    });

    localStorage.setItem("username", newName);
    localStorage.setItem("email", newEmail);
    localStorage.setItem("age", newAge);

    loadTrainers();

}

loadTrainers();