const database = require("./index");

const User = require("../classes/user");

const getUser = (query) => {
    return new Promise((resolve, reject) => {
        if (typeof query == "number") {
            database.get(
                `SELECT * FROM users WHERE userId = ?`,
                [query],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(new User(row));
                    }
                }
            )
        } else if (typeof query == "string") {
            database.get(
                `SELECT * FROM users WHERE username = ?`,
                [query],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(new User(row));
                    }
                }
            )
        } else {
            reject(new Error("getUser query must be a number (id) or a string (username)"))
        }
    });
}

const createUser = (username, password) => {
    return new Promise((resolve, reject) => {
        database.run(
            `INSERT INTO users (username, password) VALUES (?, ?)`,
            [username, password],
            (err) => {
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
    getUser,
    createUser
}