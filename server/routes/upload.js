const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs')
const path = require('path')
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

app.use(fileUpload())

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })
    }

    // Valida tipo
    let tiposValidos = ['productos', 'usuarios']
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son: ${tiposValidos.join(', ')}`
            },
            tipo: tipo
        });
    }


    let archivo = req.files.archivo
    let nombreCorto = archivo.name.split('.')
    let extension = nombreCorto[nombreCorto.length - 1]

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son: ${extensionesValidas.join(', ')}`
            },
            ext: extension
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ('usuarios' === tipo) {
            imagenUsuario(id, nombreArchivo, tipo, res)
        } else {
            imagenProducto(id, nombreArchivo, tipo, res)
        }

        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        })

    })
})

function imagenUsuario(id, nombreArchivo, tipo, res) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, tipo)

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, tipo)

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, tipo)

        usuarioDB.img = nombreArchivo

        usuarioDB.save()
    })
}

function imagenProducto(id, nombreArchivo, tipo, res) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, tipo)

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, tipo)

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, tipo)

        productoDB.img = nombreArchivo

        productoDB.save()
    })
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }
}

module.exports = app