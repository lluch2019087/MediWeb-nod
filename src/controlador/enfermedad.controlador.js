'use strict';

var Enfermedad = require('../modelo/enfermedad.modelo')
var Usuario = require('../modelo/usuario.modelo')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt')

function registrarEnfermedad(req, res) {
    var enfermedadModelo = new Enfermedad();
    var params = req.body;

    if (req.user.rol == 'ROL_DOCTOR') {
        enfermedadModelo.nombre = params.nombre;
        enfermedadModelo.descripcion = params.descripcion;
        enfermedadModelo.sintomas = params.sintomas;

        if (params.nombre && params.descripcion && params.sintomas) {
            Enfermedad.find({
                nombre: params.nombre
            }).exec((err, enfermedadnoEncontrado) => {
                if (err) return console.log({ mensaje: "Error en la peticion" });
                if (enfermedadnoEncontrado.length >= 1) {
                    return res.status(500).send("Esta enfermedad ya esta registrada");
                } else {
                    enfermedadModelo.save((err, enfermedadguardada) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (enfermedadguardada) {
                            res.status(200).send({ enfermedadguardada });
                        } else {
                            res.status(500).send({ mensaje: "Error al registrar la enfermedad" });
                        }
                    });
                }
            });
        } else {
            if (err) return res.status(500).send({ mensaje: "No puede deje espacios vacios" });
        }
    } else {
        return res.status(500).send({ mensaje: "Solo los doctores pueden agregar enfermedades" })
    }
}

function eliminarEnfermedad(req, res) {
    var enfermedadID = req.params.id;

    if (req.user.rol == 'ROL_DOCTOR') {
        Enfermedad.findByIdAndDelete(enfermedadID, function(err, enfermedadEliminada) {
            if (err) return res.status(500).send({ mensaje: 'Error borrando la enfermedad' })
            if (!enfermedadEliminada) return res.status(500).send({ mensaje: 'No se pudo eliminar enfermedad porque no hay datos' })
            return res.status(200).send({ enfermedadEliminada })
        });
    } else {
        return res.status(500).send({ mensaje: 'Solo el Doctor puede eliminar enfermedades' })
    }
}

function editarEnfermedad(req, res) {
    var enfermedadID = req.params.id;
    var params = req.body;
    delete params.password;
    delete params.rol;

    if (req.user.rol == 'ROL_DOCTOR') {
        Enfermedad.findByIdAndUpdate(enfermedadID, params, { new: true }, (err, enfermedadActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!enfermedadActualizada) return res.status(500).send({ mensaje: 'No se a podido actualizar la enfermedad' });

            return res.status(200).send({ enfermedadActualizada })
        })
    } else {
        return res.status(500).send({ mensaje: 'Solo el doctor puede actualizar las enfermedades' })
    }
}

function obtenerEnfermedadID(req, res) {
    var enfermedadId = req.params.id;

    if (req.user.rol == 'ROL_DOCTOR') {
        Enfermedad.findById(enfermedadId, (err, enfermedadEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
            if (!enfermedadEncontrada) return res.status(500).send({ mensaje: 'Error al obtener el Enfermedad.' });
            return res.status(200).send({ enfermedadEncontrada });
        });
    } else {
        return res.status(500).send({ mensaje: 'Solo el Doctor puede actualizar las enfermedades' })
    }
}

function obtenerEnfermedades(req, res) {

    Enfermedad.find((err, enfermedadEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!enfermedadEncontrada) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ enfermedadEncontrada });
    });
}

module.exports = {
    registrarEnfermedad,
    eliminarEnfermedad,
    editarEnfermedad,
    obtenerEnfermedadID,
    obtenerEnfermedades
}