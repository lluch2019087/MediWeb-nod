'use strict';

var Usuario = require('../modelo/usuario.modelo')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt')

function registrarDoctor(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if (params.username && params.password) {
        if (req.user.rol === "ROL_ADMIN") {
            usuarioModel.username = params.username;
            usuarioModel.rol = "ROL_DOCTOR";
            Usuario.find({
                username: params.username
            }).exec((err, adminoEncontrado) => {
                if (err) return console.log({ mensaje: "Error en la peticion" });
                if (adminoEncontrado.length >= 1) {
                    return res.status(500).send("Este usuario ya existe");
                } else {
                    bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;
                        usuarioModel.save((err, usuarioguardado) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (usuarioguardado) {
                                res.status(200).send({ usuarioguardado });
                            } else {
                                res.status(500).send({ mensaje: "Error al registrar el usuario" });
                            }
                        });
                    });
                }
            });
        } else {
            if (err) return res.status(500).send({ mensaje: "No tiene permisos " });
        }
    } else {
        if (err) return res.status(500).send({ mensaje: "No puede dejar parametros vacios" });
    }

}

function editarDoctor(req, res) {
    var idUsuario = req.params.id;
    var params = req.body;
    delete params.password;
    delete params.rol;

    if (req.user.rol == 'ROL_ADMIN') {
        Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });

            return res.status(200).send({ usuarioActualizado })
        })
    } else {
        return res.status(500).send({ mensaje: 'Solo el admin puede editar doctores' })
    }
}

function eliminarDoctor(req, res) {
    var idUsuario = req.params.id;

    if (req.user.rol === 'ROL_ADMIN') {
        Usuario.findByIdAndDelete(idUsuario, function(err, doctorEliminado) {
            if (err) return res.status(500).send({ mensaje: 'Error borrando usuario' })
            if (!doctorEliminado) return res.status(500).send({ mensaje: 'No se pudo eliminar usuario porque no hay datos' })
            return res.status(200).send({ doctorEliminado })
        });
    } else {
        return res.status(500).send({ mensaje: 'Solo el admin puede eliminar doctores' })
    }
}

function obtenerDoctores(req, res) {

    Usuario.find({ rol: "ROL_DOCTOR" }, (err, usuarios_registrados) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!usuarios_registrados) return res.status(500).send({ mensaje: "Error peticion" });
        return res.status(200).send({ usuarios_registrados });
    })

}

function obtenerDoctor(req, res) {
    var id = req.params.id;
    //if (req.user.rol === "ROL_ADMIN") {

    Usuario.findOne({ _id: id, rol: "ROL_DOCTOR" }, (err, usuario_registrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!usuario_registrado) return res.status(500).send({ mensaje: "Error en peticion" });
        return res.status(200).send({ usuario_registrado });
    })

    //} else res.status(500).send({ mensaje: "No tienes permisos" });
}
module.exports = {
    registrarDoctor,
    editarDoctor,
    eliminarDoctor,
    obtenerDoctores,
    obtenerDoctor
}