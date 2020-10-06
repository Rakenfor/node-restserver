//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Base de datos
let urlDB;

//venimiento del Token
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

//SEED de autenticacion
process.env.SEED = process.env.SEED || 'drakenfor';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;