const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/authentication');
const _ = require('underscore');

let Category = require('../models/category.model');
const { model } = require('../models/category.model');
let app = express();

//Mostrar todas las categorias
app.get('/category', verificaToken, (req, res) => {

    Category.find()
        .sort('description')
        .populate('user') //no funciona
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Category.countDocuments((err, quantity) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    categories,
                    quantity
                })
            })

        });

});

//Mostrar una categoria por id
app.get('/category/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    });

});

//Crear una nueva categoria
app.post('/category', verificaToken, (req, res) => {

    let category = new Category();
    category.description = req.body.description;
    category.user = req.user._id;

    category.save((err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });

});

//Actualizar categorya
app.put('/category/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['description']);

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    });

});

//Borrar categoria (solo administrador)
app.delete('/category/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })

    });

});


module.exports = app;