const express = require('express');
const app = express()

app.use(require('./user.js'));
app.use(require('./login.js'));
app.use(require('./category.js'));
app.use(require('./product'))

module.exports = app;