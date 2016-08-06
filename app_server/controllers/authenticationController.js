var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.signin = function(req, res) {
    if (!req.body.username || !req.body.password) {
        sendJsonResponse(res, 400, {message: 'missing required field(s)'});
        return;
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            sendJsonResponse(res, 404, err);
            return;
        }

        if (user) {
            var jwt = user.generateJwt();
            sendJsonResponse(res, 200, {jwt:jwt});
        } else {
            sendJsonResponse(res, 401, info);
        }
    })(req, res);
};

module.exports.signup = function(req, res) {
    if (!req.body.username || !req.body.password) {
        sendJsonResponse(res, 400, {message: 'missing required field(s)'});
        return;
    }

    var user = new User();
    user.username = req.body.username;
    user.queries = [];

    user.setPassword(req.body.password);
    user.save(function(err) {
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            var jwt = user.generateJwt();
            sendJsonResponse(res, 200, {jwt: jwt});
        }
    });
};

function sendJsonResponse(res, status, message) {
    res.status(status);
    res.json(message);
};
