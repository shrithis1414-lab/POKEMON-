const form = document.getElementById("regForm");

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

    localStorage.setItem(
        "username",
        username
    );

    localStorage.setItem(
        "email",
        email
    );

    localStorage.setItem(
        "age",
        age
    );

    window.location.href =
    "trainer.html";

});