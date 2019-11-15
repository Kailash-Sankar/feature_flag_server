var express = require("express");
var authRouter = require("./auth");
var ffRouter = require("./feature");

var app = express();

app.use("/auth/", authRouter);
app.use("/", ffRouter);

module.exports = app;
