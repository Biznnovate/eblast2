angular.module('app.vistaPreviaMuestra', [])
    .controller('vistaPreviaMuestraCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', 'Excel', '$timeout', '$window', '$ionicLoading',
        // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, pouchDB, Excel, $timeout, $window, $ionicLoading) {

            $scope.projparam = {
                'id': $stateParams.id,
                'status': $stateParams.status,
                'proj': $stateParams.proj,
            }

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
            $scope.loadDensData = function(obj) {
                console.log('start loaddensdata' + obj)

                $scope.muestrasToPrint = [];
                angular.forEach(obj, function(val1) {
                    console.log('for each muestradata' + val1)
                    var densdata = val1.densval
                    $scope.densidadesData = [];
                    var densvaldata = {
                        dens0: 0,
                        dens5: 0,
                        dens10: 0,
                        dens15: 0,
                        dens20: 0,
                        dens25: 0,
                        dens30: 0,
                        dens35: 0,
                        dens40: 0,
                        dens45: 0,
                        dens50: 0,
                        dens55: 0,
                        dens60: 0,


                    }
                    angular.forEach(densdata, function(val) {
                        console.log('for each densdata' + val.val)

                        if (val.val == 0) {
                            densvaldata = {
                                dens0: val.dens,

                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 5) {

                            densvaldata = {
                                dens5: val.dens,
                                dens0: densvaldata.dens0,

                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }
                        }
                        if (val.val == 10) {
                            densvaldata = {
                                dens10: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,

                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 15) {
                            densvaldata = {
                                dens15: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,

                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 20) {
                            densvaldata = {
                                dens20: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,

                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 25) {
                            densvaldata = {
                                dens25: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,

                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 30) {
                            densvaldata = {
                                dens30: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,

                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 35) {
                            densvaldata = {
                                dens35: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,

                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 40) {
                            densvaldata = {
                                dens40: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,

                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 45) {
                            densvaldata = {
                                dens45: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,

                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 50) {
                            densvaldata = {
                                dens50: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,

                                dens55: densvaldata.dens55,
                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 55) {
                            densvaldata = {
                                dens55: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,

                                dens60: densvaldata.dens60,



                            }

                        }
                        if (val.val == 60) {
                            densvaldata = {
                                dens60: val.dens,
                                dens0: densvaldata.dens0,
                                dens5: densvaldata.dens5,
                                dens10: densvaldata.dens10,
                                dens15: densvaldata.dens15,
                                dens20: densvaldata.dens20,
                                dens25: densvaldata.dens25,
                                dens30: densvaldata.dens30,
                                dens35: densvaldata.dens35,
                                dens40: densvaldata.dens40,
                                dens45: densvaldata.dens45,
                                dens50: densvaldata.dens50,
                                dens55: densvaldata.dens55,




                            }

                        }
                        $scope.densidadesToPrint = densvaldata;

                    })

                    var data = {
                        barr: val1.barr,
                        camion: val1.camion,
                        hora: val1.hora,
                        r1: val1.r1,
                        r2: val1.r2,
                        rpm: val1.rpm,
                        temp: val1.temp,
                        coment: val1.coment,
                        densidades: $scope.densidadesToPrint

                    }
                    $scope.muestrasToPrint.push(data)
                })

            }


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

                        $scope.loadDensData($scope.muestraData);
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

            $scope.exportToExcel = function(tableId, name) { // ex: '#my-table'
                var data = tableId;

                var exportHref = Excel.tableToExcel(data, name);
                $timeout(function() { location.href = exportHref; }, 100); // trigger download
            };

            $scope.exportData = function() {
                alasql('SELECT * INTO XLSX("reporte.xlsx",{headers:true}) \ FROM HTML("#muestras",{headers:true})');

            };
            $scope.export = function() {
                html2canvas(document.getElementById('Muestras'), {
                    onrendered: function(canvas) {

                        var data = document.body.appendChild(canvas).toDataURL();
                        var hdata = $(window).height()
                        var docDefinition = {
                            content: [{
                                image: data,
                                height: 600,

                            }]
                        };
                        pdfMake.createPdf(docDefinition).download("muestras.pdf");
                    }
                });
            }

        }
    ])