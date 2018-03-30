angular.module('app.adminCamion', [])
    .controller('adminCamionCtrl', ['$scope', '$stateParams', '$window', '$state', '$filter', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', 'Page', '$ionicScrollDelegate', '$ionicPopup', 'Productos', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $window, $state, $filter, pouchDB, Excel, $timeout, $ionicLoading, Page, $ionicScrollDelegate, $ionicPopup, Productos) {
            $scope.$root.showMenuIcon = true;
            $scope.show = function() {
                $ionicLoading.show({
                    template: 'Loading...',
                    duration: 3000
                }).then(function() {
                    console.log("The loading indicator is now displayed");
                });
            };

            $scope.hide = function() {
                $ionicLoading.hide().then(function() {
                    console.log("The loading indicator is now hidden");
                });
            };



            //Load BD de de Proyectos y sus caracteristicas

            $scope.projparam = {
                'id': $stateParams.id,
                'status': $stateParams.status,
                'proj': $stateParams.proj,
            }
            Page.setTitle($stateParams.proj);

            //Declara y Sincroniza base de datos de Tipo


            let localAdminDB = new pouchDB('admin');
            let remoteAdminDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-admin', { skipSetup: true });
            remoteAdminDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteAdminDB.getSession();
            });
            //Declara y Sincroniza base de datos de Tipo

            $scope.sync = function() {
                $scope.show();
                localAdminDB.sync(remoteAdminDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });

                $scope.hide();
            }
            $scope.camion = [];
            $scope.loadprojcamion = function() {
                $scope.show();

                var id = 'camion'

                localAdminDB.get(id).then(function(doc) {

                    $scope.camion = doc.camion || [];


                    console.log('projtiposthing' + doc.camion)


                    $scope.countcamions = doc.camion.length;

                }).catch(function(err) {
                    console.log(err);
                });


                $scope.hide();
            }

            $scope.loadprojcamion();



            $scope.createProductos = function() {
                let localprodsDB = new pouchDB('prods');




                localprodsDB.post({

                    _id: 'productos',

                    prods: $scope.prod_list,



                }).then(function(response) {
                    // handle response
                }).catch(function(err) {
                    console.log(err);
                });

                $scope.sync();
                console.log('subieron los productos')

            }
            $scope.removeProd = function(prod) {
                var index = -1;

                $scope.camion.some(function(obj, i) {
                    return obj.lic === prod.lic ? index = i : false;
                });

                console.log(index);
                $scope.camion.splice(index, 1);

            };

            // add camion
            $scope.showNewProdForm = false;
            $scope.addProd = function() {
                $scope.newcamion = []
                $scope.showNewProdForm = true;
                $scope.inserted = {
                    name: "Nuevo",
                    lic: null,

                };
                $scope.newcamion.push($scope.inserted);
            };

            $scope.showTipoID = function(obj) {
                var selected = [];
                if (obj.tipo) {
                    selected = $filter('filter')($scope.tiposProd, { value: obj.tipo });
                }
                return selected.length ? selected[0].id : 'Not set';
                alert(obj.tipo)
            };
            $scope.showTipo = function(obj) {
                var selected = [];
                if (obj.tipo) {
                    selected = $filter('filter')($scope.tiposProd, { value: obj.tipo });
                }
                $scope.selectedTipo = selected;
                return selected.length ? selected[0].tipo : 'Not set';



            };
            $scope.updateNewcamionName = function(obj) {
                $scope.newcamionName = obj;
                console.log("newcamionname " + obj)
            }
            $scope.updateNewcamionLic = function(obj) {
                $scope.newcamionLic = obj;
                console.log("newcamionlic " + obj)
            }
            $scope.updateTipoProd = function(obj) {
                $scope.newProdTipo = obj.tipo;
                $scope.newProdTipoID = obj.id
                console.log("tipo " + obj.tipo + " tipoid " + obj.id)
            }
            $scope.saveProd = function(prod, idx) {

                var newProd = {

                    "name": $scope.newcamionName,
                    "lic": $scope.newcamionLic

                }
                console.log(prod)
                console.log(newProd)
                $scope.camion.push(newProd);
                $scope.showNewProdForm = false;
            }

            $scope.updatecamion = function() {
                $scope.show();
                var id = "camion"
                localAdminDB.get(id).then(function(doc) {
                    return localAdminDB.put({
                        _id: id,
                        _rev: doc._rev,
                        prods: $scope.camion,

                    });
                }).then(function(response) {
                    // handle response

                }).catch(function(err) {
                    console.log(err);
                });
                $scope.hide();
            }

        }

    ])