const { optionsSQLite } = require("./optionsSQLite");
const knex = require("knex")(optionsSQLite);

knex.schema
  .createTable("msg", (table) => {
    table.increments("id");
    table.string("email");
    table.string("fecha");
    table.string("texto");
    table.string("user");
    table.string("name");
    table.string("lastName");
    table.string("age");
    table.string("photo");
  })
  .then(() => console.log("tabla creada"))
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
