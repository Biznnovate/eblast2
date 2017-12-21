angular.module('app.services', [])


.factory('Uploadcsv', ['$http', function($http) {
    var Url = "src/utils/austin.csv";
    var Uploadcsv = $http.get(Url).then(function(response) {
        //return CSVtoArray(response.data);
        return response.data;
    });
    return Uploadcsv;

}])

.service('CsvParser', ['$http', function($http) {

    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [
            []
        ];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }

}])

.filter('csvToObj', function() {

    return function(input) {
        var rows = input.split('\n');
        var obj = [];
        angular.forEach(rows, function(val) {
            var o = val.split(',');
            obj.push({
                Col1: o[0],
                Col2: o[1],
                Col3: o[2],
                Col4: o[3],
                Col5: o[4],
                //CordY: "not sent"
            });
            let localDB = pouchDB('barrenoscsv');
            localDB.put(obj).then(function(response) {
                // handle response
            }).catch(function(err) {
                console.log(err);
            });
        });
        return obj;
    };
})

.service('pouchdbserv', ['pouchDB', function(pouchDB) {
    var db = pouchDB('name');
    var PouchDB = require('pouchdb');
    PouchDB.plugin(require('pouchdb-find'));
    PouchDB.plugin(require('pouchdb-load'));
}])

.filter('getById', function() {
    return function(input, id) {
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (+input[i] == +id) {
                return input[i];
            }
        }
        return null;
    }
})

.factory('Excel', function($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
    return {
        tableToExcel: function(tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})

.service('passInfo', function() {

    // private variable
    var _dataObj = {};

    this.dataObj = _dataObj;
})

.controller('One', function($scope, dataService) {
    $scope.data = dataService.dataObj;
})

.controller('Two', function($scope, dataService) {
    $scope.data = dataService.dataObj;
})

.factory('Page', function() {
    var title = 'default';
    return {
        title: function() { return title; },
        setTitle: function(newTitle) { title = newTitle }
    };
});