require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { NODE_ENV } = require("./config");
const errorHandler = require("./error-handler");
const movieRouter = require("./movies/movie-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/movies", movieRouter)
app.get("/api", (req, res) => {
  res.send("Hello there! General Kenobi!");
});

app.use(errorHandler);

module.exports = app;
