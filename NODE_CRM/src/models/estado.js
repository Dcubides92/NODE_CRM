var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Estado = new Schema({
    id_cliente: String,
    fecha: String,
    cliente: String,
    observaciones: String,
    estado: String
})

module.exports = mongoose.model('estado', Estado);
