//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Base de datos
let urlDB;

//venimiento del Token
process.env.EXPIRATION_TOKEN = '48h';

//SEED de autenticacion
process.env.SEED = process.env.SEED || 'drakenfor';

//Google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '840098751734-il77u38edknsl9cvrmkk9br7avlijj9v.apps.googleusercontent.com';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;