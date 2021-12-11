var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb+srv://DIEGO92:Javier17@cluster0.ygwwk.mongodb.net/CRM_Bictia?retryWrites=true&w=majority")
    .then(function (db) {
        console.log("Conectado a al Base de Datos");
    })
    .catch(function (err) {
        console.log(err);
    })
//configuraciones
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
var Clientes = require('./models/Clientes');
var Estado = require('./models/estado');
// dar acceso al css
app.use(express.static(__dirname +'/public/css'));

//inicio
app.get('/inicio', async function (req, res) {
    var t = await Clientes.find();
    //console.log(req)
    res.render('index', {
        clientes: t
    });
});

// para agregar un nuevo cliente
app.post('/nuevoCliente', async function (req, res) {
    var t = new Clientes(req.body);
    await t.save();
    res.redirect('/inicio');
})

//Modificar Informacion Genetal 
app.get('/modificar/:id', async function (req, res) {
    var id = req.params.id;
    var t = await Clientes.findOne({ _id: id });
    var fec = t.fecha;
    var nom = t.nombre;
    var ape = t.apellidos;
    var email = t.email;
    var tel = t.telefono;
    var pais = t.pais;
    var ciudad = t.ciudad;
    var dir = t.direccion;
    var inst = t.instagram;
    var face = t.facebook;
    var link = t.linkedin;
    var twi = t.twitter;
    var est = t.estado;
    console.log("modificar id: " + id);
    res.render('modificar', {
        id: id,
        fecha: fec,
        nombre: nom,
        apellido: ape,
        email: email,
        telefono: tel,
        pais: pais,
        ciudad: ciudad,
        direccion: dir,
        instagram: inst,
        facebook: face,
        linkedin: link,
        twitter: twi,
        estado: est,
    });

})

//Para cambiar los datos del cliente
app.post('/modificarClientes', async function (req, res) {
    var body = req.body;
    var id = req.body.id;
    await Clientes.updateOne({_id: id},{$set:body})
    .catch(function (err) {
        console.log(err);
    })
    //var t = await Clientes.find();    
    res.redirect('/inicio');
})


//mostrar el historial e ir al formulario para modificar el estado
app.get('/estado/:id', async function (req, res) {
    var id = req.params.id;
    var t = await Clientes.findOne({ _id: id });
    var nom = t.nombre;
    var estate = t.estado;
    console.log("consultar historial del id: " + id);
    var t1 = await Estado.find({ id_cliente: id });

    res.render('estado', {
        estado: t1,
        id: id,
        cliente: nom,
        estado_actual: estate
    });
})

// Modificar el estado del cliente
app.post('/modificarestado', async function (req, res) {
//realiza el cambio en el cliente
    var id = req.body.id_cliente;
    var nom = req.body.cliente;
    var estate = req.body.estado;
    await Clientes.updateOne({_id: id},{estado:estate})
    .catch(function (err) {
        console.log(err);
    })
//ingresa el historial de cambios
    var t = new Estado(req.body);
    await t.save();

    var t = await Estado.find({ id_cliente: id});    
    res.render('estado', {
        estado: t,
        id: id,
        cliente: nom,
        estado_actual: estate
    });

})

//Se Elimina los Docuemntos 

app.get('/eliminar/:id/', async function (req, res) {
    var id = req.params.id;
    console.log("Deberiasmos Eliminar " + id);
    var clientes = await Clientes.findById(id);
    await clientes.remove();
    res.redirect('/inicio');
});

//Servisor 
app.listen(3000, function () {
    console.log("Se esta conectando por el puerto 3000 al Servisor");
});