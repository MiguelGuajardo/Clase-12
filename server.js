/* --Importaciones-- */

const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const fs = require("fs");
const io = new IOServer(httpServer);

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
/* --Sockets-- */

io.on("connection", (socket) => {
  console.log("El usuario", socket.id, "se ha conectado");

  /* socket.on("disconnect", () => {
    console.log("El usuario", socket.id, "se ha desconectado");
  }); */

  /* --messages-- */
  socket.emit("mensajesActualizados", messages);

  socket.on("nuevoMensaje", (mensaje) => {
    mensaje.fecha = new Date().toLocaleString();
    messages.push(mensaje);
    io.emit("mensajesActualizados", messages);
  });

  /* --products-- */

  socket.emit("productosActualizados", products);

  socket.on("nuevoProducto", (product) => {
    products.push(product);
    io.emit("productosActualizados", products);
  });
});

/*--Server-- */

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
