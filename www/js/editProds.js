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
            let remoteprodsDB = new PouchDB('https://biznnovate.cloudant.com/eblast-products', { skipSetup: true });
            remoteprodsDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
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
            $scope.removeProd = function(index) {
                $scope.users.splice(index, 1);
            };

            // add user
            $scope.addProd = function() {
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
                $scope.prod_list.push($scope.inserted);
            };


            $scope.showTipo = function(obj) {
                var selected = [];
                if (obj.tipo) {
                    selected = $filter('filter')($scope.tiposProd, { value: obj.tipo });
                }
                return selected.length ? selected[0].tipo : 'Not set';
            };
            $scope.showTipoID = function(obj) {
                var selected = [];
                if (obj.tipo) {
                    selected = $filter('filter')($scope.tiposProd, { value: obj.tipo });
                }
                return selected.length ? selected[0].id : 'Not set';
            };

        }
    ])