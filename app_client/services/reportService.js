
angular.module('skyCastApp').factory('reportService', ['$http', '$q', reportService]);

function reportService($http, $q) {
    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const secInOneDay = 86400; // number of seconds in one day

    var reports = {
        current: {},
        future: [{}, {}, {}, {}, {}, {}, {}],
        formattedAddress: null,
        coords: null
    };

    function searchLoc(loc) {
        if (loc && loc.length > 0) {
            return $http.get('/location?location=' + loc).then(function (response) {
                // This is success callback
                if (response.data.results.length > 0) {
                    reports.coords = response.data.results[0].geometry.location;
                    reports.formattedAddress = response.data.results[0].formatted_address;
                    return {coords: reports.coords};
                } else {
                    // when no location matches, the array size is 0
                    return $q.reject({error: 'Location is invalid'});
                }
            });
        } else {
            return $q.reject({error: 'A location is needed'});
        }
    };

    function searchWeather(coords) {
        if (coords) {
            return $http.get('/weather?lat=' + coords.lat + '&lng=' + coords.lng).then(function (response) {
                // This is success callback
                processCurReport(response.data.currently);
                processFutureReports(response.data.daily.data);
                return reports;
            });
        } else {
            return $q.reject({error: 'Coordinates are invalid'});
        }
    };

    function processCurReport(curReport) {
        reports.current.summary = curReport.summary;
        reports.current.icon = curReport.icon;
        reports.current.temp = Math.round(curReport.temperature);
    };

    function processFutureReports(furReports) {
        var i, date, correctedIdx;
        // the data at index 0 is for current day, don't need to have it in the future reports
        for (i = 1; i < furReports.length; i++) {
            date = new Date(furReports[i].time * 1000);
            correctedIdx = i - 1;
            reports.future[correctedIdx].weekday = weekdays[date.getDay()];
            reports.future[correctedIdx].summary = furReports[i].summary;
            reports.future[correctedIdx].icon = furReports[i].icon;
            reports.future[correctedIdx].minTemp = Math.max(furReports[i].temperatureMin);
            reports.future[correctedIdx].maxTemp = Math.max(furReports[i].temperatureMax);
        }
    };

    function searchHistoricalData(coords, searchRange) {
        var results = null;

        if (coords) {
            var curDayInSec = Math.round(Date.now() / 1000);
            var i, minTemp, maxTemp;
            results = {
                location: reports.formattedAddress,
                promises: []
            };

            for (i = 1; i <= searchRange; i++) {
                results.promises.push($http.get('/weather?lat=' + coords.lat + '&lng=' + coords.lng + '&time=' +
                    (curDayInSec - i * secInOneDay)).then(function (response) {
                    // this is success callback
                    var data = {};
                    data.time = response.data.daily.data[0].time;
                    minTemp = parseInt(response.data.daily.data[0].temperatureMin);
                    maxTemp = parseInt(response.data.daily.data[0].temperatureMax);
                    data.temp = Math.round((minTemp + maxTemp) / 2);

                    return data;
                }));
            }
        }

        return results;
    };

    function containsData() {
        return reports.coords !== null;
    }

    function getReports() {
        return reports;
    }

    return {
        searchLoc: searchLoc,
        searchWeather: searchWeather,
        containsData: containsData,
        getReports: getReports,
        searchHistoricalData: searchHistoricalData
    };
}
