require('./config/config')

const express = require('express');
const bodyParser = require('body-parser')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Peticiones
app.get('/user', (req, res) => {


    res.json('get user');

});

app.post('/user', (req, res) => {


    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'The name is nesesary'
        });

    } else {
        res.json({
            person: body
        });
    }


});

app.put('/user/:id', (req, res) => {
    let id = req.params.id

    res.json({
        id
    });

});

app.delete('/user', (req, res) => {


    res.json('delete user');

});

app.listen(process.env.PORT, () => console.log('Escuchando en el puerto: ', process.env.PORT));