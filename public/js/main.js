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
/*                                                                                  --Messages-- */


function mostrarMensajes(messages,result) {
  const authorSchema = new normalizr.schema.Entity("author");
  const msgSchema = new normalizr.schema.Entity(
    "messages",
    {
      author: authorSchema,
    },
    { idAttribute: "id" }
  );
  const denormalizeData = normalizr.denormalize(
    messages.result,
    [msgSchema],
    messages.entities
  );
  const html = denormalizeData.map((msg)=>{
    return `<div class="d-flex form-control-lg w-50 m-auto">
    <p class="text-warning">${msg.author.alias}</p>
     [ 
    <p class="text-primary"><strong>${msg.date}</strong></p>
     ]:
    <p class="text-success fst-italic">${msg.text}</p>
    -
    <img
              src="${msg.author.avatar}"
              style="width: 30px; height: 30px; margin-left: 10px;"
            />
    </div>
    `;
  })
  .join(" ");
  document.getElementById("listaMensajes").innerHTML = html;

  let centerMessage;
  
  if (result > 0) {
    centerMessage = Math.round(result);
  } else {
    centerMessage = "No se puede comprimir mas";
  }

  document.getElementById(
    "centroMsg"
  ).innerHTML = `Centro de mensajes - (Compresión: ${centerMessage})`;

}
socket.on("mensajesActualizados", (messages, result) => mostrarMensajes(messages, result));

const botónEnviar = document.getElementById("botónEnviar");
botónEnviar.addEventListener("click", (e) => {
  const inputUser = document.getElementById("inputUser");
  const inputName = document.getElementById("inputName");
  const inputLastName = document.getElementById("inputLastName");
  const inputEmail = document.getElementById("inputEmail");
  const inputAge = document.getElementById("inputAge");
  const inputPhoto = document.getElementById("inputPhoto");
  const inputText = document.getElementById("inputText");

  if (inputEmail.value && inputText.value && inputUser.value && inputName.value && inputLastName.value && inputAge.value && inputPhoto.value) {
    const message = {
      author: {
        id: inputEmail.value,
        nombre: inputName.value,
        apellido: inputLastName.value,
        edad: inputAge.value,
        alias: inputUser.value,
        avatar: inputPhoto.value,
      },
      text: inputText.value,
    }
    console.log(message)
    socket.emit("nuevoMensaje", message);
  } else {
    alert("ingrese algun mensaje");
  }
  inputText.value = "";
  return false;
});
