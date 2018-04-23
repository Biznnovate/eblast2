angular.module('app.login', [])
    .controller('loginCtrl', ['$scope', '$stateParams', 'LoginService', '$ionicPopup', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, LoginService, $ionicPopup, $state) {

            $scope.data = {};

            $scope.login = function() {
                LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
                    $state.go('menu.admincons');
                }).error(function(data) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: 'Please check your credentials!'
                    });
                });
            }

        }
    ])