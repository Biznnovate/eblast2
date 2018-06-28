angular.module('app.adminUser', [])
    .controller('adminUserCtrl', ['$scope', '$stateParams', '$window', '$state', '$filter', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', 'Page', '$ionicScrollDelegate', '$ionicPopup', 'Productos', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
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
                'usr': $stateParams.usr
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
            $scope.tipos = [
                { t: 'Usuario', id: 'u' },
                { t: 'Admin', id: 'a' }
            ]

            $scope.usuario = [];
            $scope.loadprojusuario = function() {
                $scope.show();

                var id = 'user'

                localAdminDB.get(id).then(function(doc) {

                    $scope.usuario = doc.users || [];



                    console.log('projtiposthing' + doc.users)


                    $scope.countusuarios = doc.users.length;

                }).catch(function(err) {
                    console.log(err);
                });


                $scope.hide();
            }

            $scope.loadprojusuario();



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
            $scope.removeProd = function(idx) {
                var index = -1;

                //$scope.usuario.some(function(obj, i) {
                //    return obj.u === prod.u ? index = i : false;
                //});

                console.log(idx);
                $scope.usuario.splice(idx, 1);

            };

            // add usuario
            $scope.showNewProdForm = false;
            $scope.addProd = function() {
                $scope.newusuario = []
                $scope.showNewProdForm = true;
                $scope.inserted = {
                    name: "Nuevo",
                    lic: null,

                };
                $scope.newusuario.push($scope.inserted);
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
            $scope.updateNewusuarioName = function(obj) {
                $scope.newusuarioName = obj;
                console.log("newusuarioname " + obj)
            }
            $scope.updateNewusuarioPass = function(obj) {
                $scope.newusuarioPass = obj;
                console.log("newusuarioPass " + obj)
            }
            $scope.updateTipo = function(obj) {
                $scope.newTipo = obj.t;
                $scope.newusuarioTipo = obj.id
                console.log("tipo " + obj.tipo + " tipoid " + obj.id)
            }
            $scope.saveProd = function(prod, idx) {

                var newProd = {

                    "u": $scope.newusuarioName,
                    "p": $scope.newusuarioPass,
                    't': $scope.newusuarioTipo

                }
                console.log(prod)
                console.log(newProd)
                $scope.usuario.push(newProd);
                $scope.showNewProdForm = false;
            }

            $scope.updateusuario = function() {
                $scope.show();
                var id = "user"
                localAdminDB.get(id).then(function(doc) {
                    return localAdminDB.put({
                        _id: id,
                        _rev: doc._rev,
                        users: $scope.usuario,

                    });
                }).then(function(response) {
                    // handle response

                }).catch(function(err) {
                    console.log(err);
                });
                $scope.hide();
                alert("Se ha actualizado la Información");
            }

        }

    ])