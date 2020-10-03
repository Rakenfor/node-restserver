const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

//Peticiones
app.get('/user', (req, res) => {

    let skip = req.query.skip || 0;
    skip = Number(skip);

    let limit = req.query.limit || 5;
    limit = Number(limit)

    User.find({ state: true }, 'name email role state google img')
        .skip(skip)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, count) => {

                res.json({
                    ok: true,
                    users,
                    quantity: count
                })
            })

        });

});

app.post('/user', (req, res) => {


    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // userDB.password = null
        res.json({
            ok: true,
            user: userDB
        })

    });


});

app.put('/user/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        });
    })


});

app.delete('/user/:id', (req, res) => {

    let id = req.params.id;


    //Eliminado completamente
    // User.findByIdAndRemove(id, (err, userRemoved) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!userRemoved) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         user: userRemoved
    //     })
    // })

    User.findByIdAndUpdate(id, { state: false }, { new: true }, (err, userRemoved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userRemoved) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: userRemoved
        })
    })

});

module.exports = app;