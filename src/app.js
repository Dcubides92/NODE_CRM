var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("usuario mongo")
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
app.use(express.static(__dirname + '/public/css'));
/* app.use(express.static('public')); */


//inicio
app.get('/', async function (req, res) {
    var t = await Clientes.find();
    //console.log(req)
    res.render('index', {
        clientes: t
    });
});
app.get('/inicio', async function (req, res) {
    var t = await Clientes.find();
    //console.log(req)
    res.render('index', {
        clientes: t
    });
});

//formulario para nuevos clientes
app.get('/cliente', async function (req, res) {
    //console.log(req)
    res.render('cliente');
});

//historial de cambios en clientes
app.get('/historial', async function (req, res) {
    var t = await Estado.find();
    //console.log(req)
    res.render('historial', {
        estado: t
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
    console.log(req)
    var id = req.params.id;
    var t = await Clientes.findOne({ _id: id });
    console.log("modificar id: " + id);
    res.render('modificar', {
        t: t
    });

})

//Para cambiar los datos del cliente
app.post('/modificarClientes', async function (req, res) {
    var body = req.body;
    var id = req.body.id;
    await Clientes.updateOne({ _id: id }, { $set: body })
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
    await Clientes.updateOne({ _id: id }, { estado: estate })
        .catch(function (err) {
            console.log(err);
        })

    //ingresa el historial de cambios
    var t = new Estado(req.body);
    await t.save();

    var t = await Estado.find({ id_cliente: id });
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
    console.log("Se esta eliminando " + id);
    var clientes = await Clientes.findById(id);
    await clientes.remove();
    res.redirect('/inicio');
});

//Servidor 

app.listen(3000, function () {
    console.log("Se esta conectando por el puerto 3000 al Servidor");
});

