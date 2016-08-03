var express = require('express');
var locationCtrl = require('../controllers/locationController');
var weatherCtrl = require('../controllers/weatherController');
var router = express.Router();

/* Get home page. */
router.get('/', function(req, res) {
  res.render('layout', { title: 'SkyCast' });
});

/* Get lat and lng from an address */
router.get('/location', locationCtrl.searchLocation);

/* Get weather for a location */
router.get('/weather', weatherCtrl.searchWeather);

module.exports = router;
