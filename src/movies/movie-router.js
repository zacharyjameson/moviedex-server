const path = require("path");
const express = require("express");
const xss = require("xss");
const MovieService = require("./movie-service");

const movieRouter = express.Router();
const jsonParser = express.json();

const serializeMovie = (movie) => ({
  id: movie.id,
  movie_title: movie.movie_title,
  year_released: movie.year_released,
  movie_poster: movie.movie_poster,
});

movieRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    MovieService.getAllMovies(knexInstance)
      .then((movies) => {
        res.json(movies.map(serializeMovie));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { movie_title, year_released, movie_poster } = req.body;
    const newMovie = { movie_title, year_released, movie_poster };

    for (const [key, value] of Object.entries(newMovie)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    }

    MovieService.insertMovie(req.app.get("db"), newMovie)
      .then((movie) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${movie.id}`))
          .json(serializeMovie(movie));
      })
      .catch(next);
  });

movieRouter
  .route("/:movie_id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    MovieService.getById(knexInstance, req.params.movie_id)
      .then((movie) => {
        if (!movie) {
          return res.status(404).json({
            error: { message: `Movie doesn't exist` },
          });
        }
        res.movie = movie;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeMovie(res.movie));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    MovieService.deleteMovie(knexInstance, req.params.movie_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    MovieService.clearAllMovies(knexInstance).then((numRowsAffected) => {
      res.status(204).end();
    });
  });

  module.exports = movieRouter;