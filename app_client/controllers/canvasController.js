
angular.module('skyCastApp').controller('canvasController', ['$q', '$scope', 'reportService', canvasController]);

function canvasController($q, $scope, reportService) {
    var self = this;
    const searchRange = 13; // number of days for historical data search
    self.btnText = 'Show data for the last 2 weeks';
    self.showCanvas = false;

    $scope.$on('newSearchEvent', function() {
        // hides the canvas when user performs a new search
        self.btnText = 'Show data for the last 2 weeks';
        self.showCanvas = false;
    });

    self.showHistoricalData = function() {
        if (!self.showCanvas) {
            self.showCanvas = true;
            self.btnText = 'Hide data for the last 2 weeks';
            var results = reportService.searchHistoricalData(reportService.getReports().coords, searchRange);

            if (results) {
                self.figureCaption = 'Data for ' + results.location;

                $q.all(results.promises).then(function(responses) {
                    var i, historicalData = [];

                    for (i = 0; i < responses.length; i++) {
                        historicalData.push(responses[i]);
                    }

                    processHistoricalData(historicalData);
                    drawChart(historicalData);
                });
            }
        } else {
            self.btnText = 'Show data for the last 2 weeks';
            self.showCanvas = false;
        }
    };

    function processHistoricalData(historicalData) {
        // sort time in an ascending order
        historicalData.sort(function(a, b) {
            return a.time - b.time;
        });

        var i, curData, date;
        for (i = 0; i < historicalData.length; i++) {
            curData = historicalData[i];
            date = new Date(curData.time * 1000);
            curData.date = date.getMonth() + 1 + '/' + date.getDate();
        }
    };

    function drawChart(historicalData) {
        var i, labels = [], data = [];

        for (i = 0; i < searchRange; i++) {
            labels.push(historicalData[i].date);
            data.push(historicalData[i].temp);
        }

        $scope.labels = labels;
        $scope.data = [data];
        $scope.series = ['Series A'];

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];

        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        };
    };
};
