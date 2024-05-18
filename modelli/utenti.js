const { type } = require('express/lib/response');
const { Int32 } = require('mongodb');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const UtenteSchema=new Schema({
    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    bilancio:{
        type:Number,
        required:true
    }
})

module.exports=item=mongoose.model('Utenti',UtenteSchema);