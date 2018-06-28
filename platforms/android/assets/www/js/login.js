angular.module('app.login', [])
    .controller('loginCtrl', ['$scope', '$stateParams', 'LoginService', '$state', 'pouchDB', '$timeout', '$ionicLoading', '$ionicPopup', '$window', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$localStorage', '$sessionStorage',
        // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, LoginService, $state, pouchDB, $timeout, $ionicLoading, $ionicPopup, $window, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $localStorage, $sessionStorage) {

            // var token = "este es el token"
            // $window.localStorage.setItem("token", token);

            //alert($window.localStorage.getItem("token"))
            // $scope.$storage = $localStorage.$default({
            //   u: ''
            // });
            //$stateParams.usr = ''
            delete $localStorage;
            $window.localStorage.removeItem("tokenU")
            $scope.logout = function() {

                $window.location.reload();
                // $scope.stateParams.usr = ''
            }

            if ($stateParams.usr != '') {

                $scope.logout();

            }

            // alert($scope.$storage.u)

            $ionicSideMenuDelegate.canDragContent(false)
            $scope.showmenu = false;


            $scope.show = function() {
                $ionicLoading.show({
                    template: 'Loading...',
                    duration: 3000
                }).then(function() {
                    console.log("The loading indicator is now displayed");
                });
            };
            $stateParams.usr = "";
            $scope.hide = function() {
                $ionicLoading.hide().then(function() {
                    console.log("The loading indicator is now hidden");
                });
            };


            $scope.sync = function() {
                $scope.show();
                localAdminDB.sync(remoteAdminDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });

                $scope.hide();
            }
            let localAdminDB = new pouchDB('admin');
            let remoteAdminDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-admin', { skipSetup: true });
            remoteAdminDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteAdminDB.getSession();
            });
            localAdminDB.sync(remoteAdminDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });


            $scope.loadAdminDBFunc = function() {
                $scope.show();

                var id = 'user';
                $scope.adminu = [];
                localAdminDB.get(id).then(function(doc) {
                    console.log(doc)
                    $scope.adminu = doc.users

                }).catch(function(err) {
                    console.log(err);

                });
                $scope.hide();

            }


            $scope.data = [];
            $scope.loadAdminDBFunc();

            $scope.login = function(data) {
                $scope.sync();

                var rows = $scope.adminu;
                var u = data.username
                var p = data.password
                $scope.dbu = '';
                $scope.dbp = '';
                $scope.dbus = '';
                console.log('u ' + u + ' p ' + p)
                angular.forEach(rows, function(users) {
                        //console.log(users)
                        if (users.u === u) {
                            $scope.dbu = users.u;
                            $scope.dbp = users.p;
                            $scope.dbus = { u: users.u, p: users.p, t: users.t }
                        }

                    }


                )

                LoginService.loginUser(u, p, $scope.dbu, $scope.dbp).success(function(data) {
                    console.log(data)
                    $state.go('menu.vistaDeProyecto', { 'usr': $scope.dbus });
                }).error(function(data) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error al Iniciar Sesión!',
                        template: 'Favor verifique sus credenciales o comuniquese con el Administrador'
                    });
                });
                console.log('dbu ' + $scope.dbu)
            };

        }
    ])