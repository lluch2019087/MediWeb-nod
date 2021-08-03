'use strict'
var Usuario = require('../modelo/usuario.modelo');
var Covid = require('../modelo/covid.modelo');

function agregarCovid(req, res) {
    var covidModel = new Covid();

    covidModel.nombre = 'COVID-19';
    covidModel.contagiados = 0;
    covidModel.muertos = 0;
    covidModel.casosDetectados = 0;
    covidModel.recuperados = 0;

    Covid.find((err, covidEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (covidEncontrado.length >= 1) {
            return console.log("covid listo");
        } else {
            covidModel.save((err, covidG) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                if (covidG) {
                    return console.log("covid listo");
                } else {
                    return console.log({ mensaje: "El covid no está listo" });
                }
            });
        }
    })
}

function editarCovid(req, res) {
    var params = req.body;
    var nombre = 'COVID-19';

    Covid.findOneAndUpdate({ nombre: nombre }, params, { new: true }, (err, covidActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!covidActualizado) return res.status(500).send({ mensaje: 'no se actualizó el covid' });
        return res.status(200).send({ covidActualizado });
    });
}

function listarCovid(req, res) {

    Covid.findOne({ nombre: 'COVID-19' }, (err, covid) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!covid) return res.status(500).send({ mensaje: 'no existe el covid' });

        return res.status(200).send({ covid });
    });
}

module.exports = {
    agregarCovid,
    editarCovid,
    listarCovid

}