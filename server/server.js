require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuración global de rutas
app.use(require('./routes/index'))

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(res => {
    console.log('Base de datos ONLINE');
}).catch(err => {
    throw err
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en puerto ${process.env.PORT}`);
})