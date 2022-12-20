/* --Importaciones-- */

const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const fs = require("fs");
const io = new IOServer(httpServer);
const ClienteSql = require("./sql")
const {options} = require("./tables/optionsMariaDB")
const {optionsSQLite} = require("./tables/optionsSQLite")
const knexMariaDB = new ClienteSql(options)
const knexSQLite3 = new ClienteSql(optionsSQLite)
const ProductsTestRouter = require("./routes/products/index-test")
/* -- config handlebars-- */
const configHandlebars = {
  extname: ".handlebars",
  defaultLayout: "index.handlebars",
  layoutDir: __dirname + "/views/layouts",
};
app.engine("handlebars", exphbs.engine(configHandlebars));
/* --Establezco el motor de plantilla-- */
app.set("view engine", "handlebars");
/* --Establezco directorio de la plantilla-- */
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* const { optionsSQLite } = require("./tables/optionsSQLite");
const knexSQLite3 = require("knex")(optionsSQLite);

const { options } = require("./tables/optionsMariaDB");
const knexMariaDB = require("knex")(options); */

/* --Peticiones y arrays */
let products = [];
let messages = [];

app.get("/", (req, res) => {
  const existProduct = products.length > 0 ? true : false;
  const existMessage = messages.length > 0 ? true : false;
  res.render("main.handlebars", {
    products,
    messages,
    existProduct,
    existMessage,
  });
});
app.use("/api/products-test", ProductsTestRouter)
/* --Sockets-- */

io.on("connection", async (socket) => {
  console.log("El usuario", socket.id, "se ha conectado");

  /* socket.on("disconnect", () => {
    console.log("El usuario", socket.id, "se ha desconectado");
  }); */

  /* --messages-- */
  try {
    const mensajesLeidos = await knexSQLite3.listarMensajes()
    socket.emit("mensajesActualizados", mensajesLeidos)
    
    socket.on("nuevoMensaje", async(mensaje) => {
      let nuevoMensaje = {
        ...mensaje,
        fecha: new Date().toLocaleString(),
      };
      await knexSQLite3.insertarMensajes(nuevoMensaje)
      const mensajesLeidos = await knexSQLite3.listarMensajes()
      socket.emit("mensajesActualizados", mensajesLeidos)
     })
  } catch (error) {
    console.log(error)
  }
  /* --products-- */
  try {
    const articulosLeidos = await knexMariaDB.listarArticulos()
    socket.emit("productosActualizados", articulosLeidos)

    socket.on("nuevoProducto", async(product) => {
       await knexMariaDB.insertarArticulos(product)
       const articulosLeidos = await knexMariaDB.listarArticulos()
       socket.emit("productosActualizados", articulosLeidos)
      })

  } catch (error) {
    console.log(error)
  }})

/*--Server-- */

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
