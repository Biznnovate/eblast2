angular.module('app.vistaDeReporte', [])
    .controller('vistaDeReporteCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
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
            let remoteprojDB = new PouchDB('https://biznnovate.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
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



            $scope.createBarrenosUpdated1 = function() {
                $scope.BarrenosUpdated = [];
                angular.forEach($scope.Barrenos, function(value) {

                    var filtro = 'Updated'
                    if (value.status == filtro) {
                        $scope.BarrenosUpdated.push(value);
                        console.log('se agrego el Barreno ' + value.barr)
                    } else {
                        console.log('no se ha trabajado aun ' + value.barr)
                    }
                });
            };
            $scope.calcBarrenosUpdated1 = function() {
                $scope.BarrenosUpdatedCalcs = [];
                $scope.createBarrenosUpdated();
                angular.forEach($scope.BarrenosUpdated, function(value) {
                    var data = {
                        barr: value.barr,
                        L: value.calcs.L,
                        D: value.calcs.D,
                        Tf: value.calcs.Tf,
                        Ta: value.calcs.Ta,
                        Li: value.calcs.Li,
                        Ci: value.calcs.Ci,
                        ci: value.calcs.ci,
                        d: value.calcs.d,
                        B: value.calcs.B,
                        Es: value.calcs.Es,
                        s: value.calcs.s,
                        Lc: value.calcs.Lc,
                        Cm: value.calcs.Cm,
                        Ct: value.calcs.Ct,
                        V: value.calcs.V,
                        Pt: value.calcs.Pt,
                        Fc: value.calcs.Fc
                    }

                    $scope.BarrenosUpdatedCalcs.push(data);

                });
                console.log('Se creo Barrenos Updated con ' + $scope.BarrenosUpdatedCalcs.length + ' barrenos')
            }


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
                        console.log(doc.tipos)
                        console.log('se encontro el proyecto:' + proj)
                        $scope.cargasBarrTemp = []
                        $scope.cargasBarr = []

                        $scope.BarrenosUpdatedCalcs = [];
                        angular.forEach($scope.Barrenos, function(val) {
                            console.log('procesando barreno ' + val.barr)

                            if (val.status == 'Updated') {
                                var carga = val.tipo.carga
                                var barr = val.barr
                                var databarr = {
                                    barr: val.barr,
                                    L: val.calcs.L,
                                    D: val.calcs.D,
                                    Tf: val.calcs.Tf,
                                    Ta: val.calcs.Ta,
                                    Li: val.calcs.Li,
                                    Ci: val.calcs.Ci,
                                    ci: val.calcs.ci,
                                    d: val.calcs.d,
                                    B: val.calcs.B,
                                    Es: val.calcs.Es,
                                    s: val.calcs.s,
                                    Lc: val.calcs.Lc,
                                    Cm: val.calcs.Cm,
                                    Ct: val.calcs.Ct,
                                    V: val.calcs.V,
                                    Pt: val.calcs.Pt,
                                    Fc: val.calcs.Fc
                                }

                                $scope.BarrenosUpdatedCalcs.push(databarr);



                                angular.forEach(carga, function(valtip) {

                                    var data2 = {
                                        barr: barr,
                                        status: val.status,
                                        // id: valtip.carga.id,
                                        tipoid: valtip.tipoid || '',
                                        tipo: valtip.tipo || '',
                                        prod: valtip.prod || '',

                                    }
                                    $scope.cargasBarr.push(data2);

                                });

                            }
                        });





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
                        'TacoFinal': value.doc.tacofinal,
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



                $scope.ExplosiveTypeList = ['cg', 'ce'];

                $scope.filterByType = function(y) {
                    $scope.filterByTyperesult = $scope.ExplosiveTypeList.indexOf(y.tipoid) !== -1;
                    return ($scope.ExplosiveTypeList.indexOf(y.tipoid) !== -1);
                };


                $scope.IniTypeList = ['ini'];

                $scope.filterByIni = function(y) {
                    return ($scope.IniTypeList.indexOf(y.tipoid) !== -1);
                };
            };



            $scope.getVolumenTotal = function() {
                var total = 0;

                var V = 0;
                for (var i = 0; i < $scope.BarrenosUpdatedCalcs.length; i++) {
                    var product = $scope.BarrenosUpdatedCalcs[i];

                    V += (product.V);

                    total = V;
                    console.log('volumen ' + product.V);
                    console.log('volumen calculado ' + V);


                }
                return total;

            }
            $scope.getCt = function() {
                var total = 0;
                for (var i = 0; i < $scope.BarrenosUpdatedCalcs.length; i++) {
                    var product = $scope.BarrenosUpdatedCalcs[i];
                    console.log('Carga Total ' + product.Ct);
                    total += (product.Ct);

                }
                return total;

            }
            $scope.getCi = function() {
                var total = 0;
                for (var i = 0; i < $scope.BarrenosUpdatedCalcs.length; i++) {
                    var product = $scope.BarrenosUpdatedCalcs[i];
                    console.log('Carga Total Iniciadores ' + product.Ci);
                    total += (product.Ci);

                }
                return total;

            }
            $scope.getPt = function() {
                var total = 0;
                for (var i = 0; i < $scope.BarrenosUpdatedCalcs.length; i++) {
                    var product = $scope.BarrenosUpdatedCalcs[i];
                    console.log('Carga Total Explosivos ' + product.Pt);
                    total += (product.Pt);

                }
                return total;

            }
            $scope.getFactordecarga = function() {
                var total = 0;
                for (var i = 0; i < $scope.BarrenosUpdatedCalcs.length; i++) {
                    var product = $scope.BarrenosUpdatedCalcs[i];
                    console.log('Factor de Carga ' + product.Fc);
                    total += (product.Fc);
                    //$scope.PesoTotal = total;
                }
                return total;

            }
            $scope.getProfRealTotal = function() {
                var total = 0;
                for (var i = 0; i < $scope.BarrenosUpdatedCalcs.length; i++) {
                    var product = $scope.BarrenosUpdatedCalcs[i];
                    console.log(product.L * 1);
                    total += (product.L);
                    //$scope.PesoTotal = total;
                }
                return total;

            }
            $scope.countUpdatedBarras = function() {

                var rows = $scope.Barrenos.rows;
                var count = 0;
                angular.forEach(rows, function(barreno) {
                    count += barreno.doc.status == 'Updated' ? 1 : 0;
                });
                return count;


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
                        'TacoFinal': value.doc.tacofinal,
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

            $scope.exportToExcel = function(tableId, name) { // ex: '#my-table'
                var data = tableId;

                var exportHref = Excel.tableToExcel(data, name);
                $timeout(function() { location.href = exportHref; }, 5000); // trigger download
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
                        pdfMake.createPdf(docDefinition).download("barrenos.pdf");
                    }
                });
            }

        }
    ])