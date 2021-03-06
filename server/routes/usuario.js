const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario')
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')

const app = express()

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    let limite = req.query.limite || 5
    let query = {
        estado: true
    }

    Usuario.find(query, 'nombre email role estado google img')
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count(query, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                })
            })
        })
})

app.post('/usuario', [verificaToken, verificaAdminRol], (req, res) => {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.put('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})

app.delete('/usuario-delete/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, (err, usuarioBorrado) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})

module.exports = app