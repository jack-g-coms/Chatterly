const socket = io({
    withCredentials: true
});

const chatContainer = document.querySelector(".chat-container");
const createMessageElement = (message) => {
    const dateTime = new Date(message.timestamp);

    const container = document.createElement("div");
    container.className = "message-container";
    container.style.order = message.messageId;
    
    const header = document.createElement("h4");
    header.innerHTML = `${message.user.username} on ${dateTime.toLocaleString()}`;
    
    const content = document.createElement("p");
    content.innerHTML = message.content;

    container.append(header, content);
    chatContainer.append(container);

    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });
};

const chatInput = document.querySelector(".chat-input");
chatInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && chatInput.value.length >= 1) {
        socket.emit("message", chatInput.value, ({message}) => {
            if (message == "Success") {
                chatInput.value = "";
            }
        });
    }
});

const logoutBtn = document.querySelector(".logout-btn");
logoutBtn.addEventListener("click", async (e) => {
    fetch("/api/v1/logout", {
        method: "POST",
        credentials: "include"
    }).then((res) => {
        window.location.href = "/login";
    });
});

socket.emit("join", ({message, error, data}) => {
    if (message != "Success") {
        throw new Error(`Failed to join chat: ${error}`);
    } else {
        socket.on("message", createMessageElement);
        data.forEach(createMessageElement);
    }
});

const chatInfoText = document.querySelector("#chat-info");
socket.on("connect_error", (err) => {
    chatInput.style.display = "none";
    logoutBtn.style.display = "none";
    chatInfoText.style.color = "#f54242";

    if (err.message == "Unauthorized") {
        chatInfoText.innerHTML = "Unable to use the chat feature as you are not logged in!";
    } else {
        chatInfoText.innerHTML = `Failed to connect to Chatterly servers: ${err.message}`;
    }
});