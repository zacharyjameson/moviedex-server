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
            connection: process.env.TEST_DATABASE_URL
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
    })
})