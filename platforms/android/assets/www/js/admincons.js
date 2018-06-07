angular.module('app.admincons', [])
    .controller('adminconsCtrl', ['$scope', '$stateParams', '$state', 'Productos', '$filter', '$window', '$timeout', '$ionicLoading', 'pouchDB', 'passInfo', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, Productos, $filter, $window, $timeout, $ionicLoading, pouchDB, $routeParams, passInfo) {
            //option.name for option in data.availableOptions track by option.id

            // Show loader from service
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

            $scope.projparam = {
                'id': $stateParams.id,
                'status': $stateParams.status,
                'proj': $stateParams.proj,
            }
            $scope.showAll = false;
            //Declara y Sincroniza base de datos de Tipo
            let localprojDB = new pouchDB('projects');
            let remoteprojDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprojDB.getSession();
            });





            $scope.syncFunc = function() {
                $scope.show();
                localprojDB.sync(remoteprojDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });
                $scope.hide();

            }
            $scope.syncFunc();

            $scope.loadProjDBFunc = function() {
                $scope.show();
                localprojDB.allDocs({
                    include_docs: true,
                    attachments: true
                }).then(function(result) {
                    // handle result
                    $scope.projInfo = result;


                }).catch(function(err) {
                    console.log(err);
                });
                $scope.hide();
            }
            $scope.loadProjDBFunc();

            $scope.projID = $scope.projparam.proj || '';
            $scope.selectProjFunc = function() {


                if ($scope.projID != '') {
                    var proj = $scope.projID;
                    localprojDB.get(proj).then(function(doc) {
                        $scope.selectedProj = doc;
                        console.log(doc)
                        $scope.tipobarr = doc.tipos;
                        $scope.Barrenos = doc.barrenos;
                        $scope.muestraData = doc.muestras;
                        $scope.Muesrow = doc.muestras;
                        console.log(doc.tipos)
                        console.log('se encontro el proyecto:' + proj)

                    }).catch(function(err) {
                        console.log(err);
                    });
                } else {
                    $scope.selectedProj = ''
                    console.log('no se ha seleccionado un proyecto')
                };
                $showAll = false;
                console.log($scope.showAll)
            }
            $scope.selectProjFunc();
            $scope.selectProj = function(obj) {
                console.log(obj)
                $scope.selectedproj_u = obj;
                $scope.projID = obj.doc._id;
                $scope.projNam = obj.doc.proj;
                $scope.selectProjFunc();
                console.log('Tipo seleccionado para editar: ' + obj.doc._id)


            }
            $scope.changeProjID = function() {
                $scope.projID = '';
                $scope.projNam = '';
            }
            $scope.selectProjList = function(obj, idx) {


                $scope.projIndex = idx;
                $scope.projID = obj._id;

                console.log('Tipo seleccionado para editar: ' + obj._id + ' index ' + idx)


            }


            $scope.gotoProds = function() {
                $state.go('menu.editProds', { 'proj': $scope.projID });
            }
            $scope.gotoTipos = function() {
                $state.go('menu.adminCrearTipos', { 'proj': $scope.projID });
            }
            $scope.gotoMapa = function() {
                $state.go('menu.mapaVoladura1', { 'proj': $scope.projID });
            }
            $scope.gotoExplo = function() {
                $state.go('menu.adminExplo', { 'proj': $scope.projID });
            }
            $scope.gotoCamion = function() {
                $state.go('menu.adminCamion', { 'proj': $scope.projID });
            }
            $scope.gotoConductor = function() {
                $state.go('menu.adminConductor', { 'proj': $scope.projID });
            }
            $scope.gotoUsrs = function() {
                $state.go('menu.adminUser', { 'proj': $scope.projID });
            }
        }
    ])