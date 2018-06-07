angular.module('app.menu', [])
    .controller('menuCtrl', ['$scope', '$stateParams', '$window', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $window, $state) {
            $scope.projparam = {
                'id': $stateParams.id,
                'status': $stateParams.status,
                'proj': $stateParams.proj,
                'usr': $stateParams.usr
            }



        }
    ])