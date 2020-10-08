//express
const express = require('express');
const fileUpload = require('express-fileupload');

//sistema de archivos
const fs = require('fs');
const path = require('path');

//modelos
const User = require('../models/user.model');
const Product = require('../models/product.model');

const app = express();

//Defoult options
app.use(fileUpload());

//Subir un archivo
app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se se selecciono ningun archivo'
            }
        });
    }


    let file = req.files.file;
    let typeFile = file.name.split('.')[file.name.split('.').length - 1];

    //Extenciones permitidas
    let extensionsValid = ['png', 'jpg', 'gif', 'jpeg'];

    //Validar tipos
    let types = ['product', 'user']

    if (types.indexOf(type).length < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + types.join(', '),
                ext: type
            }
        })
    }

    //Cambiar nombre del archivo
    let nameFile = `${id}-${ new Date().getMilliseconds() }.${typeFile}`;

    //Subir el archivo
    file.mv(`upload/${type}/${nameFile}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //Validar si ex una extencion vailda
        if (extensionsValid.indexOf(typeFile) < 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Las extensiones permitidas son: ' + extensionsValid.join(', '),
                    ext: typeFile
                }
            })
        }

        //Subiendo dependiendo del tipo
        if (type === 'users') {
            imgUser(id, res, nameFile);
        } else {
            imgProduct(id, res, nameFile);
        }


    });

});

function imgUser(id, res, nameFile) {
    User.findById(id, (err, userDB) => {
        if (err) {

            removeFile(nameFile, 'users');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {

            removeFile(nameFile, 'users')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        removeFile(userDB.img, 'users');


        userDB.img = nameFile;

        userDB.save((err, userSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user: userSaved,
                img: nameFile
            })
        });


    });

}

function imgProduct(id, res, nameFile) {
    Product.findById(id, (err, productDB) => {
        if (err) {

            removeFile(nameFile, 'products');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {

            removeFile(nameFile, 'products')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            })
        }
        removeFile(productDB.img, 'products');


        productDB.img = nameFile;

        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productSaved,
                img: nameFile
            })
        });


    })
}

function removeFile(nameImg, type) {
    let pathImage = path.resolve(__dirname, `../../upload/${type}/${nameImg}`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}


module.exports = app;