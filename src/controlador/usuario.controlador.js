'use strict';

var Usuario = require('../modelo/usuario.modelo')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt')

function adminApp(req, res) {
    var usuarioModel = Usuario();
    usuarioModel.username = "ADMIN";
    usuarioModel.rol = "ROL_ADMIN";
    Usuario.find({
        username: "ADMIN"
    }).exec((err, adminoEncontrado) => {
        if (err) return console.log({ mensaje: "Error creando Administrador" });
        if (adminoEncontrado.length >= 1) {
            return console.log("El Administrador está listo");
        } else {
            bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;
                usuarioModel.save((err, usuarioguardado) => {
                    if (err) return console.log({ mensaje: "Error en la peticion" });
                    if (usuarioguardado) {
                        console.log("Administrador listo");
                    } else {
                        console.log({ mensaje: "El administrador no está listo" });
                    }
                });
            });
        }
    });
}

function login(req, res) {
    var params = req.body;
    Usuario.findOne({ username: params.username }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada) => {
                if (err) return res.status(500).send({ mensaje: "Error en la petición" });
                if (passVerificada) {
                    if (params.getToken == "true") {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        });
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado });
                    }
                } else {
                    return res.status(500).send({ mensaje: "El usuario no se ha podido identificar" });
                }
            })
        } else {
            return res.status(500).send({ mensaje: "Error al buscar usuario" });
        }
    });
}

function registrarUsuario(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if (params.username && params.password) {
        usuarioModel.username = params.username;
        usuarioModel.rol = "ROL_USUARIO";
        usuarioModel.image = null;
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
        if (err) return res.status(500).send({ mensaje: "No puede deje espacios vacios" });
    }

}

function verCuenta(req, res) {
    Usuario.findById(req.user.sub, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'error al buscar usuario' });
        return res.status(200).send({ usuarioEncontrado });
    })
}

function obtenerUsuarios(req, res) {

    Usuario.find((err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ usuarioEncontrado });
    });
}

function obtenerUsuarioID(req, res) {
    var usuarioId = req.params.id;

    Usuario.findById(usuarioId, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ usuarioEncontrado });
    });
}

function editarUsuario(req, res) {
    var idUsuario = req.params.id;
    var params = req.body;
    delete params.password;
    delete params.rol;

    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });

        return res.status(200).send({ usuarioActualizado })
    })

}

function eliminarUsuario(req, res) {
    var UsuarioId = req.params.id;

    Usuario.findByIdAndDelete(UsuarioId, function(err, usuarioEliminado) {
        if (err) return res.status(500).send({ mensaje: 'Error borrando usuario' })
        if (!usuarioEliminado) return res.status(500).send({ mensaje: 'No se pudo eliminar usuario porque no hay datos' })
        return res.status(200).send({ usuarioEliminado })
    });
}

module.exports = {
    adminApp,
    login,
    registrarUsuario,
    verCuenta,
    obtenerUsuarios,
    obtenerUsuarioID,
    editarUsuario,
    eliminarUsuario
}