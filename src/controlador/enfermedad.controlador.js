'use strict';

var Enfermedad = require('../modelo/enfermedad.modelo')
var Usuario = require('../modelo/usuario.modelo')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt')
var fs = require('fs')
var path = require('path')

function registrarEnfermedad(req, res) {
    var enfermedadModelo = new Enfermedad();
    var params = req.body;

    if (req.user.rol == 'ROL_DOCTOR') {
        enfermedadModelo.nombre = params.nombre;
        enfermedadModelo.descripcion = params.descripcion;
        enfermedadModelo.sintomas = params.sintomas;
        enfermedadModelo.image = null;
        enfermedadModelo.doctor = req.user.sub;

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
    delete params.image;
    delete params.doctor;

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
        Enfermedad.find({ doctor: enfermedadId }, (err, enfermedadEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
            if (!enfermedadEncontrada) return res.status(500).send({ mensaje: 'Error al obtener el Enfermedad.' });
            return res.status(200).send({ enfermedadEncontrada });
        });
    } else {
        return res.status(500).send({ mensaje: 'Solo el Doctor puede actualizar las enfermedades' })
    }
}

function obtenerEnfermedad(req, res) {
    var params = req.body;

    Enfermedad.findOne({ nombre: params.nombre }, (err, enfermedadEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!enfermedadEncontrada) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ enfermedadEncontrada });
    });
}

function obtenerEnfermedades(req, res) {

    Enfermedad.find((err, enfermedadEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!enfermedadEncontrada) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ enfermedadEncontrada });
    });
}

function buscarEnfermedad(req, res) {
    var params = req.body;
    Enfermedad.findOne({ nombre: params.nombre }, (err, enfermedadEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!enfermedadEncontrada) {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!enfermedadEncontrada) return res.status(500).send({ mensaje: 'este hotel no existe' });

            return res.status(200).send({ enfermedadEncontrada });

        } else {
            return res.status(200).send({ enfermedadEncontrada });
        }
    });

}
//Subir archivos de imagen
function subirImagenEnfermedad(req, res) {
    var enfermedadID = req.params.id

    if (req.files) {
        var file_path = req.files.image.path
        console.log(file_path)

        var file_split = file_path.split('\\')
        console.log(file_split)

        var file_name = file_split[3]
        console.log(file_name)

        var extension_split = file_name.split('\.')
        console.log(extension_split)

        var file_extension = extension_split[1]
        console.log(file_extension)

        if (file_extension == 'png' || file_extension == 'jpg' || file_extension == 'jpeg' || file_extension == 'gif') {
            // Actualizar Documento de usuario Logueado
            Enfermedad.findByIdAndUpdate(enfermedadID, { image: file_name }, { new: true }, (err, usuarioActualizado) => {
                if (err) res.status(500).send({ mensaje: 'Error en la peticion' })
                if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se pudo actualizar al usuario' })

                return res.status(200).send({ usuarioActualizado })
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'La extension no es valida')
        }

    } else {
        return res.status(500).send({ mensaje: 'No se han subido imagenes' })
    }
}

function removeFilesOfUploads(res, file_path, mensaje) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ mensaje: mensaje });
    })
}

function obtenerArchivoImagenEnf(req, res) {
    var archivoImagen = req.params.archivoImagen
    var path_file = './src/imagenes/enfermedades/' + archivoImagen

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(200).send({ mensaje: 'No existe la imagen' })
        }
    })
}

module.exports = {
    registrarEnfermedad,
    eliminarEnfermedad,
    editarEnfermedad,
    obtenerEnfermedadID,
    obtenerEnfermedades,
    obtenerEnfermedad,
    subirImagenEnfermedad,
    obtenerArchivoImagenEnf,
    buscarEnfermedad

}