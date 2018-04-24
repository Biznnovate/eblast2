angular.module('app.dataCamion', [])
    .controller('dataCamionCtrl', ['$scope', '$stateParams', '$window', '$state', '$filter', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', 'Page', '$ionicScrollDelegate', '$ionicPopup', 'Productos', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
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
            $scope.projID = $scope.projparam.proj;
            //Declara y Sincroniza base de datos de Tipo


            let localAdminDB = new pouchDB('admin');
            let remoteAdminDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-admin', { skipSetup: true });
            remoteAdminDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteAdminDB.getSession();
            });


            //Declara y Sincroniza base de datos de Tipo
            let localprojDB = new pouchDB('projects');
            let remoteprojDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprojDB.getSession();
            }).then('complete', function() {

            })
            $scope.loadproj = function() {


                var proj = $scope.projID;
                localprojDB.get(proj).then(function(doc) {
                    $scope.show();

                    $scope.proj = doc;
                    $scope.projName = doc.proj

                    console.log(doc)
                    console.log('projname ' + $scope.projName)

                    $scope.vnumminera = $scope.projName;

                    //$scope.projNam = doc.proj;

                    $scope.dataCamion = doc.datacamion || [];

                    $scope.hide();
                }).catch(function(err) {
                    console.log(err);

                });

            }

            $scope.loadproj();
            $scope.vnumminera = $scope.projName;
            $scope.sync = function() {
                    $scope.show();
                    localAdminDB.sync(remoteAdminDB).on('complete', function() {
                        // yay, we're in sync!
                    }).on('error', function(err) {
                        // boo, we hit an error!
                    });
                    localprojDB.sync(remoteprojDB).on('complete', function() {
                        // yay, we're in sync!
                    }).on('error', function(err) {
                        // boo, we hit an error!
                    });
                    $scope.hide();
                }
                //$scope.camion = [];
            $scope.loadprojcamion = function() {
                $scope.show();

                var id = 'camion'

                localAdminDB.get(id).then(function(doc) {

                    $scope.camiones = doc.camion || [];





                    console.log('data de camion' + doc.camion)


                    //   $scope.countcamions = doc.camion.length;

                }).catch(function(err) {
                    console.log(err);
                });

                $scope.hide();
            }
            $scope.loadprojconductor = function() {
                $scope.show();
                var id = 'conductor'
                localAdminDB.get(id).then(function(doc) {
                    $scope.conductores = doc.conductor || [];
                    // console.log('projtiposthing' + doc.camion)
                    //$scope.countcamions = doc.camion.length;

                }).catch(function(err) {
                    console.log(err);
                });
                $scope.hide();
            }
            $scope.loadprojdatacamion = function() {
                $scope.show();
                var id = 'datacamion'
                localAdminDB.get(id).then(function(doc) {
                    $scope.dataCamion1 = doc.datacamion || [];
                    console.log('data de camion' + doc.datacamion)
                        // $scope.countcamions = doc.camion.length;

                }).catch(function(err) {
                    console.log(err);
                });
                $scope.hide();
            }

            $scope.loadprojcamion();
            $scope.loadprojconductor();
            $scope.loadprojdatacamion();

            $scope.updateCamion = function(obj) {
                $scope.selectedCamion_u = obj;

            }
            $scope.updateConductor = function(obj) {
                $scope.selectedConductor_u = obj;

            }
            $scope.updateFecha = function(obj) {
                $scope.fecha_u = obj;

            }
            $scope.updateDocumento = function(obj) {
                $scope.documento_u = obj;

            }
            $scope.updateVnumaustin = function(obj) {
                $scope.vnumaustin_u = obj;

            }
            $scope.updateVnumminera = function(obj) {
                $scope.vnumminera_u = obj;

            }
            $scope.updateTemp = function(obj) {
                $scope.temp_u = obj;

            }
            $scope.updateNitratoyara = function(obj) {
                $scope.nitratoyara_u = obj;

            }
            $scope.updateNitratoprilex = function(obj) {
                $scope.nitratoprilex_u = obj;

            }
            $scope.updateR2 = function(obj) {
                $scope.r2_u = obj;

            }
            $scope.updateR1 = function(obj) {
                $scope.r1_u = obj;

            }
            $scope.updateHgassing = function(obj) {
                $scope.hgassing_u = obj;

            }
            $scope.updateHblendyara = function(obj) {
                $scope.hblendyara_u = obj;

            }
            $scope.updateHblendenaex = function(obj) {
                $scope.hblendenaex_u = obj;

            }


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

                $scope.dataCamion.some(function(obj, i) {
                    return obj.name === prod.name ? index = i : false;
                });

                console.log(index);
                $scope.dataCamion.splice(index, 1);

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
            $scope.saveCamionData = function() {
                var data = {

                    camion: $scope.selectedCamion_u,
                    conductor: $scope.selectedConductor_u,
                    fecha: $scope.fecha_u,
                    doc: $scope.documento_u,
                    vnumaustin: $scope.vnumaustin_u,
                    vnumminera: $scope.vnumminera_u,
                    temp: $scope.temp_u,
                    nitratoyara: $scope.nitratoyara_u,
                    nitratoprilex: $scope.nitratoprilex_u,
                    r2: $scope.r2_u,
                    r1: $scope.r1_u,
                    hgassing: $scope.hgassing_u,
                    hblendyara: $scope.hblendyara_u,
                    hblendenaex: $scope.hblendenaex_u,

                }
                $scope.dataCamion.push(data);
            }

            $scope.saveProd = function(prod, idx) {

                var newProd = {

                    "name": $scope.newcamionName,
                    "lic": $scope.newcamionLic,
                    "cod": $scope.newcamionCod,

                }
                console.log(prod)
                console.log(newProd)
                $scope.camion.push(newProd);
                $scope.showNewProdForm = false;
            }

            $scope.uploadCamionData = function() {
                $scope.show();
                var id = $scope.projID;
                localprojDB.get(id).then(function(doc) {


                    return localprojDB.put({
                        _id: id,
                        _rev: doc._rev,
                        proj: doc.proj,
                        date: doc.date,
                        barrenos: doc.barrenos,
                        tipos: doc.tipos,
                        productos: doc.productos,
                        muestras: doc.muestras,
                        datagral: doc.datagral,
                        sismo: doc.sismo,
                        datacamion: $scope.dataCamion,
                    }).catch(function(err) {
                        console.log(err);
                    });
                });

                $scope.hide();
                alert("Se ha actualizado la Información");
            }

        }

    ])