 const form = document.getElementById("loginForm");
const loadingScreen = document.getElementById("loadingScreen");

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
form.addEventListener("submit", function(event){

    event.preventDefault();

    const email =
    document.getElementById("Email").value;

    const password =
    document.getElementById("Password").value;

    const error =
    document.getElementById("error");

    fetch("http://localhost:3000/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            email,
            password

        })

    })

    .then(response=>response.json())

    .then(data=>{
if(data.token){

    localStorage.setItem("token",data.token);

    localStorage.setItem("username",data.user.username);

    localStorage.setItem("email",data.user.email);

    localStorage.setItem("age",data.user.age);

    showPopup(data.message);

    document.getElementById("loadingScreen").classList.add("show");

    setTimeout(() => {
        window.location.href="trainer.html";
    }, 1500);

}

        else{

            error.textContent=data.message;

        }

    })

    .catch(err=>{

        console.log(err);

    });

});