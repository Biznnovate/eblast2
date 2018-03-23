angular.module('app.vistaDeProyecto', [])
    .controller('vistaDeProyectoCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', '$timeout', '$ionicLoading',
        // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, pouchDB, $timeout, $ionicLoading) {
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
            $scope.projID = $scope.projparam.proj || '';
            $scope.showAll = false;
            // $scope.show();
            //Declara y Sincroniza base de datos de Tipo

            let localprojDB = new pouchDB('projects');
            let remoteprojDB = new PouchDB('https://biznnovate.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprojDB.getSession();
            });
            var currDate = new Date().toISOString();
            localprojDB.createIndex({
                index: {
                    fields: ['date', 'proj', '_id'],
                    ddoc: "last-5-Index"
                }
            }).then(function() {
                return localprojDB.find({
                    selector: {
                        date: { $lt: currDate }

                    },

                    use_index: 'last-5-Index',
                    sort: [{ 'date': 'desc' }],
                    limit: 5
                }).then(function(result) {
                    $scope.projInfoT5 = result.docs;
                    console.log(result.docs);
                });
            });
            console.log('loaded top 5')
            $scope.loadT5Proj = function() {
                $scope.show();
                var currDate = new Date().toISOString();
                localprojDB.createIndex({
                    index: {
                        fields: ['date', 'proj', '_id'],
                        ddoc: "last-5-Index"
                    }
                }).then(function() {
                    return localprojDB.find({
                        selector: {
                            date: { $lt: currDate }

                        },

                        use_index: 'last-5-Index',
                        sort: [{ 'date': 'desc' }],
                        limit: 5
                    }).then(function(result) {
                        $scope.projInfoT5 = result.docs;
                        console.log(result.docs);
                    });
                });
                console.log('loaded top 5')
                $scope.hide();
            }

            $scope.loadT5Proj();


            $scope.syncFunc = function() {
                    $scope.show();
                    let localprojDB = new pouchDB('projects');
                    let remoteprojDB = new PouchDB('https://biznnovate.cloudant.com/eblast-proj', { skipSetup: true });
                    remoteprojDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                        console.log("I'm Batman.");
                        return remoteprojDB.getSession();
                    });
                    let localprodsDB = new pouchDB('prods');
                    let remoteprodsDB = new PouchDB('https://biznnovate.cloudant.com/eblast-products', { skipSetup: true });
                    remoteprodsDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                        console.log("I'm Batman.");
                        return remoteprodsDB.getSession();

                    })
                    let localAdminDB = new pouchDB('admin');
                    let remoteAdminDB = new PouchDB('https://biznnovate.cloudant.com/eblast-admin', { skipSetup: true });
                    remoteAdminDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                        console.log("I'm Batman.");
                        return remoteAdminDB.getSession();
                    });

                    localprojDB.sync(remoteprojDB).on('complete', function() {
                        //  yay, we're in sync!
                        console.log('pretty sync')
                    }).on('error', function(err) {
                        // boo, we hit an error!
                        console.log(err)
                    });
                    localprodsDB.sync(remoteprodsDB).on('complete', function() {
                        // yay, we're in sync!

                    }).on('error', function(err) {
                        // boo, we hit an error!
                    });
                    localAdminDB.sync(remoteAdminDB).on('complete', function() {
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
                        // $scope.selectedproj = $scope.projInfo[0];
                        console.log('projloaded')
                    }).catch(function(err) {
                        // console.log(err);
                    });



                    $scope.hide();

                }
                //   $scope.syncFunc();

            $scope.loadProjDBFunc = function() {
                    $scope.show();
                    localprojDB.allDocs({
                        include_docs: true,
                        attachments: true
                    }).then(function(result) {
                        // handle result
                        $scope.projInfo = result;
                        //   $scope.selectedproj = $scope.projInfo[0];
                        console.log('projloaded')

                    }).catch(function(err) {
                        console.log(err);
                    });
                    $scope.hide();
                }
                // $scope.loadProjDBFunc();
                //$scope.hide();

            // $scope.projID = $scope.projparam.proj || '';
            $scope.selectProjFunc = function() {


                    if ($scope.projID != '') {
                        var proj = $scope.projID;
                        localprojDB.get(proj).then(function(doc) {
                            $scope.selectedProj = doc;
                            console.log(doc)
                                // $scope.tipobarr = doc.tipos;
                                //   $scope.Barrenos = doc.barrenos;
                                // $scope.muestraData = doc.muestras;
                                // $scope.Muesrow = doc.muestras;
                                // console.log(doc.tipos)
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
                // $scope.selectProjFunc();
            $scope.selectProj = function(obj) {
                console.log(obj)


                $scope.selectedproj_u = obj;
                $scope.projID = obj.doc._id;
                $scope.projNam = obj.doc.proj;
                $scope.selectProjFunc();
                console.log('Tipo seleccionado para editar: ' + obj.doc._id)


            }

            $scope.selectProjT5 = function(obj) {
                console.log(obj)


                $scope.selectedproj_u = obj;
                $scope.projID = obj._id;
                $scope.projNam = obj.proj;
                $scope.selectProjFunc();
                console.log('Tipo seleccionado para editar: ' + obj._id)


            }
            $scope.selectProjParam = function() {
                $scope.show();
                if ($scope.projID != '') {

                    var id = $scope.projID;
                    let localprojDB = new pouchDB('projects');
                    localprojDB.get(id).then(function(doc) {

                        $scope.projNam = doc.proj

                        console.log('proj loaded' + doc.proj)


                    }).catch(function(err) {
                        console.log(err);
                    });
                    var data = {
                        _id: id,
                        proj: $scope.projNam

                    }
                    console.log('selected proj is ' + data)
                    $scope.selectProjT5(data)

                } else {
                    console.log('no project selected')
                }
                $scope.hide();
                console.log('finished selectprojparamfunc')
            }
            $scope.selectProjParam();

            $scope.changeProjID = function() {
                $scope.projID = '';
                $scope.projNam = '';
            }
            $scope.selectProjList = function(obj, idx) {


                $scope.projIndex = idx;
                $scope.projID = obj._id;

                console.log('Tipo seleccionado para editar: ' + obj._id + ' index ' + idx)


            }
            $scope.deleteProj = function(obj) {
                console.log('se esta borrando el proyecto ' + obj)
                $scope.show();
                //$scope.selectedproj_u = obj;
                var id = obj.doc._id;
                //$scope.projNam = obj.doc.proj;
                localprojDB.get(id).then(function(doc) {
                    return localprojDB.remove(doc);
                });

                $scope.loadProjDBFunc();
                //$scope.projInfo.splice(index, 1);

                console.log('Proyecto Borrado');
                $scope.hide();

            }

            $scope.gotoParam = function() {
                $state.go('menu.parametrosVoladura1', { 'proj': $scope.projID });
            }
            $scope.gotoCapt = function() {
                $state.go('menu.editarVoladuraMapa', { 'proj': $scope.projID });
            }
            $scope.gotoMapa = function() {
                $state.go('menu.mapaVoladura1', { 'proj': $scope.projID });
            }
            $scope.gotoProductos = function() {
                $state.go('menu.generarReporteProductos', { 'proj': $scope.projID });
            }
            $scope.gotoMuestra = function() {
                $state.go('menu.tomaDeMuestra', { 'proj': $scope.projID });
            }
            $scope.gotoSismo = function() {
                $state.go('menu.subirSismo', { 'proj': $scope.projID });
            }
            $scope.gotoDataGral = function() {
                $state.go('menu.generarReporteDatosGenerales', { 'proj': $scope.projID });
            }
            $scope.gotoCarga = function() {
                $state.go('menu.reporteCarga1', { 'proj': $scope.projID });
            }
            $scope.gotoReporte = function() {
                $state.go('menu.vistaDeReporte', { 'proj': $scope.projID });
            }
            $scope.gotoAdmin = function() {
                $state.go('menu.admincons', { 'proj': $scope.projID });
            }


        }
    ])