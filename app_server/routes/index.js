var express = require('express');
var locationCtrl = require('../controllers/locationController');
var weatherCtrl = require('../controllers/weatherController');
var authenticationCtrl = require('../controllers/authenticationController');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'thisIsSecret',
    userProperty: 'payload'
});

///* Get home page. */
//router.get('/', function(req, res) {
//  res.render('layout', { title: 'SkyCast' });
//});

/* Get lat and lng from an address */
router.get('/location', locationCtrl.searchLocation);

/* Get weather for a location */
router.get('/weather', weatherCtrl.searchWeather);

router.post('/signin', authenticationCtrl.signin);

router.post('/signup', authenticationCtrl.signup);

module.exports = router;
