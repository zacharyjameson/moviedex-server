const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, () => {
  console.log(`Success! Server listening at http://localhost:${PORT}`);
});
