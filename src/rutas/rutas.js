'use strict'

var express = require("express");
var md_autorizacion = require("../middlewares/authenticated.js");
var api = express.Router();
var usuarioControlador = require("../controlador/usuario.controlador");
var doctorControlador = require("../controlador/doctor.controlador");

// Funciones Controlador Usuarios
api.post("/login", usuarioControlador.login);
api.post('/registrarUsuario', usuarioControlador.registrarUsuario)
api.put('/editarUsuario/:id', usuarioControlador.editarUsuario)
api.delete('/eliminarUsuario/:id', usuarioControlador.eliminarUsuario)
api.get('/obtenerUsuarios', usuarioControlador.obtenerUsuarios)
api.get("/obtenerUsuarioID/:id", usuarioControlador.obtenerUsuarioID);
api.post("/verCuenta", usuarioControlador.verCuenta);

// Funciones Controlador Doctores
api.post('/registrarDoctor', md_autorizacion.ensureAuth, doctorControlador.registrarDoctor)
api.put('/editarDoctor/:id', md_autorizacion.ensureAuth, doctorControlador.editarDoctor)
api.delete('/eliminarDoctor/:id', md_autorizacion.ensureAuth, doctorControlador.eliminarDoctor)

module.exports = api;