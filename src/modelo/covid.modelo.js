'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CovidSchema = Schema({
    nombre: String,
    contagiados: Number,
    muertos: Number,
    casosDetectados: Number,
    recuperados: Number
});

module.exports = mongoose.model('covid', CovidSchema);