const express = require('express')
const _ = require('underscore')

const Producto = require('../models/producto')
const Categoria = require('../models/categoria')
const { verificaToken } = require('../middlewares/autenticacion')

const app = express()


// ============================
// Mostrar todos los productos
// ============================
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0
    let limite = req.query.limite || 5
    let query = {
        disponible: true
    }

    Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion usuario')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Producto.count(query, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                })
            })
        })
})

// ============================
// Mostrar un producto por ID
// ============================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

// ============================
// Buscar un producto
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})


// ============================
// Crear un nuevo producto
// ============================
app.post('/productos', verificaToken, (req, res) => {
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria'])
    let usuario = req.usuario

    Categoria.findById(body.categoria, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            })
        }

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            usuario: usuario,
            categoria: categoriaDB
        })

        producto.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
    })


})

// ============================
// Actualizar un nuevo producto
// ============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible'])

    if (body.categoria) {
        Categoria.findById(body.categoria, (err, categoriaDB) => {
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
                        message: 'La categoría no existe'
                    }
                })
            }
        })
    }

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

})

// ============================
// Borrar un producto
// ============================
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id
    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, (err, productoBorrado) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }

        if (!productoBorrado) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBorrado
        })
    })
})


module.exports = app