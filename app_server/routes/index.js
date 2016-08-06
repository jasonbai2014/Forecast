var express = require('express');
var locationCtrl = require('../controllers/locationController');
var weatherCtrl = require('../controllers/weatherController');
var authenticationCtrl = require('../controllers/authenticationController');
var histCtrl = require('../controllers/historyController');
var router = express.Router();

var SECRET = 'wruf9832y9fhwguf';
if (process.env.NODE_ENV === 'production') {
    SECRET = process.env.SECRET;
}

var jwt = require('express-jwt');
var auth = jwt({
    secret: SECRET
});

/* Get lat and lng from an address */
router.get('/location', locationCtrl.searchLocation);

/* Get weather for a location */
router.get('/weather', weatherCtrl.searchWeather);

/* Post username and password to the server */
router.post('/signin', authenticationCtrl.signin);

/* Post username and password to the server */
router.post('/signup', authenticationCtrl.signup);

/* Save user's query into the database */
router.put('/history/:location', auth, histCtrl.saveSearch);

router.get('/history', auth, histCtrl.getSearchHistory);

module.exports = router;
