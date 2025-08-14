const database = require("./index");

console.log(database)

module.exports = async () => {
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
}