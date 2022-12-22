/* --Importaciones-- */

const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const ClienteSql = require("./sql")
const {options} = require("./tables/optionsMariaDB")
const {optionsSQLite} = require("./tables/optionsSQLite")
const knexMariaDB = new ClienteSql(options)
const knexSQLite3 = new ClienteSql(optionsSQLite)
const ProductsTestRouter = require("./routes/products/index-test")
const {normalize, schema, denormalize} = require("normalizr")

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

app.get("/", (req, res) => {
  res.render("main.handlebars");
});
app.use("/api/products-test", ProductsTestRouter)
/* --Sockets-- */

io.on("connection", async (socket) => {
  console.log("El usuario", socket.id, "se ha conectado");

  socket.on("disconnect", () => {
    console.log("El usuario", socket.id, "se ha desconectado");
  });
  /*                                                                        --Firebase-- */
  let admin = require("firebase-admin")

  const db = admin.firestore()
  const query = db.collection("messages").orderBy("date","asc")
  const queryCollection = db.collection("messages")
/*                                                                          FireBase MSG */

  const querySnapshot = await query.get()
  let docs = querySnapshot.docs;

  let CentroMensaje = docs.map((doc)=>({
    id: doc.id,
    author: {
      id: doc.data().author.id,
      nombre: doc.data().author.nombre,
      apellido: doc.data().author.apellido,
      edad: doc.data().author.edad,
      alias: doc.data().author.alias,
      avatar: doc.data().author.avatar,
    },
    text: doc.data().text,
    date: doc.data().date,
  }))

  /*                                                                        --Normalizr-- */

  const authorSchema = new schema.Entity("author")
  const messageSchema = new schema.Entity("messages",
  {author: authorSchema},
  {idAttribute: "id"}
  )

  let normalizeMessage = normalize(CentroMensaje, [messageSchema])
  console.log('------------------ Datos normalizados ------------------');
console.log(normalizeMessage);

  const dataOriginal = denormalize(normalizeMessage.result, messageSchema, normalizeMessage.entities)

  console.log('------------------ Datos denormalizados ------------------');
console.log(dataOriginal);

const normalElement = parseInt(JSON.stringify(normalizeMessage).length)
const originalElement = parseInt(JSON.stringify(CentroMensaje).length)

console.log(JSON.stringify(CentroMensaje).length);
console.log(JSON.stringify(normalizeMessage).length);


function porcent(firstElement, secondElement) {
    const porcents = ((firstElement / secondElement * 100) - 100).toFixed(2)
    console.log(`El porcentaje de compresion fue del ${porcents}%`);
    return porcents
}

let result = porcent(normalElement, originalElement)
/* let result = (((sizeNormalize * 100) / sizeData) -100).toFixed(2) */
console.log(JSON.stringify(result));

  socket.emit("mensajesActualizados", normalizeMessage,result);

  socket.on("nuevoMensaje", async (message) => {
    let nuevoMensaje = {
      ...message,
      date: new Date().toLocaleString(),
    };
    console.log(nuevoMensaje)
    // ---------------------- FIREBASE NEW MSG ----------------------
    const doc = queryCollection.doc();
    await doc.create(nuevoMensaje);

    const querySnapshot = await query.get();
    let docs = querySnapshot.docs;

    let response = docs.map((doc) => ({
        id: doc.id,
        author: {
          id: doc.data().author.id,
          nombre: doc.data().author.nombre,
          apellido: doc.data().author.apellido,
          edad: doc.data().author.edad,
          alias: doc.data().author.alias,
          avatar: doc.data().author.avatar,
        },
        text: doc.data().text,
        date: doc.data().date,
      }));
      // ---------------------- NORMALIZR NEW MSG ----------------------
    let normalizedMsg = normalize(response, [messageSchema]);
    // ---------------------- NORMALIZR NEW MSG ----------------------

    socket.emit("mensajesActualizados", normalizedMsg, result);
    
    })
  /*                                                                                        --products-- */
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
    let admin = require("firebase-admin")
  let serviceAccount = require("./db/mensajessocket-firebase-adminsdk-to1ax-02fdb3a0b1.json")

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
