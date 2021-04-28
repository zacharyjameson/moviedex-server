const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { expect } = require("chai");
const { makeMovieArray } = require("./movie-fixtures");

describe("Movies Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE moviedex_movies RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE moviedex_movies RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/movies`, () => {
    context(`Given no movies`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/movies").expect(200, []);
      });
    });

    context(`Given there are movies in the database`, () => {
      const testMovies = makeMovieArray();

      beforeEach("insert movie", () => {
        return db.into("moviedex_movies").insert(testMovies);
      });

      it(`responds with 200 and all of the movies`, () => {
        return supertest(app).get("/api/movies").expect(200, testMovies);
      });
    });
  });

  describe("POST /api/movies", () => {
    it(`adds a new movie to the database`, () => {
      const newMovie = {
        movie_title: "Harry Potter and the Order of the Phoenix",
        year_released: "2007",
        movie_poster:
          "https://m.media-amazon.com/images/M/MV5BMTM0NTczMTUzOV5BMl5BanBnXkFtZTYwMzIxNTg3._V1_SX300.jpg",
      };

      return supertest(app)
        .post("/api/movies")
        .send(newMovie)
        .expect(201)
        .expect((res) => {
          expect(res.body.movie_title).to.eql(newMovie.movie_title);
          expect(res.body.movie_poster).to.eql(newMovie.movie_poster);
          expect(res.body.year_released).to.eql(newMovie.year_released);
          expect(res.body).to.have.property("id");
        });
    });

    const requiredFields = ["movie_title", "movie_poster", "year_released"];

    requiredFields.forEach((field) => {
      const newMovies = {
        movie_title: "test title",
        year_released: "2021",
        movie_poster: "testmovieposter.jpg",
      };

      it(`responds with 400 and an error when the ${field} is missing`, () => {
        delete newMovies[field];

        return supertest(app)
          .post("/api/movies")
          .send(newMovies)
          .expect(400, {
            error: { message: `Missing ${field} in request body` },
          });
      });
    });
  });
});
