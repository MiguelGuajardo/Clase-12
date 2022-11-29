const { optionsSQLite } = require("./optionsSQLite");
const knex = require("knex")(optionsSQLite);

knex.schema
  .createTable("msg", (table) => {
    table.increments("id");
    table.string("email");
    table.string("fecha");
    table.string("texto");
  })
  .then(() => console.log("tabla creada"))
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
