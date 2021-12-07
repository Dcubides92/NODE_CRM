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

//Modificar 
app.get('/modificar/:id', async function (req, res) {
    var id = req.params.id;
    var t = await Clientes.findOne({ _id: id });
    console.log(t.fecha);
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



/*
app.post('/modificarmonto/:id', async function(req,res){
    var id = req.params.id;
    console.log("modificando el id:" + id);

    //forma 1
    var modificar = await Gastos.findById(id);

    //console.log()
    //modificar.monto = 
    //await tarea.save();

    //forma 2
    // var tarea = await Tarea.updateOne({_id: id}, {estado: true});
    res.redirect('/inicio');
})



app.post('/modificarGasto', async function(req,res){
    var id = req.params.id;
    var t = new Gastos(req.body);
    await t.save();
    res.redirect('/inicio');
})

*/

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