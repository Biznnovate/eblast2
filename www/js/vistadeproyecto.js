angular.module('app.vistaDeProyecto', [])
    .controller('vistaDeProyectoCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', '$timeout', '$ionicLoading', '$ionicPopup', '$window',
        // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, pouchDB, $timeout, $ionicLoading, $ionicPopup, $window) {
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
                'usr': ''
            }

            $scope.projparam = {
                'id': $stateParams.id,
                'status': $stateParams.status,
                'proj': $stateParams.proj,
                'usr': $stateParams.usr
            }
            $scope.projID = $scope.projparam.proj || '';
            $scope.showAll = false;

            $scope.usr = $stateParams.usr;
            console.log($scope.usr.t)
            $scope.enableAdminButton = false;
            if ($scope.usr.t == 'a') {

                $scope.enableAdminButton = true;
            } else {
                $scope.enableAdminButton = false;
            }
            // $scope.show();
            //Declara y Sincroniza base de datos de Tipo
            $scope.projInfoT5 = [];
            let localprojDB = new pouchDB('projects');
            let remoteprojDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
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
                    console.log('loading these top 5 ' + result.docs);
                });
            });
            console.log('loaded top 5')
            $scope.displayIntroFunc = function() {

                var projlength = $scope.projInfoT5.length;
                console.log('Hay ' + projlength + ' proyectos cargados')
                if (projlength > 0) {
                    $scope.displayIntroMessage = 'no';
                    $scope.introMessage = '';
                    console.log("displayintro " + $scope.displayIntroMessage)
                } else {

                    $scope.introMessage = "Aplicación sin sincronizar, por favor oprimir el Boton de Sincronizar" + $scope.projInfoT5
                    $scope.displayIntroMessage = 'yes';
                    console.log("displayintro " + $scope.displayIntroMessage)
                }
            }


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
                        console.log('loading these top 5 ' + result.docs);
                        $scope.displayIntroFunc();
                    });
                });
                console.log('loaded top 5')

                $scope.hide();

            }
            $scope.displayIntroMessage = 'no';
            $scope.loadT5Proj();
            $timeout(function() {
                console.log('timedout')
                $scope.loadT5Proj();
                $scope.displayIntroFunc();
                //any code in here will automatically have an apply run afterwards
            });
            // A confirm dialog
            $scope.showConfirm = function(proj) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Borrar Proyecto',
                    template: 'Seguro que desea borrar el proyecto. Una vez borrado no podrá recuperarse'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        console.log('Seguro');
                        $scope.deleteProj(proj);
                    } else {
                        console.log('No estoy seguro');

                    }
                });
            };
            $scope.syncFunc = function() {
                    $scope.show();
                    let localprojDB = new pouchDB('projects');
                    let remoteprojDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-proj', { skipSetup: true });
                    remoteprojDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                        console.log("I'm Batman.");
                        return remoteprojDB.getSession();
                    });
                    let localprodsDB = new pouchDB('prods');
                    let remoteprodsDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-products', { skipSetup: true });
                    remoteprodsDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                        console.log("I'm Batman.");
                        return remoteprodsDB.getSession();

                    })
                    let localAdminDB = new pouchDB('admin');
                    let remoteAdminDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-admin', { skipSetup: true });
                    remoteAdminDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
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


                    $scope.loadT5Proj();
                    $scope.hide();

                }
                //$scope.syncFunc();


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
            $scope.projOpened = true;
            $scope.abrirProj = function() {
                $scope.show();
                window.location.reload()
                $scope.hide();
            }
            $scope.selectProjFunc = function() {

                    $scope.selectedProj = '';
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
                            $scope.projOpened = false;
                        }).catch(function(err) {
                            console.log(err);
                        });
                    } else {
                        $scope.selectedProj = ''
                        console.log('no se ha seleccionado un proyecto')
                        $scope.projOpened = true;
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
                $state.go('menu.parametrosVoladura1', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoCapt = function() {
                $state.go('menu.editarVoladuraMapa', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoMapa = function() {
                $state.go('menu.mapaVoladura1', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoProductos = function() {
                $state.go('menu.generarReporteProductos', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoMuestra = function() {
                $state.go('menu.tomaDeMuestra', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoSismo = function() {
                $state.go('menu.subirSismo', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoDataGral = function() {
                $state.go('menu.generarReporteDatosGenerales', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoCarga = function() {
                $state.go('menu.reporteCarga1', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoReporte = function() {
                $state.go('menu.vistaDeReporte', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoAdmin = function() {
                $state.go('menu.admincons', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoCamion = function() {
                $state.go('menu.dataCamion', { 'proj': $scope.projID, 'usr': $scope.usr });
            }
            $scope.gotoReporteCamion = function() {
                $state.go('menu.reporteCamion', { 'proj': $scope.projID, 'usr': $scope.usr });
            }


        }
    ])