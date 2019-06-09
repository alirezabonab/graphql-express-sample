const express = require("express");
const routes = require("./route");
const bodyparser = require("body-parser");
const config = require("./config");

const app = express();

app.use(bodyparser.json());



app.use("/api/v1", routes);

module.exports = app;
