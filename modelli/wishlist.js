const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const WishlistSchema=new Schema({
    email:{
        type:String,
        required:true
    },

    titolo:{
        type:String,
        required:true
    }
})

module.exports=item=mongoose.model('Wishlist',WishlistSchema);