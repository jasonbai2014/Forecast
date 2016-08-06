
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.saveSearch = function(req, res) {
    var username = req.user.username;
    var location = req.params.location;

    if (username && location) {
        User.findOne({username: username}).exec(function(err, user) {
            if (user) {
                user.queries.push(location);
                user.save();
            }
        });
    }
};


module.exports.getSearchHistory = function(req, res) {
    if (req.user.username) {
        User.findOne({username: req.user.username}).exec(function(err, user) {
            if (user) {
                res.json({queries: user.queries});
            }
        });
    }
};