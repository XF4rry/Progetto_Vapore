const express = require('express');
const router = express.Router();
const bodyParser=require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const axios = require('axios').default;
const https = require('https');
const autorizza = require('../auth');
router.use(bodyParser.urlencoded({
    extended:true
}))
const url="mongodb+srv://MarcelloBelli:Marcello2006@belli.3ytwn3r.mongodb.net/?retryWrites=true&w=majority&appName=Belli";
const mongoose=require('mongoose');
mongoose.connect(url)
.then(()=>{
    console.log("Connesso al database")
}) 
.catch((err)=>{
    console.error("Errore"+err)
})
const Utente=require('../modelli/utenti');
const Wishlist=require('../modelli/wishlist');
const path=require('path');
const { redirect } = require('express/lib/response');

// Gestisce la richiesta GET per la homepage
router.get('/', (req, res) => {

    const tokenRecuperato = req.cookies.jsonwt;
    const secret = 'Accesso Effettuato';
    jwt.verify(tokenRecuperato, secret, (err, decoded) => {
        if (err) {
            console.log('Token non valido');
        } else {
            statusSpedito= {
                email: decoded.email
            }
        }

        res.render('pages/index', {
            err:err,
            email:statusSpedito.email
        });
    
    });
        // Renderizza il file EJS 'index.ejs' nella directory 'views'
       
});

router.post('/', (req, res) => {
    
    res.clearCookie('jsonwt');
    return res.redirect('/');

});

router.post('/carrello#', (req, res) => {
    const token = req.cookies.jsonwt;
    const secret = 'Accesso Effettuato';
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log('Token non valido');
        } else {
            statusSpedito= {
                email: decoded.email
            }
        }
    });
    Wishlist.deleteOne({email:statusSpedito.email, titolo:req.body.titolo},(err,item)=>{
        if(err){
            console.log(err);
        } else {
            console.log("Item eliminato correttamente dalla wishist");

        }

    })

});

router.get('/login', (req, res) => {
    // Renderizza il file EJS 'index.ejs' nella directory 'views'
    res.render('pages/login');
});
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    // Cerca l'utente nel database
    Utente.findOne({ email: email, password: password })
        .then(user => {
            if (user) {
                // Se l'utente esiste, puoi fare qualcosa, come reindirizzarlo a un'altra pagina e mando l'alert che è stato eseguito correttamente l'accesso
                console.log("Utente trovato");
                res.clearCookie('jwt');
                const payload = {email: email, password: password};
                const secret = 'Accesso Effettuato';
                const options = { expiresIn: '5h' };
                const token = jwt.sign(payload, secret, options);
                console.log('token: ',token);
                res.cookie('jsonwt', token);
                res.redirect('/');
                //res.send(`<script>alert('Accesso effettuato con successo')</script>`);
            } else {
                // Se l'utente non esiste, stampa un errore
                console.error("Utente non trovato");
                res.status(404).json({ success: false, message: 'Credenziali non valide' });
            }
        })
        .catch(err => {
            console.error("Errore durante il login:", err);
            //res.status(500).json({ success: false, message: 'Errore durante il login. Si prega di riprovare più tardi.' });
        });

});


router.get('/signin', (req, res) => {
    // Renderizza il file EJS 'index.ejs' nella directory 'views'
    res.render('pages/signin');
});
router.post('/signin',  (req, res) => {
   
    var email=req.body.email;
    var password=req.body.password;

    const newUtente = new Utente({
        email: email,
        password: password,
        bilancio: 0
    });

    newUtente
    .save()     //salva i dati del nuovo utente nel database
    .then(item=>console.log(item))
    .catch(err=>console.log(err))
    
    
    res.redirect('/login'); //lo rispedisco alla pagina di login per fare l'accesso (per il salvataggio dei dati sul token/cookie)
});

var immg;
var titolo;
var descrizione;
var genere;
var dev;
var data;
var l;
var titoli=[];

