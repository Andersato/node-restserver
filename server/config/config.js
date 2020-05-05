// ===========================
// Puerto
// ===========================
process.env.PORT = process.env.PORT || 3000

// ===========================
// Entrno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ===========================
// Vencimiento del token
// ===========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

// ===========================
// SEED de autenticación
// ===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

// ===========================
// Base de datos
// ===========================
let urlDB

if ('dev' === process.env.NODE_ENV) {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB

// ===========================
// Google Client ID
// ===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '157035755908-dter3gh3o6jg79d6d9g13ko3n8g5mr9d.apps.googleusercontent.com'