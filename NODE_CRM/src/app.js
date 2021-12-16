var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var alert = require("alert");
var mongoose = require("mongoose");
//var textSearch = require("mongoose-text-search"); */

mongoose.connect("mongodb+srv://DIEGO92:Javier17@cluster0.ygwwk.mongodb.net/CRM_Bictia?retryWrites=true&w=majority")
    .then(function(db) {
        console.log("Conectado a al Base de Datos");
    })
    .catch(function(err) {
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
app.get('/', async function(req, res) {
    var t = await Clientes.find();
    res.render('index', {
        clientes: t
    });
});
app.get('/inicio', async function(req, res) {
    var t = await Clientes.find();
    res.render('index', {
        clientes: t
    });
});

//formulario para nuevos clientes
app.get('/cliente', async function(req, res) {
    //console.log(req)
    res.render('cliente');
});

//historial de cambios en clientes
app.get('/historial', async function(req, res) {
    var t = await Estado.find();
    //console.log(req)
    res.render('historial', {
        estado: t
    });
});

// para agregar un nuevo cliente
app.post('/nuevoCliente', async function(req, res) {
    if (req.body.estado === "Seleccionar una Opción" || req.body.t_documento === "Seleccionar una Opción") {
        alert("no ha seleccionado un Estado o un Tipo de documento");
    } else {
        var t = new Clientes(req.body);
        await t.save();
        res.redirect('/inicio');
    }
})

//Modificar Informacion Genetal 
app.get('/modificar/:id', async function(req, res) {
    console.log(req)
    var id = req.params.id;
    var t = await Clientes.findOne({ _id: id });
    console.log("modificar id: " + id);
    res.render('modificar', {
        t: t
    });

})

//Para cambiar los datos del cliente
app.post('/modificarClientes', async function(req, res) {
    var body = req.body;
    var id = req.body.id;
    await Clientes.updateOne({ _id: id }, { $set: body })
        .catch(function(err) {
            console.log(err);
        })
        //var t = await Clientes.find();    
    res.redirect('/inicio');
})


//mostrar el historial e ir al formulario para modificar el estado
app.get('/estado/:id', async function(req, res) {
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
app.post('/modificarestado', async function(req, res) {
    //realiza el cambio en el cliente
    console.log(req.body.estado);
    console.log(req.body.estado_actual);
    if (req.body.estado === req.body.estado_actual) {
        alert("no ha seleccionado un Estado diferente al actual");
    } else {
        var id = req.body.id_cliente;
        var nom = req.body.cliente;
        var estate = req.body.estado;
        await Clientes.updateOne({ _id: id }, { estado: estate })
            .catch(function(err) {
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
    }
})

//filtrar el formulario
app.post('/filtro', async function(req, res) {
    var estate = req.body.estado
    var nom = req.body.nombre;
    if (estate === "Selecionar una Opción" && nom === "") {
        var t = await Clientes.find();
        res.render('index', { clientes: t });
    }
    if (estate != "Selecionar una Opción" && nom === "") {
        var t = await Clientes.find({ estado: estate });
        res.render('index', { clientes: t });
    }
    if (estate === "Selecionar una Opción" && nom != "") {
        var t = await Clientes.find({ nombre: { $regex: nom, $options: 'i' } });
        res.render('index', { clientes: t });
    }
    if (estate != "Selecionar una Opción" && nom != "") {
        var t = await Clientes.find({
            nombre: { $regex: nom, $options: 'i' },
            estado: estate
        });
        res.render('index', { clientes: t });
    }
})

//Se Elimina los Documentos 

app.get('/eliminar/:id/', async function(req, res) {
    var id = req.params.id;
    console.log("Se esta eliminando " + id);
    var clientes = await Clientes.findById(id);
    await clientes.remove();
    res.redirect('/inicio');
});

//Servidor 

app.listen(3000, function() {
    console.log("Se esta conectando por el puerto 3000 al Servidor");
});

//funcion solo numero

/*  function format(input)
{
    var nume = input.value.replace(/\,/g,'');
    if(!isNaN(nume)){
        input.value = nume;
    }
    else{ alert('Solo se permiten numeros');
        input.value = input.value.replace(/[^\d\.]* /g,'');
    }
}   */

// pais ciudad