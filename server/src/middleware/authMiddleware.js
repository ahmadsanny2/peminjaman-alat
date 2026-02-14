import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({
        message: "Akses ditolak. Token autentikasi tidak ditemukan."
    })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({
            message: "Integritas token tidak valid atau sesi telah kedaluwarsa."
        })
    }
}

export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Pelanggaran hak akses. Anda tidak memiliki otorisasi untuk fitur ini."
            })
        }
        next()
    }
}