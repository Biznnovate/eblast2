angular.module('app.adminExplo', [])
    .controller('adminExploCtrl', ['$scope', '$stateParams', '$window', '$state', '$filter', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', 'Page', '$ionicScrollDelegate', '$ionicPopup', 'Productos', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
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
            let remoteAdminDB = new PouchDB('https://biznnovate.cloudant.com/eblast-admin', { skipSetup: true });
            remoteAdminDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
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
            $scope.explo = [];
            $scope.loadprojExplo = function() {
                $scope.show();

                var id = 'explo'

                localAdminDB.get(id).then(function(doc) {

                    $scope.explo = doc.explo || [];


                    console.log('projtiposthing' + doc.explo)


                    $scope.countExplos = doc.explo.length;

                }).catch(function(err) {
                    console.log(err);
                });


                $scope.hide();
            }

            $scope.loadprojExplo();



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

                $scope.explo.some(function(obj, i) {
                    return obj.lic === prod.lic ? index = i : false;
                });

                console.log(index);
                $scope.explo.splice(index, 1);

            };

            // add explo
            $scope.showNewProdForm = false;
            $scope.addProd = function() {
                $scope.newExplo = []
                $scope.showNewProdForm = true;
                $scope.inserted = {
                    name: "Nuevo",
                    lic: null,

                };
                $scope.newExplo.push($scope.inserted);
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
            $scope.updateNewExploName = function(obj) {
                $scope.newExploName = obj;
                console.log("newexploname " + obj)
            }
            $scope.updateNewExploLic = function(obj) {
                $scope.newExploLic = obj;
                console.log("newexplolic " + obj)
            }
            $scope.updateTipoProd = function(obj) {
                $scope.newProdTipo = obj.tipo;
                $scope.newProdTipoID = obj.id
                console.log("tipo " + obj.tipo + " tipoid " + obj.id)
            }
            $scope.saveProd = function(prod, idx) {

                var newProd = {

                    "name": $scope.newExploName,
                    "lic": $scope.newExploLic

                }
                console.log(prod)
                console.log(newProd)
                $scope.explo.push(newProd);
                $scope.showNewProdForm = false;
            }

            $scope.updateExplo = function() {
                $scope.show();
                var id = "explo"
                localAdminDB.get(id).then(function(doc) {
                    return localAdminDB.put({
                        _id: id,
                        _rev: doc._rev,
                        prods: $scope.explo,

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