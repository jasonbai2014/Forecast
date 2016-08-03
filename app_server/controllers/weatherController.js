
var request = require('request');
//const FORECAST_API_KEY = process.env.FORECAST_API_KEY;
const FORECAST_API_KEY = '9eab6c0fc4aa790c16ff8444601cfd26';

module.exports.searchWeather = function(req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var timeRange = req.query.time;

    var query = lat + ',' + lng;
    if (timeRange) {
        query = query + ',' + timeRange;
    }

    var options = {
        url: 'https://api.forecast.io/forecast/' + FORECAST_API_KEY + '/' + query,
        method: 'GET'
    };

    request(options, function(err, response, content) {
        if (!err && response.statusCode === 200) {
            sendJsonResponse(res, response.statusCode, content);
        } else {
            sendJsonResponse(res, response.statusCode, err);
        }
    });
};

function sendJsonResponse(res, status, content) {
    res.status(status);
    res.json(JSON.parse(content));
};
