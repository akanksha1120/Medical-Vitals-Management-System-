const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type:String,
        required: true
    },
    
})

const user = mongoose.model('User', userSchema);
module.exports = user;