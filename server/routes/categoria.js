const express = require('express')
const _ = require('underscore')

const Categoria = require('../models/categoria')
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')

const app = express()


// ============================
// Mostrar todas las categorías
// ============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })
        })
})

// ============================
// Mostrar una categoría por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

// ============================
// Crear nueva categoría
// ============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body
    let usuario = req.usuario

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario
    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

// ============================
// Actualizar una categoría
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['descripcion'])

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
})

// ============================
// Elimina una categoría
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrada) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    })

})

module.exports = app