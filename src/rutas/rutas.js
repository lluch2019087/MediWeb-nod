'use strict'

var express = require("express");
var md_autorizacion = require("../middlewares/authenticated.js");

var api = express.Router();
var usuarioControlador = require("../controlador/usuario.controlador");
var doctorControlador = require("../controlador/doctor.controlador");
var enfermedadControlador = require("../controlador/enfermedad.controlador")
var ForoControlador = require("../controlador/foro.controlador");
var MedicamentoControlador = require("../controlador/medicamento.controlador")

var multiparty = require('connect-multiparty');
var md_subirImagen = multiparty({ uploadDir: './src/imagenes/usuarios' });
var md_subirImagenEnfermedad = multiparty({ uploadDir: './src/imagenes/enfermedades' });

// Funciones Controlador Usuarios
api.post("/login", usuarioControlador.login);
api.post('/registrarUsuario', usuarioControlador.registrarUsuario)
api.put('/editarUsuario/:idUsuario', md_autorizacion.ensureAuth, usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:id', usuarioControlador.eliminarUsuario)
api.get('/obtenerUsuarios', usuarioControlador.obtenerUsuarios)
api.get("/obtenerUsuarioID/:idUsuario", usuarioControlador.obtenerUsuarioID)
api.get("/verCuenta", md_autorizacion.ensureAuth, usuarioControlador.verCuenta)
api.post('/subirImagen', [md_autorizacion.ensureAuth, md_subirImagen], usuarioControlador.subirImagen)
api.get('/obtenerArchivoImagen/:imagen', usuarioControlador.obtenerArchivoImagen)

// Funciones Controlador Doctores
api.post('/registrarDoctor', md_autorizacion.ensureAuth, doctorControlador.registrarDoctor)
api.put('/editarDoctor/:id', md_autorizacion.ensureAuth, doctorControlador.editarDoctor)
api.delete('/eliminarDoctor/:id', md_autorizacion.ensureAuth, doctorControlador.eliminarDoctor)
api.get('/obtenerDoctores', doctorControlador.obtenerDoctores)
api.get("/obtenerDoctor/:id", doctorControlador.obtenerDoctor)

// Funciones Controlador Enfermedades
api.post('/registrarEnfermedad', md_autorizacion.ensureAuth, enfermedadControlador.registrarEnfermedad)
api.delete('/eliminarEnfermedad/:id', md_autorizacion.ensureAuth, enfermedadControlador.eliminarEnfermedad)
api.put('/editarEnfermedad/:id', md_autorizacion.ensureAuth, enfermedadControlador.editarEnfermedad)
api.get('/obtenerEnfermedadID/:id', md_autorizacion.ensureAuth, enfermedadControlador.obtenerEnfermedadID)
api.post('/obtenerEnfermedad', enfermedadControlador.obtenerEnfermedad);
api.get('/obtenerEnfermedades', md_autorizacion.ensureAuth, enfermedadControlador.obtenerEnfermedades)
api.post('/subirImagenEnfermedad/:id', md_subirImagenEnfermedad, enfermedadControlador.subirImagenEnfermedad)
api.get('/obtenerArchivoImagenEnf/:archivoImagen', enfermedadControlador.obtenerArchivoImagenEnf)
api.post("/buscarEnfermedad", enfermedadControlador.buscarEnfermedad);


//Funciones Controlador Foro
api.post('/crearPregunta', md_autorizacion.ensureAuth, ForoControlador.crearPregunta);
api.delete('/eliminarPregunta/:id', md_autorizacion.ensureAuth, ForoControlador.eliminarPregunta);
api.post('/agregarComentarioDoc', md_autorizacion.ensureAuth, ForoControlador.agregarComentarioDoc);
api.get('/listarPreguntasUsuario', md_autorizacion.ensureAuth, ForoControlador.listarPreguntasUsuario);
api.get('/listarPreguntas', ForoControlador.listarPreguntas);
api.put('/editarPregunta/:id', md_autorizacion.ensureAuth, ForoControlador.editarPregunta);
api.get('/listarComentarios/:id', ForoControlador.listarComentarios);

//Funciones Controlador Medicamento
api.post('/registrarMedicamento', md_autorizacion.ensureAuth, MedicamentoControlador.registrarMedicamento)
api.post('/verMedicamento', MedicamentoControlador.verMedicamento)
api.put('/editarMedicamento/:id', md_autorizacion.ensureAuth, MedicamentoControlador.editarMedicamento)
api.delete('/eliminarMedicamento/:id', md_autorizacion.ensureAuth, MedicamentoControlador.eliminarMedicamento)
api.get('/obtenerMedicamentoID/:id', MedicamentoControlador.obtenerMedicamentoID)
api.post('/obtenerMedicamentos', MedicamentoControlador.obtenerMedicamentos)
api.get("/obtenerMedi/:id", md_autorizacion.ensureAuth, MedicamentoControlador.obtenerMedi);


module.exports = api;