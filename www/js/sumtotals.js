/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module("sumtotals", [])
    .filter('sumOfValue', function () {
    return function (data, key) {        
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;        
        var sum = 0;        
        angular.forEach(data,function(value){
            sum = sum + parseInt(value[key]);
        });        
        return sum;
    }
}).filter('totalSumPriceQty', function () {
    return function (data, key1, key2) {        
        if (angular.isUndefined(data) || angular.isUndefined(key1)  || angular.isUndefined(key2)) 
            return 0;        
        var sum = 0;
        angular.forEach(data,function(value){
            sum = sum + (parseInt(value[key1]) * parseInt(value[key2]));
        });
        return sum;
    }
});