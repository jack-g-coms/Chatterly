const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const users = require("./db/users");

const requireRESTLogin = async (req, res, next) => {
    const token = req.cookies?.auth_token;
    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await users.getUser(decoded?.userId);
        if (user) {
            req.user = user.getSafeView();
            next();
        } else {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

const requiresSocketLogin = async (ws, next) => {
    const cookieString = ws.handshake.headers.cookie;
    if (!cookieString) {
        return;
    }
    
    const token = cookie.parse(cookieString)?.auth_token;
    if (!token) {
        return;
    }
    
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await users.getUser(decoded?.userId);
        if (user) {
            ws.data.user = user.getSafeView();
            next();
        }
    } catch (err) {
        throw err;
    }
};

module.exports = {
    requireRESTLogin,
    requiresSocketLogin
}