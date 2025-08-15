const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const signupErrorTxt = document.querySelector("#signup-error");
const loginErrorTxt = document.querySelector("#login-error")

const signupSuccessTxt = document.querySelector("#signup-success");

document.querySelector("#signup-btn").addEventListener("click", (e) => {
    signupForm.style.display = "flex";
    loginForm.style.display = "none";
    signupErrorTxt.style.display = "none";
    signupSuccessTxt.style.display = "none";
});

document.querySelector("#login-btn").addEventListener("click", (e) => {
    loginForm.style.display = "flex";
    signupForm.style.display = "none";
    loginErrorTxt.style.display = "none";
});

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupSuccessTxt.style.display = "none";

    const response = await fetch("/api/v1/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(new FormData(signupForm))
    });

    const resData = await response.json();
    if (response.status == 409) {
        signupErrorTxt.style.display = "block";
        signupErrorTxt.innerHTML = resData.error;
    } else if (response.status == 400 || response.status == 500) {
        signupErrorTxt.style.display = "block";
        signupErrorTxt.innerHTML = `Error: ${resData.error}`;
    } else if (response.status == 200) {
        signupSuccessTxt.style.display = "block";
    }
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(new FormData(loginForm))
    });

    const resData = await response.json();
    if (response.status == 401) {
        loginErrorTxt.style.display = "block";
        loginErrorTxt.innerHTML = resData.error;
    } else if (response.status == 400 || response.status == 500) {
        loginErrorTxt.style.display = "block";
        loginErrorTxt.innerHTML = `Error: ${resData.error}`;
    } else if (response.status == 200) {
        window.location.href = "/chat";
    }
});