const express = require("express");
const bcrypt = require("bcrypt");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const { server } = require("./express");

const users = require("./db/users");
const messages = require("./db/messages");
const middleware = require("./middleware");

const wsServer = new socketIO.Server(server);
const router = express.Router();

wsServer.use(middleware.requiresSocketLogin)
wsServer.on("connection", (ws) => {
    ws.on("join", async (callback) => {
        try {
            const messageData = await messages.getMessages();

            callback({
                message: "Success",
                data: messageData
            });
        } catch (err) {
            callback({
                message: "Error",
                error: err.message
            });
        }
    });

    ws.on("message", async (content, callback) => {
        try {
            const messageId = await messages.createMessage(ws.data.user.userId, content);
            const messageData = await messages.getMessage(messageId);

            wsServer.emit("message", messageData);
            callback({
                message: "Success"
            });
        } catch (err) {
            callback({
                message: "Error",
                error: err.message 
            });
        }
    });
});

router.get("/me", middleware.requireRESTLogin, (req, res) => {
    res.status(200).json({
        message: "Success",
        data: req.user
    });
});

router.post("/logout", (req, res) => {
    res.clearCookie("auth_token");

    res.status(200).json({
        message: "Success"
    });
});

router.post("/login", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            error: "Missing required body keys"
        });
        return;
    }

    try {
        const user = await users.getUser(req.body.username);
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            res.status(401).json({
                error: "Invalid username or password"
            });
            return;
        }

        const jwtToken = jwt.sign(
            {userId: user.userId}, 
            process.env.JWT_SECRET, 
            {expiresIn: "1d"}
        );

        res.cookie("auth_token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "Success"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post("/signup", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            error: "Missing username or password"
        });
        return;
    }
    
    try {
        const user = await users.getUser(req.body.username);

        if (!user) {
            let hashedPswd = await bcrypt.hash(req.body.password, 10);

            if (hashedPswd) {
                await users.createUser(req.body.username, hashedPswd);
                res.status(200).json({
                    message: "Success"
                });
            }
        } else {
            res.status(409).json({
                error: "Username is already taken"
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;