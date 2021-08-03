'use strict';

var Foro = require("../modelo/foro.modelo")
var moment = require("moment");
var Usuario = require('../modelo/usuario.modelo');


function crearPregunta(req, res) {

    var params = req.body;
    var foroModel = new Foro();

    foroModel.titulo = params.titulo;
    foroModel.pregunta = params.pregunta;
    foroModel.usuario = req.user.sub;

    if (params.titulo && params.pregunta) {

        foroModel.save((err, preguntaGuardada) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" });
            if (!preguntaGuardada) return res.status(500).send({ mensaje: "no se ha publicado la pregunta" });

            return res.status(200).send({ preguntaGuardada });
        })
    } else {
        return res.status(500).send({ mensaje: "no puede dejar parametros vacíos" })
    }

}


function eliminarPregunta(req, res) {

    var id = req.params.id;
    Foro.findByIdAndDelete(id, (err, preguntaEliminada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" });
        if (!preguntaEliminada) return res.status(500).send({ mensaje: "no se ha eliminado la pregunta" });

        return res.status(200).send({ preguntaEliminada });

    })

}

function agregarComentarioDoc(req, res) {
    var params = req.body;

    if (req.user.rol === "ROL_DOCTOR") {
        if (params.comentario) {

            Usuario.findOne({ _id: req.user.sub }, (err, doctorEncontrado) => {
                if (err) return res.status(500).send({ mensaje: "error en la peticion1" });
                if (!doctorEncontrado) return res.status(500).send({ mensaje: "no se ha encontrado el doctor" });

                Foro.updateOne({ _id: params.id }, {
                    $push: {
                        comentarios: {
                            usuario: doctorEncontrado._id,
                            nombreDoc: doctorEncontrado.username,
                            comentario: params.comentario
                        }
                    }
                }, (err, comentarioHecho) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion2' });
                    if (!comentarioHecho) return res.status(500).send({ mensaje: 'No se ha agregado la habitacion' });

                    Foro.findOne({ _id: params.id }, (err, pregunta) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion3' });
                        if (!pregunta) return res.status(500).send({ mensaje: 'Error' });
                        return res.status(200).send({ pregunta });
                    });
                });
            });

        } else {
            return res.status(500).send({ mensaje: 'No tiene permisos para agregar hotel' });
        }
    }
}

function listarPreguntasUsuario(req, res) {

    Foro.find({ usuario: req.user.sub }, (err, preguntasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!preguntasEncontradas) return res.status(500).send({ mensaje: 'aún no ha hecho preguntas' });

        return res.status(200).send({ preguntasEncontradas });
    })

}

function listarPreguntas(req, res) {

    Foro.find((err, preguntasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!preguntasEncontradas) return res.status(500).send({ mensaje: 'aún no ha hecho preguntas' });

        return res.status(200).send({ preguntasEncontradas });
    })

}

function editarPregunta(req, res) {
    var preguntaID = req.params.id;
    var params = req.body;

    delete params.comentarios

    if (req.user.rol == 'ROL_USUARIO') {
        Foro.findByIdAndUpdate(preguntaID, params, { new: true }, (err, preguntaActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!preguntaActualizada) return res.status(500).send({ mensaje: 'No se a podido actualizar la pregunta' });

            return res.status(200).send({ preguntaActualizada })
        })
    }
}

function listarComentarios(req, res) {
    var id = req.params.id;

    Foro.findOne({ _id: id }, (err, preguntaEncontrada1) => {
        if (err) return res.status(500).send({ mensaje: 'error en la petición' });
        if (!preguntaEncontrada1) return res.status(500).send({ mensaje: 'no se encontró la pregunta' });

        return res.status(200).send({ preguntaEncontrada1 });
    });
}

module.exports = {
    crearPregunta,
    eliminarPregunta,
    agregarComentarioDoc,
    listarPreguntasUsuario,
    listarPreguntas,
    editarPregunta,
    listarComentarios
}