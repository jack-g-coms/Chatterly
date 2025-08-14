const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const { app, server } = require("./express");
const schema = require("./db/schema");

dotenv.config({path: path.join(__dirname, ".env")});

schema();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/v1", require("./api"));

server.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});