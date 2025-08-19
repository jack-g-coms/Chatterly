const content = document.querySelector(".page-content");
let notificationsContainer;

export const attach = () => {
    const notificationsLink = document.createElement("link");
    notificationsLink.rel = "stylesheet";
    notificationsLink.href = "./resources/css/notifications.css";
    document.head.append(notificationsLink);

    notificationsContainer = document.createElement("div");
    notificationsContainer.className = "notifications-container";

    content.append(notificationsContainer);
}

const remove = (notification) => {
    notification.style.animation = "exit 0.5s forwards";
    notification.addEventListener("animationend", () => {
        notification.remove();
    }, { once: true });
}

export const create = (type = "success", title, text, duration = 5) => {
    if (!notificationsContainer) throw new Error("Cannot create a notification without first running the attach function.");

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.dataset.type = type;

    const header = document.createElement("div");
    const headerText = document.createElement("h3");
    header.className = "notification-header";
    headerText.innerHTML = title;

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.dataset.type = "icon";
    closeBtn.innerHTML = "X";

    closeBtn.addEventListener("click", () => {
        remove(notification);
    });

    header.append(headerText, closeBtn);
    
    const body = document.createElement("p");
    body.innerHTML = text;

    notification.append(header, body);
    notificationsContainer.append(notification);

    setTimeout(() => {
        if (notification) {
            remove(notification);
        }
    }, duration * 1000);
}