'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ForoSchema = Schema({
    titulo: String,
    pregunta: String,
    usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
    comentarios: [{
        usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
        nombreDoc: String,
        comentario: String
    }]
});

module.exports = mongoose.model('foro', ForoSchema);