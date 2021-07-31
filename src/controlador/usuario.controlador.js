'use strict';

var Usuario = require('../modelo/usuario.modelo')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt')
var fs = require('fs')
var path = require('path')

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
        usuarioModel.image = params.image;
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
    var idUsuario = req.params.idUsuario;

    Usuario.findById(idUsuario, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ usuarioEncontrado });
    });
}

function editarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;
    delete params.password;
    delete params.rol;


    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'No se a podido editar al Usuario' });

        return res.status(200).send({ usuarioEncontrado })
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

//Subir archivos de imagen
function subirImagen(req, res) {
    var usuarioID = req.user.sub

    if (req.files) {
        var file_path = req.files.imagen.path
        console.log(file_path)

        var file_split = file_path.split('\\')
        console.log(file_split)

        var file_name = file_split[3]
        console.log(file_name)

        var extension_split = file_name.split('.')
        console.log(extension_split)

        var file_extension = extension_split[1].toLowerCase()
        console.log(file_extension)

        if (usuarioID != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No tiene permiso para actualizar datos del usuario')
        }

        if (file_extension == 'png' || file_extension == 'jpg' || file_extension == 'jpeg' || file_extension == 'gif') {
            // Actualizar Documento de usuario Logueado
            Usuario.findByIdAndUpdate(usuarioID, { imagen: file_name }, { new: true }, (err, usuarioEncontrado) => {
                if (err) res.status(500).send({ mensaje: 'Error en la peticion' })
                if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'No se pudo actualizar al usuario' })

                return res.status(200).send({ usuarioEncontrado })
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

function obtenerArchivoImagen(req, res) {
    var archivoImagen = req.params.imagen
    var path_file = "./src/imagenes/usuarios/" + archivoImagen;

    fs.access(path_file, (err) => {
        if (err) {
            res.status(200).send({ mensaje: 'No existe la imagen' })

        } else {
            res.sendFile(path.resolve(path_file))
        }
    })
}

module.exports = {
    adminApp,
    login,
    registrarUsuario,
    verCuenta,
    obtenerUsuarios,
    obtenerUsuarioID,
    editarUsuario,
    eliminarUsuario,
    subirImagen,
    obtenerArchivoImagen
}