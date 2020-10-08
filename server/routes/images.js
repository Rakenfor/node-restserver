const express = require('express');
const fs = require('fs');
const path = require('path')

const { verificaTokenImg } = require('../middlewares/authentication')

let app = express();

app.get('/image/:type/:img', verificaTokenImg, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../upload/${ type }/${ img }`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(pathNoImage);
    }

})

module.exports = app;