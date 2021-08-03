'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MedicamentoSchema = Schema({
    nombre: String,
    instrucciones: String,
    enfermedad: { type: Schema.Types.ObjectId, ref: 'enfermedades' }
});

module.exports = mongoose.model('medicamentos', MedicamentoSchema);