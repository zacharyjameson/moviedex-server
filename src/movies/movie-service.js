const MovieService = {
  getAllMovies(knex) {
    return knex.select("*").from("moviedex_movies");
  },

  insertMovie(knex, newMovie) {
    return knex
      .insert(newMovie)
      .into("moviedex_movies")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
      return knex.from("moviedex_movies").select("*").where("id", id).first();
  },

  deleteMovie(knex, id) {
      return knex("moviedex_movies").where({ id }).delete();
  },

  clearAllMovies(knex){
      return knex.raw("TRUNCATE TABLE moviedex_movies RESTART IDENTITY CASCADE");
  }
  
};

module.exports = MovieService; 
