var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: new Date().toLocaleString()
    },
    contact: {
        type: String,
        required: true
    },
    profileimage: {
        type : String,
    }
    
},
{collection: 'details'});


const User = mongoose.model('User', userSchema);
module.exports = User 
