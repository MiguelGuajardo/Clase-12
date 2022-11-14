const socket = io();
/* --Products-- */
function mostrarProductos(products) {
  const productosParaMostrar = products.map(({ title, price, thumbnail }) => {
    return `
    <tr>
    <td>${title}</td>
    <td>${price}</td>
    <td><img src="${thumbnail}" style="width: 30px; height: 30px"/></td>
    </tr>
        `;
  });

  const list = document.getElementById("list");
  list.innerHTML = productosParaMostrar.join("\n");
  console.table(productosParaMostrar);
}
socket.on("productosActualizados", (products) => {
  mostrarProductos(products);
});
const botónCargar = document.getElementById("botónCargar");

botónCargar.addEventListener("click", (e) => {
  const inputTitle = document.getElementById("inputTitle");
  const inputPrice = document.getElementById("inputPrice");
  const inputThumbnail = document.getElementById("inputThumbnail");

  if (inputTitle.value && inputPrice.value && inputThumbnail.value) {
    const product = {
      title: inputTitle.value,
      price: inputPrice.value,
      thumbnail: inputThumbnail.value,
    };
    socket.emit("nuevoProducto", product);
  }
  inputTitle.value = "";
  inputPrice.value = "";
  inputThumbnail.value = "";
});
/* --Messages-- */
function mostrarMensajes(messages) {
  const mensajesParaMostrar = messages.map(({ fecha, email, texto }) => {
    return `<div class="d-flex form-control-lg w-50 m-auto">
    <p class="text-warning">${fecha}</p>
     -- 
    <p class="text-primary"><strong>${email}</strong></p>
     --
    <p class="text-success fst-italic">${texto}</p>
    </div>
    `;
  });

  const mensajesHtml = `
<ul>
${mensajesParaMostrar.join("\n")}
</ul>`;

  const listaMensajes = document.getElementById("listaMensajes");

  listaMensajes.innerHTML = mensajesHtml;

  // console.table(mensajesParaMostrar)
}

socket.on("mensajesActualizados", (messages) => {
  mostrarMensajes(messages);
});
const botónEnviar = document.getElementById("botónEnviar");
botónEnviar.addEventListener("click", (e) => {
  const inputEmail = document.getElementById("inputEmail");
  const inputText = document.getElementById("inputText");

  if (inputEmail.value && inputText.value) {
    const message = {
      email: inputEmail.value,
      texto: inputText.value,
    };
    socket.emit("nuevoMensaje", message);
  } else {
    alert("ingrese algun mensaje");
  }
  inputText.value = "";
});
