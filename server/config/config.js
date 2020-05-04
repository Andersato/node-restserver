// ===========================
// Puerto
// ===========================
process.env.PORT = process.env.PORT || 3000

// ===========================
// Entrno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ===========================
// Base de datos
// ===========================
let urlDB

if ('dev' === process.env.NODE_ENV) {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://andersato:qaLvnEtnmxkrhEnZ@cluster0-pkltk.mongodb.net/cafe'
}

process.env.URLDB = urlDB