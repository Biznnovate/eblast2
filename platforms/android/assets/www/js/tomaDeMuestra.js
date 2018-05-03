angular.module('app.tomaDeMuestra', [])
    .controller('tomaDeMuestraCtrl', ['$scope', '$stateParams', '$state', '$window', 'pouchDB', '$timeout', '$ionicLoading',
        // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, $window, pouchDB, $timeout, $ionicLoading) {
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
            });

            localprojDB.sync(remoteprojDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
            localprojDB.allDocs({
                include_docs: true,
                attachments: true
            }).then(function(result) {
                // handle result
                $scope.projInfo = result;


            }).catch(function(err) {
                console.log(err);
            });

            $scope.projID = $scope.projparam.proj || '';
            $scope.selectProjFunc = function() {
                if ($scope.projID != '') {
                    var proj = $scope.projID;
                    localprojDB.get(proj).then(function(doc) {
                        $scope.selectedProj = doc;
                        console.log(doc)
                        $scope.tipobarr = doc.tipos;
                        $scope.Barrenos = doc.barrenos;
                        $scope.muestraData = doc.muestras || [];
                        $scope.projName = doc.proj

                        console.log(doc.tipos)
                        console.log('se encontro el proyecto:' + proj)
                    }).catch(function(err) {
                        console.log(err);
                    });
                } else {
                    $scope.selectedProj = ''
                    console.log('no se ha seleccionado un proyecto')
                };
            }
            $scope.selectProjFunc();
            $scope.selectProj = function(obj) {
                console.log(obj)
                $scope.selectedproj_u = obj;
                $scope.projID = obj.doc._id;
                $scope.selectProjFunc();


            }
            $scope.changeProjID = function() {
                $scope.projID = '';
            }
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
            $scope.loadprojcamion();





            $scope.updateSelectedBarr = function(obj) {
                console.log(obj)

                // console.log($scope.barr_u)
                // console.log($scope.selectedBarreno)
                $scope.barr_u = obj.barr;
                console.log($scope.barr_u)


            };

            $scope.updateCamion = function(obj) {
                console.log(obj)
                console.log($scope.camion)
                $scope.camion_u = obj;
            };
            $scope.updateHora = function(obj) {
                console.log(obj)
                console.log($scope.hora)
                $scope.hora_u = obj;
            };
            $scope.updateR1 = function(obj) {
                console.log(obj)
                console.log($scope.r1)
                $scope.r1_u = obj;
            };
            $scope.updateR2 = function(obj) {
                console.log(obj)
                console.log($scope.r2)
                $scope.r2_u = obj;
            };
            $scope.updateRpm = function(obj) {
                console.log(obj)
                console.log($scope.rpm)
                $scope.rpm_u = obj;
            };
            $scope.updateTemp = function(obj) {
                console.log(obj)
                console.log($scope.temp)
                $scope.temp_u = obj;
            };
            $scope.updateDens0 = function(obj) {
                console.log(obj)
                console.log($scope.dens0)
                $scope.dens0_u = obj;

            };
            $scope.updateDens5 = function(obj) {
                console.log(obj)
                console.log($scope.dens5)
                $scope.dens5_u = obj;


            };
            $scope.updateDens10 = function(obj) {
                console.log(obj)
                console.log($scope.dens10)
                $scope.dens10_u = obj;

            };
            $scope.updateDens15 = function(obj) {
                console.log(obj)
                console.log($scope.dens15)
                $scope.dens15_u = obj;

            };
            $scope.updateDens20 = function(obj) {
                console.log(obj)
                console.log($scope.dens20)
                $scope.dens20_u = obj;

            };
            $scope.updateDens25 = function(obj) {
                console.log(obj)
                console.log($scope.dens25)
                $scope.dens25_u = obj;

            };
            $scope.updateDens30 = function(obj) {
                console.log(obj)
                console.log($scope.dens30)
                $scope.dens30_u = obj;


            };
            $scope.updateDens35 = function(obj) {
                console.log(obj)
                console.log($scope.dens35)
                $scope.dens35_u = obj;

            };
            $scope.updateDens40 = function(obj) {
                console.log(obj)
                console.log($scope.dens40)
                $scope.dens40_u = obj;

            };
            $scope.updateDens45 = function(obj) {
                console.log(obj)
                console.log($scope.dens45)
                $scope.dens45_u = obj;

            };
            $scope.updateDens50 = function(obj) {
                console.log(obj)
                console.log($scope.dens0)
                $scope.dens50_u = obj;

            };
            $scope.updateDens55 = function(obj) {
                console.log(obj)
                console.log($scope.dens55)
                $scope.dens55_u = obj;

            };
            $scope.updateDens60 = function(obj) {
                console.log(obj)
                console.log($scope.dens60)
                $scope.dens60_u = obj;

            };
            $scope.updateComent = function(obj) {
                console.log(obj)
                console.log($scope.coment)
                $scope.coment_u = obj;
            };








            $scope.viewGraph = function() {
                // $scope.labels = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] ; 
                //$scope.series = ['Tiempo'];


                $scope.densidades = [

                    // [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],

                    { 'dens': $scope.dens0_u, 'seg': 0 },
                    { 'dens': $scope.dens5_u, 'seg': 5 },
                    { 'dens': $scope.dens10_u, 'seg': 10 },
                    { 'dens': $scope.dens15_u, 'seg': 15 },
                    { 'dens': $scope.dens20_u, 'seg': 20 },
                    { 'dens': $scope.dens25_u, 'seg': 25 },
                    { 'dens': $scope.dens30_u, 'seg': 30 },
                    { 'dens': $scope.dens35_u, 'seg': 35 },
                    { 'dens': $scope.dens40_u, 'seg': 40 },
                    { 'dens': $scope.dens45_u, 'seg': 45 },
                    { 'dens': $scope.dens50_u, 'seg': 50 },
                    { 'dens': $scope.dens55_u, 'seg': 55 },
                    { 'dens': $scope.dens60_u, 'seg': 60 },



                ]
                $scope.densidades_full = [];
                $scope.tiemposdens = [];
                angular.forEach($scope.densidades, function(value, key) {
                    // if(value.dens > 0)
                    var valdens = value.dens > 0 ? value.dens : null;
                    var valseg = value.dens > 0 ? value.seg : null;
                    $scope.densidades_full.push(valdens);
                    $scope.tiemposdens.push(valseg);

                });
                $scope.timeData = $scope.densidades_full;
                $scope.labels = $scope.tiemposdens;
                $scope.showGraph = true;
                console.log($scope.densidades_full)
                console.log($scope.tiemposdens)

            }


            $scope.reloadPage = function() {
                $state.go('menu.tomaDeMuestra', { 'proj': $scope.projID });

            }
            $scope.showGraph = false;

            $scope.newMuestra = function() {
                var data = {
                    _id: new Date().toISOString(),
                    barr: $scope.barr_u,
                    camion: $scope.camion_u,
                    hora: $scope.hora_u,
                    r1: $scope.r1_u,
                    r2: $scope.r2_u,
                    rpm: $scope.rpm_u,
                    temp: $scope.temp_u,
                    dens0: $scope.dens0_u,
                    dens5: $scope.dens5_u,
                    dens10: $scope.dens10_u,
                    dens15: $scope.dens15_u,
                    dens20: $scope.dens20_u,
                    dens25: $scope.dens25_u,
                    dens30: $scope.dens30_u,
                    dens35: $scope.dens35_u,
                    dens40: $scope.dens40_u,
                    dens45: $scope.dens45_u,
                    dens50: $scope.dens50_u,
                    dens55: $scope.dens55_u,
                    dens60: $scope.dens60_u,
                    coment: $scope.coment_u,
                }

                $scope.muestraData.push(data);
                $scope.insertMuestra();
                $scope.reloadPage()




            };

            $scope.insertMuestra = function() {
                var id = $scope.projID;
                localprojDB.get(id).then(function(doc) {

                    return localprojDB.put({
                        _id: id,
                        _rev: doc._rev,
                        proj: doc.proj,
                        date: doc.date,
                        barrenos: doc.barrenos,
                        tipos: doc.tipos,
                        muestras: $scope.muestraData,
                        productos: doc.productos,

                    });
                }).then(function() {
                    return localprojDB.get(id);
                    // handle response

                }).catch(function(err) {
                    console.log(err);
                });



                localprojDB.sync(remoteprojDB).on('complete', function() {
                    // yay, we're in sync!

                }).on('error', function(err) {
                    // boo, we hit an error!
                });
            }



            $scope.newMuestra1 = function() {
                localMDB.put({

                    _id: new Date().toISOString(),
                    barr: $scope.barr_u,
                    camion: $scope.camion_u,
                    hora: $scope.hora_u,
                    r1: $scope.r1_u,
                    r2: $scope.r2_u,
                    rpm: $scope.rpm_u,
                    temp: $scope.temp_u,
                    dens0: $scope.dens0_u,
                    dens5: $scope.dens5_u,
                    dens10: $scope.dens10_u,
                    dens15: $scope.dens15_u,
                    dens20: $scope.dens20_u,
                    dens25: $scope.dens25_u,
                    dens30: $scope.dens30_u,
                    dens35: $scope.dens35_u,
                    dens40: $scope.dens40_u,
                    dens45: $scope.dens45_u,
                    dens50: $scope.dens50_u,
                    dens55: $scope.dens55_u,
                    dens60: $scope.dens60_u,
                    coment: $scope.coment_u,

                }).then(function(response) {
                    // handle response



                });



                localMDB.sync(remoteMDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });

                $scope.message = "Su Muestra se ha grabada con Exito!";


            }
            $scope.gotoPreview = function() {
                $state.go('menu.vistaPreviaMuestra', { 'proj': $scope.projID });
            }
            $scope.gotoMenu = function() {
                $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
            }

        }
    ])