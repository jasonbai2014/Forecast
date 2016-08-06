var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    hash: String,
    salt: String,
    queries: [String]
});

var SECRET = 'wruf9832y9fhwguf';
if (process.env.NODE_ENV === 'production') {
    SECRET = process.env.SECRET;
}

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
    }, SECRET);
};

mongoose.model('User', userSchema);
