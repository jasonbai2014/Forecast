
var request = require('request');

//const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_KEY = 'AIzaSyC_RFPQsHTtn4TShF-ozdw3A_bSabQAZHM';

module.exports.searchLocation = function(req, res) {
    var location = req.query.location;

    var options = {
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        method: 'GET',
        qs: {
            address: location,
            key: GOOGLE_API_KEY
        }
    };

    request(options, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            sendJsonResponse(res, response.statusCode, body);
        } else {
            sendJsonResponse(res, response.statusCode, err);
        }
    });
};

function sendJsonResponse(res, status, content) {
    res.status(status);
    res.json(JSON.parse(content));
};



