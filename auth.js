const jwt = require('jsonwebtoken')

verificauser = function Autentica(varpassato){//il cookie lo generato nel post e scarico nel get
//var statuspedito=" " //OLD
var statuspedito = {};
  if (typeof varpassato.token === 'undefined') {//se il cookie restituisce
    //statuspedito="regular" //restituzione variabile utilizzo non login //OLD
    statuspedito = {
      status: "regular", id: '', nome: '', email: ''
    };
  }
  if (varpassato.token)  {//nel momento in cui il cookie c'è
    //const token = req.headers.authorization;
    var token=varpassato.token;//recupero il contenuto del cookie
    //console.log("cookie eccole");
    const secret = "segreto";//segreto utilizzato in decript
    jwt.verify(token, secret, (err, decoded) => {//decodifica
      if (err) {// nel caso il token scada
        //console.log('Token non valido');
        statuspedito = {
          status: "Token scaduto", id: '', nome: '', email: ''
          
        };
        return statuspedito;
        } else {
        //console.log('Token valido per l\'utente ' + decoded.name + ' '+decoded.status);//stampa nome
        //statuspedito=decoded.status; //OLD
        statuspedito = {
          status: decoded.status, id: decoded.id, nome: decoded.name, email: decoded.email
        };
        }
      });
    }
    return statuspedito;
};
module.exports.verificauser = verificauser;
