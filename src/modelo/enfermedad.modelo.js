'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EnfermedadSchema = Schema({
    nombre: String,
    descripcion: String,
    sintomas: String,
    image: String
});

module.exports = mongoose.model('enfermedades', EnfermedadSchema);