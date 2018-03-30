angular.module('app.editProds', [])
    .controller('editProdsCtrl', ['$scope', '$stateParams', '$window', '$state', '$filter', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', 'Page', '$ionicScrollDelegate', '$ionicPopup', 'Productos', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
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

            $scope.tiposProd = [
                { id: "cg", tipo: "Componentes / Emulsión a granel" },
                { id: "ce", tipo: "Emulsión Empacada" },
                { id: "ini", tipo: "Booster (Iniciador)" },
                { id: "dd", tipo: "Detonadores Duales" },
                { id: "li", tipo: "Líneas de inicio" },
                { id: "cd", tipo: "Cordón detonante" },
                { id: "de", tipo: "Detonadores eléctricos y electrónicos" },
                { id: "ot", tipo: "Otros" },
            ]

            //Load BD de de Proyectos y sus caracteristicas

            $scope.projparam = {
                'id': $stateParams.id,
                'status': $stateParams.status,
                'proj': $stateParams.proj,
            }
            Page.setTitle($stateParams.proj);

            //Declara y Sincroniza base de datos de Tipo


            let localprodsDB = new pouchDB('prods');
            let remoteprodsDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-products', { skipSetup: true });
            remoteprodsDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprodsDB.getSession();

            })

            localprodsDB.sync(remoteprodsDB).on('complete', function() {
                // yay, we're in sync!

            }).on('error', function(err) {
                // boo, we hit an error!
            });
            var prodid = 'productos'
            localprodsDB.get('productos').then(function(doc) {
                $scope.prod_list = doc.prods;
                console.log(doc)

                console.log('bajaron los procutos')

            }).catch(function(err) {
                console.log(err);
            });


            $scope.sync = function() {
                localprodsDB.sync(remoteprodsDB).on('complete', function() {
                    // yay, we're in sync!

                }).on('error', function(err) {
                    // boo, we hit an error!
                });
            }



            $scope.prod_list_fixed = Productos.list;

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

                $scope.prod_list.some(function(obj, i) {
                    return obj.prod === prod.prod ? index = i : false;
                });

                console.log(index);
                $scope.prod_list.splice(index, 1);

            };

            // add user
            $scope.showNewProdForm = false;
            $scope.addProd = function() {
                $scope.newProdList = []
                $scope.showNewProdForm = true;
                $scope.inserted = {
                    id: $scope.prod_list.length + 1,
                    tipoid: null,
                    tipo: null,
                    prod: "",
                    "peso": 0,
                    "densidad": 0,
                    "diametro": 0,
                    "largo": 0
                };
                $scope.newProdList.push($scope.inserted);
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
            $scope.updateNewProdName = function(obj) {
                $scope.newProdName = obj;
                console.log("newprodname " + obj)
            }
            $scope.updateTipoProd = function(obj) {
                $scope.newProdTipo = obj.tipo;
                $scope.newProdTipoID = obj.id
                console.log("tipo " + obj.tipo + " tipoid " + obj.id)
            }
            $scope.saveProd = function(prod, idx) {

                var newProd = {

                    "id": prod.id,
                    "tipoid": $scope.newProdTipoID,
                    "tipo": $scope.newProdTipo,
                    "prod": prod.prod,
                    "peso": 0,
                    "densidad": 0,
                    "diametro": 0,
                    "largo": 0

                }
                console.log(prod)
                console.log(newProd)
                $scope.prod_list.push(newProd);
                $scope.showNewProdForm = false;
            }

            $scope.updateProductos = function() {
                $scope.show();
                var id = "productos"
                localprodsDB.get(id).then(function(doc) {
                    return localprodsDB.put({
                        _id: id,
                        _rev: doc._rev,
                        prods: $scope.prod_list,

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