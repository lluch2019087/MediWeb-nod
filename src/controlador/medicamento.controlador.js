'use strict';

var Medicamento = require('../modelo/medicamento.modelo');

function registrarMedicamento(req, res) {
    var medicamentoModelo = new Medicamento();
    var params = req.body;

    if (req.user.rol === 'ROL_DOCTOR') {
        if (params.nombre) {
            medicamentoModelo.nombre = params.nombre
            medicamentoModelo.instrucciones = params.instrucciones
            medicamentoModelo.enfermedad = params.enfermedad

            Medicamento.findOne({ nombre: params.nombre }, (err, medicamentoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                if (!medicamentoEncontrado) {
                    medicamentoModelo.save((err, medicamentoGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                        if (!medicamentoGuardado) return res.status(500).send({ mensaje: 'no se guardó el medicamento' });
                        return res.status(200).send({ medicamentoGuardado });
                    })
                } else {
                    return res.status(500).send({ mensaje: 'este medicamento ya existe' });
                }
            })
        }
    } else {
        return res.status(500).send({ mensaje: 'Solo el doctor puede agregar medicamentos' })
    }
}

function verMedicamento(req, res) {
    var params = req.body;

    if (params.enfermedad) {
        Medicamento.find({ enfermedad: params.enfermedad }, (err, medicamentosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!medicamentosEncontrados) return res.status(500).send({ mensaje: 'No hay medicamentos' });

            return res.status(200).send({ medicamentosEncontrados });
        });
    }
}

function editarMedicamento(req, res) {
    var params = req.body;
    var EnfermedadId = req.params.id;

    delete params.enfermedad

    if (req.user.rol === 'ROL_DOCTOR') {
        Medicamento.findByIdAndUpdate(EnfermedadId, params, { new: true }, (err, enfermedadActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!enfermedadActualizada) return res.status(500).send({ mensaje: 'no se pudo actualizar el equipo' });

            return res.status(200).send({ enfermedadActualizada });

        });
    }
}

function eliminarMedicamento(req, res) {
    var MedicamentoId = req.params.id;

    if (req.user.rol === 'ROL_DOCTOR') {
        Medicamento.findByIdAndDelete(MedicamentoId, (err, medicamentoEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!medicamentoEliminado) res.status(500).send({ mensaje: 'no se pudo eliminar el medicamento' });

            return res.status(200).send({ mensaje: 'se elimino un medicamento' });
        });
    }
}

function obtenerMedicamentoID(req, res) {
    var MedicamentoID = req.params.id;

    Medicamento.findById(MedicamentoID, (err, medicamentoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!medicamentoEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({ medicamentoEncontrado })
    })
}

function obtenerMedicamentos(req, res) {
    var params = req.body;
    if (params.enfermedad) {
        Medicamento.find({ enfermedad: params.enfermedad }, (err, medicamentosEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!medicamentosEncontrado) return res.status(500).send({ mensaje: 'Error al obtener los medicamentos' });
            return res.status(200).send({ medicamentosEncontrado });
        })
    }
}

function obtenerMedi(req, res) {
    var id = req.params.id;

    Medicamento.findOne({ _id: id }, (err, Equipo_registrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!Equipo_registrado) return res.status(500).send({ mensaje: "Error en peticion" });
        return res.status(200).send({ Equipo_registrado });
    })

}


module.exports = {
    registrarMedicamento,
    verMedicamento,
    editarMedicamento,
    eliminarMedicamento,
    obtenerMedicamentoID,
    obtenerMedicamentos,
    obtenerMedi
}