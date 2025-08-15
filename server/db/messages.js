const database = require("./index");

const getMessages = () => {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT messages.*, users.userId, users.username
                FROM messages
                JOIN users ON messages.userId = users.userId
                ORDER BY messages.timestamp DESC
            `,
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => {
                        return {
                            messageId: row.messageId,
                            content: row.content,
                            timestamp: row.timestamp,

                            user: {
                                userId: row.userId,
                                username: row.username
                            }
                        }
                    }));
                }
            }
        )
    });
}

const getMessage = (query) => {
    return new Promise((resolve, reject) => {
        if (typeof query == "number") {
            database.get(
                `SELECT messages.*, users.userId, users.username
                    FROM messages
                    JOIN users ON messages.userId = users.userId
                    WHERE messages.messageId = ?
                    ORDER BY messages.timestamp DESC
                `,
                [query],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row ? {
                            messageId: row.messageId,
                            content: row.content,
                            timestamp: row.timestamp,

                            user: {
                                userId: row.userId,
                                username: row.username
                            }
                        } : null);
                    }
                }
            )
        } else {
            reject(new Error("getMessage query must be a number (id)"));
        }
    });
}

const createMessage = (userId, content) => {
    return new Promise((resolve, reject) => {
        database.run(
            "INSERT INTO messages (content, userId, timestamp) VALUES (?, ?, ?)",
            [content, userId, Date.now()],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        )
    });
}

module.exports = {
    getMessages,
    getMessage,
    createMessage
}