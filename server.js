const express = require('express');
const router = require('./routers/router');

const app = express();
const PORT = process.env.PORT || 3000;

// Imposta il motore di rendering EJS
app.set('view engine', 'ejs');

// Middleware per gestire i file statici nella directory 'public'
app.use(express.static('public'));

// Usa il router per gestire il routing delle richieste
app.use('/', router);

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
