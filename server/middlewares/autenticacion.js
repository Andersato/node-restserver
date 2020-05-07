const jwt = require('jsonwebtoken')

// ====================
// Verificar Token
// ====================
let verificaToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}

// ====================
// Verificar Token
// ====================
let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario

    if ('ADMIN_ROLE' !== usuario.role) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Autorización denegada'
            }
        })
    }

    next()

}

// ===========================
// Verificar Token para imagen
// ===========================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}

module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}