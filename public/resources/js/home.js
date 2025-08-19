import * as notifications from "./modules/notifications.js";

notifications.attach();

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

document.querySelector("#signup-btn").addEventListener("click", (e) => {
    window.location.href = "/signup";
});

document.querySelector("#login-btn").addEventListener("click", (e) => {
    window.location.href = "/login";
});

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const response = await fetch("/api/v1/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(new FormData(signupForm))
    });

    const resData = await response.json();
    if (response.status == 409) {
        notifications.create("error", "Failed", resData.error);
    } else if (response.status == 400 || response.status == 500) {
        notifications.create("error", "Failed", `Error: ${resData.error}`);
    } else if (response.status == 200) {
        notifications.create("success", "Success", "You can now login to Chatterly with these credentials!");
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
        notifications.create("error", "Failed", resData.error);
    } else if (response.status == 400 || response.status == 500) {
        notifications.create("error", "Failed", `Error: ${resData.error}`);
    } else if (response.status == 200) {
        window.location.href = "/chat";
    }
});

if (window.location.pathname == "/login") {
    loginForm.parentElement.style.display = "flex";
    signupForm.parentElement.style.display = "none";
} else if (window.location.pathname == "/signup") {
    loginForm.parentElement.style.display = "none";
    signupForm.parentElement.style.display = "flex";
}