'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    username: String,
    password: String,
    rol: String,
    imagen: String
});

module.exports = mongoose.model('usuarios', UsuarioSchema);