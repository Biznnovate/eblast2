angular.module('app.reporteCamion', [])
    .controller('reporteCamionCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, pouchDB, Excel, $timeout, $ionicLoading) {
            //llama bd de data
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

            $scope.projID = $scope.projparam.proj || '';
            $scope.selectProjFunc = function() {
                if ($scope.projID != '') {
                    var proj = $scope.projID;
                    localprojDB.get(proj).then(function(doc) {
                        $scope.selectedProj = doc;
                        console.log(doc)
                        $scope.tipobarr = doc.tipos;
                        $scope.Barrenos = doc.barrenos;
                        $scope.Muesrow = doc.muestras;
                        $scope.Productos = doc.productos;
                        $scope.dataGral = doc.datagral;
                        $scope.dataCamion = doc.datacamion;

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



            $scope.butGen = true;
            $scope.butExp = false;
            $scope.dataExport = []
            $scope.frontExport = []

            $scope.selectProj1 = function() {


                angular.forEach($scope.Barrenos, function(value, key) {
                    var dataExp = {
                        'Barreno': value.doc.barr,
                        'CoordX': value.doc.coordx,
                        'CoordY': value.doc.coordy,
                        'ProfDis': value.doc.prof,
                        'Diam': value.doc.diametro,
                        'ProfReal': value.doc.profreal,
                        'Taco': value.doc.taco,
                        'Tacoini': value.doc.tacoini,
                        'Aire': value.doc.aire,
                        'Bordo': value.doc.bordo,
                        'Espaciamiento': value.doc.espaciamiento,
                        'Diametro': value.doc.diametro,
                        'Status': value.doc.status,
                        'CargasinAire': value.doc.cargasinaire,
                        'CargaMenosAire': value.doc.cargamenosaire,
                        'cargaAgraneldisp': value.doc.cargaagraneldisp,
                        'volumcil': value.doc.volumencil,
                        'cargaagranel': value.doc.cargaagranel,
                        'volumentotal': value.doc.volumentotal,
                        'pesototal': value.doc.pesototal,
                        'factordecarga': value.doc.factordecarga,
                    }
                    $scope.dataExport.push(dataExp);

                });




            };
            //$scope.selectProj();
            $scope.createMuestras = function() {
                angular.forEach($scope.Muestras.rows, function(value, key) {
                    var dataMues = {
                        'muestra': value.doc._id,
                        'barr': value.doc.barr,
                        'camion': value.doc.camion,
                        'hora': value.doc.hora,
                        'r1': value.doc.r1,
                        'r2': value.doc.r2,
                        'rpm': value.doc.rpm,
                        'temp': value.doc.temp,
                        'dens0': value.doc.dens0,
                        'dens5': value.doc.dens5,
                        'dens10': value.doc.dens10,
                        'dens15': value.doc.dens15,
                        'dens20': value.doc.dens20,
                        'dens25': value.doc.dens25,
                        'dens30': value.doc.dens30,
                        'dens35': value.doc.dens35,
                        'dens40': value.doc.dens40,
                        'dens45': value.doc.dens45,
                        'dens50': value.doc.dens50,
                        'dens55': value.doc.dens55,
                        'dens60': value.doc.dens60,
                        'coment': value.doc.coment,

                    }
                    $scope.muestrasExport.push(dataMues);

                });
            }
            $scope.createSismografos = function() {
                angular.forEach($scope.Sismografos.rows, function(value, key) {
                    var dataSis = {
                        'id': value.doc._id,
                        'sis': value.doc.sis,
                        'inst': value.doc.inst,
                        'caldate': value.doc.caldate,
                        'lecdate': value.doc.lecdate,
                        'hora': value.doc.hora,
                        'estruc': value.doc.estruc,
                        'dist': value.doc.dist,
                        'radial': value.doc.radial,
                        'vert': value.doc.vert,
                        'trans': value.doc.trans,
                        'acust': value.doc.acust,
                        'explosivista': value.doc.explosivista,
                        'lic': value.doc.lic,


                    }
                    $scope.sisExport.push(dataSis);

                });
            }
            $scope.createDataExp = function() {
                angular.forEach($scope.Barrenos.rows, function(value, key) {
                    var dataExp = {
                        'Barreno': value.doc.barr,
                        'CoordX': value.doc.coordx,
                        'CoordY': value.doc.coordy,
                        'ProfDis': value.doc.prof,
                        'Diam': value.doc.diametro,
                        'ProfReal': value.doc.profreal,
                        'Taco': value.doc.taco,
                        'Tacoini': value.doc.tacoini,
                        'Aire': value.doc.aire,
                        'Bordo': value.doc.bordo,
                        'Espaciamiento': value.doc.espaciamiento,
                        'Diametro': value.doc.diametro,
                        'Status': value.doc.status,
                        'CargasinAire': value.doc.cargasinaire,
                        'CargaMenosAire': value.doc.cargamenosaire,
                        'cargaAgraneldisp': value.doc.cargaagraneldisp,
                        'volumcil': value.doc.volumencil,
                        'cargaagranel': value.doc.cargaagranel,
                        'volumentotal': value.doc.volumentotal,
                        'pesototal': value.doc.pesototal,
                        'factordecarga': value.doc.factordecarga,
                    }
                    $scope.dataExport.push(dataExp);

                });

                var projExp = {
                    'stracon': $scope.selectedProj_u.stracon,
                    'voladuranum': $scope.selectedProj_u.voladuranum,
                    'horaini': $scope.selectedProj_u.doc.horaini,
                    'tipotiro': $scope.selectedProj_u.doc.tipotiro,
                    'fechatiro': $scope.selectedProj_u.doc.fechatiro,
                    'fechacarga': $scope.selectedProj_u.doc.fechacarga,
                    'frentetrab': $scope.selectedProj_u.doc.frentetrab,
                    'explosivista': $scope.selectedProj_u.doc.explosivista,
                    'explolic': $scope.selectedProj_u.explolic,

                }
                $scope.frontExport.push(projExp);

                $scope.butGen = false;
                $scope.butExp = true;
                $scope.dataName = 'Reporte ' + Date();
                $scope.infoName = 'Front ' + Date();
            }



            $scope.ExportCSV = function(obj) {

                console.log(obj)
                console.log($scope.barreno)
                $scope.dataExport = obj;
            };
            $scope.exportData = function() {
                alasql('SELECT * INTO XLSX("reportedecargascamion.xlsx",{headers:true}) \ FROM HTML("#barrenostab",{headers:true})');
                //alasql('SELECT * INTO XLSX("reporte.xlsx",{headers:true}) FROM ?', [$scope.Barrenos]);
            };

            $scope.exportToExcel = function(tableId, name) { // ex: '#my-table'
                var data = tableId;

                var exportHref = Excel.tableToExcel(data, name);
                $timeout(function() { location.href = exportHref; }, 100); // trigger download
            };
            $scope.export = function() {
                html2canvas(document.getElementById('barrenos'), {
                    onrendered: function(canvas) {
                        var data = canvas.toDataURL();
                        var docDefinition = {
                            content: [{
                                image: data,
                                width: 600,
                            }]
                        };
                        pdfMake.createPdf(docDefinition).download("reportedecarga.pdf");
                    }
                });
            }

        }
    ])