const form = document.getElementById("regForm");

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

    const username =
    document.getElementById("Username").value;

    const email =
    document.getElementById("Email").value;

    const age =
    document.getElementById("Age").value;

    const password =
    document.getElementById("Password").value;

    const error =
    document.getElementById("error");

    if(username === ""){
        error.textContent =
        "Username is required!";
        return;
    }

    if(email === ""){
        error.textContent =
        "Email is required!";
        return; 
        
    }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    error.textContent =
    "Please enter a valid email address!";
    return;
}

    if(age < 18){
        error.textContent =
        "You must be at least 18 years old!";
        return;
    }

    if(password === ""){
        error.textContent =
        "Password is required!";
        return;
    }

    if(password.length < 8){
        error.textContent =
        "Password must be at least 8 characters!";
        return;
    }

    error.textContent = "";

    fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        username,
        email,
        age,
        password
    })
})
.then(response => response.json())
.then(data => {

    showPopup(data.message);

   if(data.message === "Trainer Registered Successfully!"){

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("age", age);

    document.getElementById("loadingScreen").classList.add("show");

    setTimeout(() => {
        window.location.href = "trainer.html";
    }, 1500);

}

}) 
.catch(err => {

    console.log(err);

    error.textContent = "Something went wrong. Please try again.";

});

});