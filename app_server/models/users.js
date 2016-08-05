var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    hash: String,
    salt: String,
    queries: [String]
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.isValidPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {

    return jwt.sign({
        _id: this._id,
        username: this.username
    }, 'thisIsSecret'); // TO-DO, this needs to be replaced by an environment variable later
};

mongoose.model('User', userSchema);
