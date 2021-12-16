var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Cliente = new Schema({
    fecha: String,
    t_documento: String,
    no_documento: String,
    nombre: String,
    apellidos: String,
    email: String,
    telefono: Number,
    pais: String,
    ciudad: String,
    direccion: String,
    instagram: String,
    facebook: String,
    linkedin: String,
    twitter: String,
    estado: String
})

module.exports = mongoose.model('cliente', Cliente);
