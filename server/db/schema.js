const database = require("./index");

module.exports = () => {
    database.run(
        `CREATE TABLE IF NOT EXISTS users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255),
            password TEXT
        )
        `,
        (err) => {
            if (err) {
                throw err;
            }
        }
    );

    database.run(
        `CREATE TABLE IF NOT EXISTS messages (
            messageId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            content TEXT,
            timestamp INTEGER,
            FOREIGN KEY (userId) REFERENCES users(userId)
        )`,
        (err) => {
            if (err) {
                throw err;
            }
        }
    );
}