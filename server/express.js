const express = require("express");
const http = require("http");

module.exports.app = express();
module.exports.server = http.createServer(this.app);