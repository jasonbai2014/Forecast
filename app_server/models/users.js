var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    password: {type: String, required: true},
    queries: [String]
});

var user = mongoose.model('User', userSchema);
module.exports = user;