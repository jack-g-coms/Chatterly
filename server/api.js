const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const socketIO = require("socket.io");
const { server } = require("./express");

const wsServer = new socketIO.Server(server);

const router = express.Router();

const User = require("./classes/user");
const users = [];

const messages = [];

const middleware = {};
middleware.requireRESTLogin = async (req, res, next) => {
    const token = req.cookies?.auth_token;
    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.userId === decoded?.userId);
    if (user) {
        req.user = user.getSafeView();
        next();
    } else {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }
};
middleware.requiresSocketLogin = async (ws, next) => {
    const cookieString = ws.handshake.headers.cookie;
    const token = cookie.parse(cookieString)?.auth_token;
    if (!token) {
        return;
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.userId === decoded?.userId);
    if (user) {
        ws.data.user = user.getSafeView();
        next();
    }
};

wsServer.use(middleware.requiresSocketLogin)
wsServer.on("connection", (ws) => {
    ws.on("join", (callback) => {
        callback({
            message: "Success",
            data: messages
        });
    });

    ws.on("message", (message, callback) => {
        const messageData = {
            user: ws.data.user,
            content: message
        };
        messages.push(messageData);
        wsServer.emit("message", messageData)
    });
});

router.get("/me", middleware.requireRESTLogin, (req, res) => {
    res.status(200).json({
        message: "Success",
        data: req.user
    });
});

router.post("/login", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            error: "Missing required body keys"
        });
        return;
    }

    const user = users.find(u => u.username === req.body.username);
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
        seure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).json({
        message: "Success"
    });
});

router.post("/signup", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            error: "Missing required body keys"
        });
        return;
    }

    const user = users.find(u => u.username === req.body.username);
    if (!user) {
        let hashedPswd;
        try {
            hashedPswd = await bcrypt.hashSync(req.body.password, 10);
        } catch {
            res.status(400).json({
                error: "Encryption failure"
            });
        }

        if (hashedPswd) {
            users.push(new User(users.length, req.body.username, hashedPswd));
            res.status(200).json({
                message: "Success"
            });
        }
    } else {
        res.status(409).json({
            error: "Username is already taken"
        });
    }
});

module.exports = router;