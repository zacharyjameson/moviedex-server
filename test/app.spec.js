
const app = require("../src/app");

describe("App", () => {
  it('GET /api responds with 200 containing "Hello there! General Kenobi!"', () => {
    return supertest(app).get("/api").expect(200, "Hello there! General Kenobi!");
  });
});
