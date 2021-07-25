'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_mediweb';

exports.createToken = function(usuario) {
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        username: usuario.username,
        rol: usuario.rol,
        image: usuario.image,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret);
}