const jwt = require('jsonwebtoken');


//Verficar token
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.user = decoded.user;
        next();
    });


};

//Verifica admin role

let verificaAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role != 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

}

module.exports = {
    verificaToken,
    verificaAdminRole
}