var pagamento="";
    router.get('/shop', (req, res) => {
        const apiUrl='https://www.freetogame.com/api/games?platform=pc';
        axios.get(apiUrl)
          .then(function (response) {
            const lista=response.data;
            res.render('pages/shop',{
                lista:lista
          })
        
        
        });
        
        });

        router.get('/carrello', async (req, res) => {
            try {
                const apiUrl = 'https://www.freetogame.com/api/games?platform=pc';
                const tokenRecuperato = req.cookies.jsonwt;
                const secret = 'Accesso Effettuato';
                var statusSpedito;
        
                jwt.verify(tokenRecuperato, secret, (err, decoded) => {
                    if (err) {
                        res.send('Accesso scaduto o non valido');
                    } else {
                        statusSpedito = {
                            email: decoded.email,
                            password: decoded.password
                        };
                        console.log(statusSpedito.email);
                    }
                });
        
                // Connessione al database
                await mongoose.connect(url);
                console.log("Connessione al database avvenuta con successo.");
        
                // Ricerca degli elementi nella Wishlist
                const items = await Wishlist.find({ email: statusSpedito.email });
        
                // Verifica se ci sono elementi nella Wishlist
                if (items.length === 0) {
                    console.log("Nessun elemento trovato nella Wishlist per l'email:");
                    res.render('pages/carrello', { lista: [], titoli: [],pagamento:"WISHLIST VUOTA"}); // Renderizza la pagina con tutte le variabili impostate a 0
                } else {
                    // Estrai i titoli degli elementi
                    const titoli = items.map(item => item.titolo);
                    console.log("Titoli degli elementi nella Wishlist:", titoli);
        
                    // Ottenere dati dall'API
                    const response = await axios.get(apiUrl);
                    const lista = response.data;
                    res.render('pages/carrello', { titoli, lista, pagamento: 0 });
                }
            } catch (error) {
                console.error("Si è verificato un errore:", error);
                res.render('pages/carrello', { lista: [], titoli: [], pagamento: "WISHLIST VUOTA" });
            }
        });
        
        
        router.post('/carrello', async (req, res) => {
            try {
                const tokenRecuperato = req.cookies.jsonwt;
                const secret = 'Accesso Effettuato';
                let costo = 0;
        
                const decoded = jwt.verify(tokenRecuperato, secret);
                const statusSpedito = {
                    email: decoded.email,
                    password: decoded.password
                };
        
                // Trova la wishlist dell'utente
                const wishlist = await Wishlist.find({ email: statusSpedito.email });
                if (!wishlist || wishlist.length === 0) {
                    console.log("Wishlist non trovata o vuota per l'email:", statusSpedito.email);
                    return res.status(404).send('Wishlist non trovata o vuota');
                }
        
                console.log("Wishlist trovata:", wishlist);
        
                // Estrai i titoli dalla wishlist
                const titoli = wishlist.map(item => item.titolo);
        
                // Calcola il costo totale
                costo = wishlist.reduce((acc, curr) => {
                    if (titoli.includes(curr.titolo)) {
                        return acc + 15;
                    } else {
                        return acc;
                    }
                }, 0);
        
                // Trova l'utente
                const utente = await Utente.findOne({ email: statusSpedito.email });
                if (!utente) {
                    console.log("Utente non trovato per l'email:", statusSpedito.email);
                    return res.status(404).send('Utente non trovato');
                }
        
                // Verifica se il bilancio è sufficiente per l'acquisto
                if (utente.bilancio >= costo) {
                    console.log("Transazione avvenuta con successo");
                    const nuovoBilancio = utente.bilancio - costo;
        
                    // Aggiorna il bilancio dell'utente
                    await Utente.updateOne({ email: statusSpedito.email }, { bilancio: nuovoBilancio });
        
                    // Rimuovi gli elementi dalla wishlist
                    await Wishlist.deleteMany({ email: statusSpedito.email });
        
                    console.log("Elementi nella wishlist rimossi con successo");
                    res.redirect('/carrello');
                } else {
                    console.log("Transazione fallita: bilancio insufficiente");
                    res.status(400).send("Transazione fallita: bilancio insufficiente");
                }
            } catch (error) {
                console.error("Si è verificato un errore durante l'elaborazione della transazione:", error);
                res.status(500).send("Si è verificato un errore durante l'elaborazione della transazione");
            }
        });
        
        
        


      
        router.post('/shop', (req, res) => {
            const tokenRecuperato = req.cookies.jsonwt;
            const secret = 'Accesso Effettuato';
            var statusSpedito;
            jwt.verify(tokenRecuperato, secret, (err, decoded) => {
                if (err) {
                    res.send('Accesso scaduto o non valido');
                } else {
                    statusSpedito ={
                        email: decoded.email, password: decoded.password
                    };
                    console.log(statusSpedito.email);
                    
                }
            });
            // Ora puoi estrarre il valore del bottone dal corpo della richiesta
             const buttonValue = req.body.titolo;

            // Ora puoi stampare il valore nella console del server
            console.log(buttonValue);
            console.log("porcoddio");
            
            
            

            const newWishlist = new Wishlist({
                email: statusSpedito.email,
                titolo:buttonValue 
            });


        
            newWishlist
            .save()     //salva i dati del nuovo gioco aggiunto al database della wishlist
            .then(item=>console.log(item))
            .catch(err=>console.log(err))

            res.redirect('/shop');
        })




        router.get('/bilancio', (req, res) => {
            const tokenRecuperato = req.cookies.jsonwt;
            const secret = 'Accesso Effettuato';
            var statusSpedito;
            jwt.verify(tokenRecuperato, secret, (err, decoded) => {
                if (err) {
                    res.send('Accesso scaduto o non valido');
                } else {
                    statusSpedito ={
                        email: decoded.email, password: decoded.password
                    };
                    console.log(statusSpedito.email);
                    
                }
            });
            Utente.findOne({email: statusSpedito.email})
            .then(item => {
                console.log(item);
                res.render('pages/bilancio', {
                    err: null,
                    email: statusSpedito.email,
                    bilancio: item.bilancio,
                    lista: item.wishlist
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ success: false, message: 'Errore durante il login. Si prega di riprovare più tardi.' });
            });


        })


        router.post('/bilancio', (req, res) => {
            const tokenRecuperato = req.cookies.jsonwt;
            const secret = 'Accesso Effettuato';
            var statusSpedito;
            jwt.verify(tokenRecuperato, secret, (err, decoded) => {
                if (err || req.body.ricarica <= 0) {
                    res.send('Accesso scaduto, non valido o importo richiesto non valido');
                } else {
                    statusSpedito ={
                        email: decoded.email, password: decoded.password
                    };
                }
            });
            Utente.findOneAndUpdate({email: statusSpedito.email}, {
                $inc: {
                    bilancio: req.body.ricarica
                }
            })
            .then(item => {
                console.log(item);
                res.redirect('/bilancio');
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ success: false, message: 'Errore durante il login. Si prega di riprovare più tardi.' });
            });


        })


        
       

module.exports = router;
