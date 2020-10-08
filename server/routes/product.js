const express = require('express');
const { verificaToken } = require('../middlewares/authentication')
const _ = require('underscore');

const app = express();
let Product = require('../models/product.model');

//Obtener los productos
app.get('/products', verificaToken, (req, res) => {

    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 5;

    console.log(req.params.skip);
    Product.find()
        .populate('user', 'name email')
        .populate('category', 'description')
        .skip(skip)
        .limit(limit)
        .exec((err, productsDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Product.countDocuments((err, quantity) => {

                res.json({
                    ok: true,
                    products: productsDB,
                    quantity
                });

            });
        });
});

//obtener un producto por id
app.get('/products/:id', verificaToken, (req, res) => {
    //polate: usuario categaria
    //paginado
    let id = req.params.id

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    })

})

//Buscar productos
app.get('/products/search/:item', verificaToken, (req, res) => {
    let item = req.params.item;

    let regex = new RegExp(item, 'i');
    console.log(regex);

    console.log(item);
    Product.find({ name: regex })
        .populate('category', 'description')
        .exec((err, productsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productsDB
            })
        })
});

//Crear nuevo  producto
app.post('/products', verificaToken, (req, res) => {

    let body = req.body;
    let product = new Product({
        name: body.name,
        priceUniq: body.priceUniq,
        available: body.available,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })

    });


});

//Borrar un producto
//Solo cambiar de estado
app.delete('/products/:id', (req, res) => {
    let id = req.params.id;

    Product.findByIdAndUpdate(id, { available: false }, { new: true }, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    });

});

//Actualizar un producto
app.put('/products/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'available', 'priceUniq', 'description', 'category'])

    console.log(body);
    console.log(id);

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            product: productDB
        })


    })

})

module.exports = app;