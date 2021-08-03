// IMPORTACION
const mongoose = require("mongoose")
const app = require("./app")
var usuarioControlador = require("./src/controlador/usuario.controlador")
var CovidControlador = require("./src/controlador/covid.controlador")

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/MediWeb', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Se encuentra conectado a la base de datos');

    app.listen(3000, function() {
        console.log("Servidor corriendo en el puerto 3000");
        usuarioControlador.adminApp();
        CovidControlador.agregarCovid();
    })
}).catch(err => console.log(err))