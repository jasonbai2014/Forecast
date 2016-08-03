
var mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI);
require('./users');

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('disconnected', function() {
   console.log('Mongoose disconnected from ' + dbURI)
});

mongoose.connection.on('error', function(err) {
   console.log('Mongoose connection error! ' + err);
});

process.once('SIGTERM', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected due to Heroku app shutdown');
    });
});