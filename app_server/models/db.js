
var mongoose = require('mongoose');
//const dbURI = process.env.MONGODB_URI;
const dbURI = 'mongodb://heroku_rxvmxsrx:96nbdsfo5494hi4s1mcpt9qkfq@ds023054.mlab.com:23054/heroku_rxvmxsrx';
mongoose.Promise = global.Promise; // Use native promises for mongoose
mongoose.connect(dbURI);
require('./users');

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('disconnected', function() {
   console.log('Mongoose disconnected from ' + dbURI);
});

mongoose.connection.on('error', function(err) {
   console.log('Mongoose connection error! ' + err);
});

process.once('SIGTERM', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected due to Heroku app shutdown');
    });
});