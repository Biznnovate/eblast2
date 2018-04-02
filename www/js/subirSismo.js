angular.module('app.subirSismo', [])
    .controller('subirSismoCtrl', ['$scope', '$stateParams', '$window', '$state', '$filter', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', 'Page', '$ionicScrollDelegate', '$ionicPopup', 'Productos', 'Upload', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $window, $state, $filter, pouchDB, Excel, $timeout, $ionicLoading, Page, $ionicScrollDelegate, $ionicPopup, Productos, Upload) {
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

            $scope.projID = $scope.projparam.id;
            //Declara y Sincroniza base de datos de Tipo
            let localprojDB = new pouchDB('projects');
            let remoteprojDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprojDB.getSession();
            }).then('complete', function() {

            })

            //Declara y Sincroniza base de datos de admin


            let localAdminDB = new pouchDB('admin');
            let remoteAdminDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-admin', { skipSetup: true });
            remoteAdminDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteAdminDB.getSession();
            });
            //Declara y Sincroniza base de datos de Tipo

            $scope.sync = function() {
                $scope.show();
                localprojDB.sync(remoteprojDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });


                $scope.hide();
            }
            $scope.$watch('files', function() {
                $scope.upload($scope.files);
            });
            $scope.$watch('file', function() {
                if ($scope.file != null) {
                    $scope.files = [$scope.file];
                }
            });
            $scope.log = '';
            $scope.pdfUpload = function(files) {
                db.put({
                    _id: 'mydoc',
                    _attachments: {
                        'myattachment.txt': {
                            content_type: 'text/plain',
                            data: $scope.files
                        }
                    }
                });
            }
            $scope.createSis = function() {
                console.log("create sis inicio")
                var id = $scope.projID;
                localprojDB.put({
                    _id: id,
                    _attachments: {
                        'test.pdf': {
                            content_type: 'application/pdf',
                            data: $scope.files
                        }
                    }
                });
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
                        sismo: 'files',
                    });
                }).then(function() {
                    return localprojDB.get(id);
                    // handle response

                }).catch(function(err) {
                    console.log(err);
                });
                console.log("createSis Finished")
            }
            $scope.upload = function(files) {
                var userAustin = 'Austin';
                $scope.fileExample = '';
                //alert(files.length)
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];

                        if (!file.$error) {

                            console.log("no error file createSis Executed")
                            $scope.fileExample = file;
                        }
                    }
                }
            };
            $scope.upload1 = function(files) {

                var userAustin = 'Austin';
                if (files && files.length) {

                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];

                        if (!file.$error) {
                            Upload.upload({
                                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                                data: {
                                    username: userAustin,
                                    file: file
                                }
                            }).then(function(resp) {
                                $timeout(function() {
                                    $scope.log = 'file: ' +
                                        resp.config.data.file.name +
                                        ', Response: ' + JSON.stringify(resp.data) +
                                        '\n' + $scope.log;
                                });
                            }, null, function(evt) {
                                var progressPercentage = parseInt(100.0 *
                                    evt.loaded / evt.total);
                                $scope.log = 'progress: ' + progressPercentage +
                                    '% ' + evt.config.data.file.name + '\n' +
                                    $scope.log;
                            });
                        }
                    }
                }
            };
            $scope.loadproj = function() {
                localprojDB.allDocs({
                    include_docs: true,
                    attachments: true
                }).then(function(result) {
                    // handle result
                    $scope.projInfo = result;


                }).catch(function(err) {
                    console.log(err);
                });
                $scope.changeProjID = function() {
                    $scope.projID = '';
                }
                $scope.projID = $scope.projparam.proj || '';
                var proj = $scope.projparam.proj;


                localprojDB.get(proj).then(function(doc) {

                    $scope.proj = doc;
                    console.log(doc)
                    $scope.tipos = doc.tipos;
                    $scope.projNam = doc.proj;
                    console.log(doc.tipos)
                        // $scope.dataChartBarrs();

                }).catch(function(err) {
                    console.log(err);
                    // alert('no');
                    $scope.showForm2 = true;
                    $scope.projExists = false;

                });
                var proj = $scope.projID;
                localprojDB.get(proj).then(function(doc) {
                    $scope.show();

                    $scope.proj = doc;
                    console.log(doc)

                    $scope.projSis = [];

                    $scope.projNam = doc.proj;

                    $scope.projSis = doc.sismo || [];
                    console.log(doc.sismo)
                    $scope.hide();
                }).catch(function(err) {
                    console.log(err);

                });
            }
            $scope.loadproj();


            $scope.createSis1 = function() {
                console.log
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
                        sismo: $scope.files,
                    });
                }).then(function() {
                    return localprojDB.get(id);
                    // handle response

                }).catch(function(err) {
                    console.log(err);
                });
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