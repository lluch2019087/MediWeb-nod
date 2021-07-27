'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    username: String,
    password: String,
    rol: String,
    image: String
});

module.exports = mongoose.model('usuarios', UsuarioSchema);