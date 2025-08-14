const sqlite = require("sqlite3");
const path = require("path");

module.exports = new sqlite.Database(path.join(__dirname, "../database.db"));