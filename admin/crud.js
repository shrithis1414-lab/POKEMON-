 async function loadTrainers() {

    const response = await fetch("http://localhost:3000/trainers");

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

async function deleteTrainer(id){

    await fetch(`http://localhost:3000/trainers/${id}`,{

        method:"DELETE"

    });

    loadTrainers();

}

async function editTrainer(id, username, email, age){

    const newName = prompt("Username:", username);

    const newEmail = prompt("Email:", email);

    const newAge = prompt("Age:", age);

    await fetch(`http://localhost:3000/trainers/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:newName,
            email:newEmail,
            age:newAge

        })

    });
    
    localStorage.setItem("username", newName);
 localStorage.setItem("email", newEmail);
 localStorage.setItem("age", newAge);
    loadTrainers();

}

loadTrainers();