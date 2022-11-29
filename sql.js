const knexLib = require("knex")

class ClienteSql {
  constructor(config) {
    this.knex = knexLib(config)
  }

  insertarArticulos(articulos) {
    return this.knex('product').insert(articulos)
  }
  insertarMensajes(mensaje){
    return this.knex("msg").insert(mensaje)
  }

  listarArticulos() {
    return this.knex('product').select('*')
  }
  listarMensajes(){
    return this.knex('msg').select('*')
  }

  borrarArticuloPorId(id) {
    return this.knex.from('product').where('id', id).del()
  }

  actualizarStockPorId(stock, id) {
    return this.knex.from('product').where('id', id).update({ stock: stock })
  }

  close() {
    this.knex.destroy();
  }
}

module.exports = ClienteSql