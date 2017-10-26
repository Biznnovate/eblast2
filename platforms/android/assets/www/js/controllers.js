angular.module('app.controllers', [])

.controller('inicioCtrl', ['$scope', '$stateParams', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, pouchDB) {
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



    }
])

.controller('vistaDeProyectoCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, pouchDB) {
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


        $scope.gotoProductos = function() {
            $state.go('menu.generarReporteProductos', { 'proj': $scope.projID });
        }
        $scope.gotoMuestra = function() {
            $state.go('menu.tomaDeMuestra', { 'proj': $scope.projID });
        }
        $scope.gotoSismo = function() {
            $state.go('menu.tomaDeSismografos', { 'proj': $scope.projID });
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


    }
])

.controller('vistaDeReporteCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', 'Excel', '$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, pouchDB, Excel, $timeout) {
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
                        pdfMake.createPdf(docDefinition).download("barrenos.pdf");
                    }
                });
            }

        }
    ])
    .controller('reporteCarga1Ctrl', ['$scope', '$stateParams', '$state', 'pouchDB', 'Excel', '$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, pouchDB, Excel, $timeout) {
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
    .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams) {


        }
    ])

.controller('loginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {


    }
])

.controller('subirProyectoCtrl', ['$scope', '$stateParams', '$state', '$filter', '$window', 'Uploadcsv', 'CsvParser', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, $filter, $window, Uploadcsv, CsvParser, pouchDB, ngCsvImport) {


        //upload files
        //$scope.showOption = '';
        $scope.showStartBarr = true;
        $scope.showcleanup = false;
        $scope.showupload = true;
        $scope.csv = {
                'header': false,
                'separator': ',',
                'result': ''
            }
            //let localDB = new pouchDB('barrenos');

        let localDB = new pouchDB('barrenoscsv');

        let remoteDB = new PouchDB('https://biznnovate.cloudant.com/eblast-barrenoscsv', { skipSetup: true });
        remoteDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
            console.log("I'm Batman.");
            return remoteDB.getSession();
        });
        localDB.sync(remoteDB).on('complete', function() {
            // yay, we're in sync!
        }).on('error', function(err) {
            // boo, we hit an error!
        });


        let localDivCSV = new pouchDB('barrenoscsvdiv');
        let remoteDivCSV = new PouchDB('https://biznnovate.cloudant.com/eblast-barrenoscsvdiv', { skipSetup: true });
        remoteDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
            console.log("I'm Batman.");
            return remoteDivCSV.getSession();
        });
        localDivCSV.sync(remoteDivCSV).on('complete', function() {
            // yay, we're in sync!
        }).on('error', function(err) {
            // boo, we hit an error!
        });

        let localDB2 = new pouchDB('barrenos');
        let remoteDB2 = new PouchDB('https://biznnovate.cloudant.com/eblast-barrenos', { skipSetup: true });
        remoteDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
            console.log("I'm Batman.");
            return remoteDB2.getSession();
        });
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
        //llama datos de DB de Explosivistas
        localprojDB.allDocs({
            include_docs: true,
            attachments: true
        }).then(function(result) {
            // handle result
            $scope.projInfo = result;
        }).catch(function(err) {
            console.log(err);
        });
        $scope.updateSelectId = function(obj) {
            $scope.selectedId = obj;
            console.log(obj)
            $scope.selectedProj = obj.doc.stracon;
            console.log(obj.doc.stracon)
        }
        $scope.selectedProj = '';

        $scope.showcontinue = false;


        var cleanLocalDB = function() {



            localDB.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return localDB.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });
            remoteDB.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return remoteDB.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });

            localDB2.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return localDB2.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });
            remoteDB2.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return remoteDB2.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });
            localDivCSV.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return localDivCSV.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });
            remoteDivCSV.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return remoteDivCSV.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });




            console.log('Cleaned Working DBS')

        }
        cleanLocalDB();
        $scope.addCSV = function() {
            let localDB = new pouchDB('barrenoscsv');
            // let remoteDB = new PouchDB('https://biznnovate.cloudant.com/eblast-barrenoscsv');

            $scope.showcleanup = true;
            $scope.showupload = true;
            var data = $scope.csv.content;
            //$scope.Uploadcsv = function(){
            //  Uploadcsv.then(function(data){

            //$scope.items_csv = data;
            var rows = data.split('\n');
            var obj = [];
            $scope.columns = [];
            angular.forEach(rows, function(val) {
                var o = val.split(',');

                var objstr = JSON.stringify(obj);
                //alert(objstr);
                //function checkData(csvval) {
                //return csvval == null;
                //}
                var columns = {
                    Col1: o[0],
                    Col2: o[1],
                    Col3: o[2],
                    Col4: o[3],
                    Col5: o[4],
                }
                $scope.columns.push(columns);
                //localDB.sync(remoteDB).on('complete', function() {
                // yay, we're in sync!
                // }).on('error', function(err) {
                // boo, we hit an error!
                // });








                $state.go('menu.ajustarCSV', { 'status': $scope.columns, });




            });
            console.log('Se subieron ' + $scope.columns.length + ' columnas')
        }
        $scope.addCSV1 = function() {
            let localDB = new pouchDB('barrenoscsv');
            let remoteDB = new PouchDB('https://biznnovate.cloudant.com/eblast-barrenoscsv');

            $scope.showcleanup = true;
            $scope.showupload = true;
            var data = $scope.csv.content;
            //$scope.Uploadcsv = function(){
            //  Uploadcsv.then(function(data){

            //$scope.items_csv = data;
            var rows = data.split('\n');
            var obj = [];
            angular.forEach(rows, function(val) {
                var o = val.split(',');

                var objstr = JSON.stringify(obj);
                //alert(objstr);
                //function checkData(csvval) {
                //return csvval == null;
                //}
                localDB.post({
                    Col1: o[0],
                    Col2: o[1],
                    Col3: o[2],
                    Col4: o[3],
                    Col5: o[4],
                }).then(function(response) {
                    console.log('barrenoscsv created')
                        // handle response
                }).catch(function(err) {
                    console.log(err);
                });
            });
            //localDB.sync(remoteDB).on('complete', function() {
            // yay, we're in sync!
            // }).on('error', function(err) {
            // boo, we hit an error!
            // });

            var col1Funct = function() {

                let localCSVDB = new pouchDB('barrenoscsv');

                localCSVDB.find({
                    selector: { Col1: { $gte: null } },
                    fields: ['_id', 'Col1'],
                    // sort: ['Col1']
                }).then(function(result) {
                    // handle result
                    console.log(result)
                    $scope.tempCSVdiv = result;
                    // var rows = $scope.tempCSVdiv.split('\n');
                    let localDivCSV = new pouchDB('barrenoscsvdiv');
                    angular.forEach($scope.tempCSVdiv.docs, function(value, key) {

                        localDivCSV.put({
                            _id: value._id + 'Col1',
                            oldid: value._id,
                            nam: 'Col1',
                            val: value.Col1,

                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });

                    });

                    //  $scope.tempCSVdiv = result;
                }).catch(function(err) {
                    console.log(err);
                })



            }
            var col2Funct = function() {
                //For column2
                $scope.tempCSVdiv = [];
                let localCSVDB = new pouchDB('barrenoscsv');
                localCSVDB.find({
                    selector: { Col2: { $gte: null } },
                    fields: ['_id', 'Col2'],
                    // sort: ['Col2']
                }).then(function(result) {
                    // handle result
                    $scope.tempCSVdiv = result;
                    // var rows = $scope.tempCSVdiv.split('\n');
                    let localDivCSV = new pouchDB('barrenoscsvdiv');

                    angular.forEach($scope.tempCSVdiv.docs, function(value, key) {

                        localDivCSV.put({
                            _id: value._id + 'Col2',
                            oldid: value._id,
                            nam: 'Col2',
                            val: value.Col2,

                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });

                    });


                }).catch(function(err) {
                    console.log(err);
                })


            }
            var col3Funct = function() {
                //For column3
                let localCSVDB = new pouchDB('barrenoscsv');
                localCSVDB.find({
                    selector: { Col3: { $gte: null } },
                    fields: ['_id', 'Col3'],
                    // sort: ['Col3']
                }).then(function(result) {
                    // handle result
                    $scope.tempCSVdiv = result;
                    // var rows = $scope.tempCSVdiv.split('\n');
                    let localDivCSV = new pouchDB('barrenoscsvdiv');
                    angular.forEach($scope.tempCSVdiv.docs, function(value, key) {

                        localDivCSV.put({
                            _id: value._id + 'Col3',
                            oldid: value._id,
                            nam: 'Col3',
                            val: value.Col3,

                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });

                    });


                }).catch(function(err) {
                    console.log(err);
                })



            }
            var col4Funct = function() {
                //For column4
                let localCSVDB = new pouchDB('barrenoscsv');
                localCSVDB.find({
                    selector: { Col4: { $gte: null } },
                    fields: ['_id', 'Col4'],
                    // sort: ['Col4']
                }).then(function(result) {
                    // handle result
                    $scope.tempCSVdiv = result;
                    // var rows = $scope.tempCSVdiv.split('\n');
                    let localDivCSV = new pouchDB('barrenoscsvdiv');
                    angular.forEach($scope.tempCSVdiv.docs, function(value, key) {

                        localDivCSV.put({
                            _id: value._id + 'Col4',
                            oldid: value._id,
                            nam: 'Col4',
                            val: value.Col4,

                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });

                    });

                }).catch(function(err) {
                    console.log(err);
                })




            }
            var col5Funct = function() {
                //For column5
                let localCSVDB = new pouchDB('barrenoscsv');
                localCSVDB.find({
                    selector: { Col5: { $gte: null } },
                    fields: ['_id', 'Col5'],
                    //sort: ['Col5']
                }).then(function(result) {
                    // handle result
                    $scope.tempCSVdiv = result;
                    // var rows = $scope.tempCSVdiv.split('\n');
                    let localDivCSV = new pouchDB('barrenoscsvdiv');
                    angular.forEach($scope.tempCSVdiv.docs, function(value, key) {

                        localDivCSV.put({
                            _id: value._id + 'Col5',
                            oldid: value._id,
                            nam: 'Col5',
                            val: value.Col5,

                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });

                    });

                }).catch(function(err) {
                    console.log(err);
                })



            }




            var gotoAjustarCSV = function(proj) {
                localDivCSV.sync(remoteDivCSV).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });
                $state.go('menu.ajustarCSV');
            };


            col1Funct();
            col2Funct();
            col3Funct();
            col4Funct();
            col5Funct();
            //createNewProj();
            gotoAjustarCSV();


        }
        $scope.showContinueForm = false;
        $scope.showForm = false;
        $scope.selectProj = function(obj) {
            console.log(obj)
            $scope.selectedProj_u = obj;
            $scope.projnam_u = obj.doc.proj;
            $scope.showContinueForm = true;
            $scope.proj_id = obj.doc._id;
            $scope.projID = obj.doc._id;
        }
        $scope.updateProjNam = function(obj) {
            console.log(obj)
            $scope.projnam_u = obj;
            $scope.show = true;
        }

        $scope.checkProj = function() {
            var proj = $scope.projnam_u;
            localprojDB.get(proj).then(function(doc) {
                // handle doc
                //alert('yes');
                $scope.proj = doc;
                //$scope.message = ''
                $scope.projExists = true;


            }).catch(function(err) {
                console.log(err);
                // alert('no');
                $scope.showForm2 = true;
                $scope.projExists = false;

            });

            $scope.showStartBarr = false;
        }

        $scope.cleanDBAll = function() {

            let localDB2 = new pouchDB('barrenos');
            let remoteDB2 = new PouchDB('https://biznnovate.cloudant.com/eblast-barrenos', { skipSetup: true });
            remoteDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteDB2.getSession();
            });
            $scope.showupload = false;
            $scope.showcleanup = true;

            localDB.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return localDB.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });
            remoteDB.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return remoteDB.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });

            localDB2.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return localDB2.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });
            remoteDB2.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return remoteDB2.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });
            localDivCSV.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return localDivCSV.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });
            remoteDivCSV.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return remoteDivCSV.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done!
            }).catch(function(err) {
                // error!
            });

        }
        $scope.gotoMenu = function() {
            $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
        }
    }
])

.controller('ajustarCSVCtrl', ['$scope', '$stateParams', '$state', '$window', '$filter', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, $window, $filter, pouchDB) {

        $scope.projInfo = {
            'id': $stateParams.id,
            'status': $stateParams.status,

        }
        $scope.columns = $scope.projInfo.status;
        $scope.projID = '';
        $scope.updateProjNam = function(obj) {
            console.log(obj)
            $scope.projnam_u = obj;
            $scope.showIniciar = true;
            $scope.projID = obj + new Date().toISOString();

        }
        $scope.corregir = function() {
            $state.go('menu.subirProyecto');
        }
        console.log($scope.projInfo);
        //tipos de columna

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


        $scope.viewPreview = false;
        $scope.column_type_list = [
            { 'id': 'Col1', 'nam': 'Columna 1', 'status': '' },
            { 'id': 'Col2', 'nam': 'Columna 2', 'status': '' },
            { 'id': 'Col3', 'nam': 'Columna 3', 'status': '' },
            { 'id': 'Col4', 'nam': 'Columna 4', 'status': '' },
            { 'id': 'Col5', 'nam': 'Columna 5', 'status': '' },

        ];

        $scope.column_nam_list = [
            { 'id': 'barr', 'nam': 'ID del Barreno', 'status': '' },
            { 'id': 'coordx', 'nam': 'Easting', 'status': '' },
            { 'id': 'coordy', 'nam': 'Northing', 'status': '' },
            { 'id': 'prof', 'nam': 'Profundidad', 'status': '' },
            { 'id': 'diam', 'nam': 'Diametro', 'status': '' },

        ];

        $scope.unitTableProf = [
            { 'id': 'mm', 'val': 1000, 'nam': 'Milímetros (mm)' },
            { 'id': 'cm', 'val': 100, 'nam': 'Centímetros (cm)' },
            { 'id': 'dm', 'val': 10, 'nam': 'Decímetros (dm)' },
            { 'id': 'mts', 'val': 1, 'nam': 'Metros (mts)' },
            { 'id': 'ft', 'val': 3.28084, 'nam': 'Pies (ft)' },
            { 'id': 'in', 'val': 39.3701, 'nam': 'Pulgadas (in)' },
        ];
        $scope.unitTableDia = [
            { 'id': 'mm', 'val': 1, 'nam': 'Milímetros (mm)' },
            { 'id': 'cm', 'val': 0.1, 'nam': 'Centímetros (cm)' },
            { 'id': 'dm', 'val': 0.01, 'nam': 'Decímetros (dm)' },
            { 'id': 'mts', 'val': 0.001, 'nam': 'Metros (mts)' },
            { 'id': 'ft', 'val': 0.00328084, 'nam': 'Pies (ft)' },
            { 'id': 'in', 'val': 0.0393701, 'nam': 'Pulgadas (in)' },
        ];
        $scope.column_type = {};

        $scope.continueOpt = true;

        $scope.temptable = {
            item1: '1',
            item2: '2.2'

        }
        $scope.tempcalcs = {
            calc1: 1 * $scope.temptable.item1,
            calc2: parseFloat($scope.temptable.item2, 2),
            calc3: parseFloat($scope.temptable.item2, 2) * 3.5,

        }

        console.log('calcs ' + $scope.tempcalcs)

        $scope.columninfo = [];


        $scope.valrows = [];
        $scope.showIniciar = false;
        $scope.titleToggle = false;




        //declare db with columntypes




        $scope.showSelectProf = false;
        $scope.showSelectDiam = false;


        $scope.selectCol1 = function(obj, conv) {

            console.log(obj);
            $scope.showSelectProf = false;
            $scope.showSelectDiam = false;
            $scope.columnsIndex = [];
            var conversion = conv || 1;
            var arrayObj = $scope.columns;
            if (obj.id == 'barr') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].barr = arrayObj[i]['Col1'];
                    delete arrayObj[i].Col1;
                }

            } else if (obj.id == 'coordx') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordx = arrayObj[i]['Col1'];
                    delete arrayObj[i].Col1;
                }
            } else if (obj.id == 'coordy') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordy = arrayObj[i]['Col1'];
                    delete arrayObj[i].Col1;
                }
            } else if (obj.id == 'prof') {
                $scope.showSelectProf = true;

                for (i = 0; i < arrayObj.length; i++) {

                    arrayObj[i].prof = arrayObj[i]['Col1'];
                    delete arrayObj[i].Col1;
                }
            } else if (obj.id == 'diam') {
                $scope.showSelectDiam = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].diam = arrayObj[i]['Col1'];
                    delete arrayObj[i].Col1;
                }
            }
        }
        $scope.selectCol2 = function(obj, conv) {
            console.log(obj);
            $scope.columnsIndex = [];
            $scope.showSelectProf = false;
            $scope.showSelectDiam = false;
            var conversion = conv || 1;
            var arrayObj = $scope.columns;
            if (obj.id == 'barr') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].barr = arrayObj[i]['Col2'];
                    delete arrayObj[i].Col2;
                }

            } else if (obj.id == 'coordx') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordx = arrayObj[i]['Col2'];
                    delete arrayObj[i].Col2;
                }
            } else if (obj.id == 'coordy') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordy = arrayObj[i]['Col2'];
                    delete arrayObj[i].Col2;
                }
            } else if (obj.id == 'prof') {
                $scope.showSelectProf = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].prof = arrayObj[i]['Col2'];
                    delete arrayObj[i].Col2;
                }
            } else if (obj.id == 'diam') {
                $scope.showSelectDiam = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].diam = arrayObj[i]['Col2'];
                    delete arrayObj[i].Col2;
                }
            }
        }
        $scope.selectCol3 = function(obj, conv) {
            console.log(obj);
            $scope.showSelectProf = false;
            $scope.showSelectDiam = false;
            $scope.columnsIndex = [];
            var conversion = conv || 1;
            var arrayObj = $scope.columns;
            if (obj.id == 'barr') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].barr = arrayObj[i]['Col3'];
                    delete arrayObj[i].Col3;
                }

            } else if (obj.id == 'coordx') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordx = arrayObj[i]['Col3'];
                    delete arrayObj[i].Col3;
                }
            } else if (obj.id == 'coordy') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordy = arrayObj[i]['Col3'];
                    delete arrayObj[i].Col3;
                }
            } else if (obj.id == 'prof') {
                $scope.showSelectProf = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].prof = arrayObj[i]['Col3'];
                    delete arrayObj[i].Col3;
                }
            } else if (obj.id == 'diam') {
                $scope.showSelectDiam = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].diam = arrayObj[i]['Col3'];
                    delete arrayObj[i].Col3;
                }
            }
        }
        $scope.selectCol4 = function(obj, conv) {
            console.log(obj);
            $scope.showSelectProf = false;
            $scope.showSelectDiam = false;
            $scope.columnsIndex = [];
            var conversion = conv || 1;
            var arrayObj = $scope.columns;
            if (obj.id == 'barr') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].barr = arrayObj[i]['Col4'];
                    delete arrayObj[i].Col4;
                }

            } else if (obj.id == 'coordx') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordx = arrayObj[i]['Col4'];
                    delete arrayObj[i].Col4;
                }
            } else if (obj.id == 'coordy') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordy = arrayObj[i]['Col4'];
                    delete arrayObj[i].Col4;
                }
            } else if (obj.id == 'prof') {
                $scope.showSelectProf = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].prof = arrayObj[i]['Col4'];
                    delete arrayObj[i].Col4;
                }
            } else if (obj.id == 'diam') {
                $scope.showSelectDiam = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].diam = arrayObj[i]['Col4'];
                    delete arrayObj[i].Col4;
                }
            }
        }
        $scope.selectCol5 = function(obj, conv) {
            console.log(obj);
            $scope.showSelectProf = false;
            $scope.showSelectDiam = false;
            $scope.columnsIndex = [];
            var conversion = conv || 1;
            var arrayObj = $scope.columns;
            if (obj.id == 'barr') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].barr = arrayObj[i]['Col5'];
                    delete arrayObj[i].Col5;
                }

            } else if (obj.id == 'coordx') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordx = arrayObj[i]['Col5'];
                    delete arrayObj[i].Col5;
                }
            } else if (obj.id == 'coordy') {
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].coordy = arrayObj[i]['Col5'];
                    delete arrayObj[i].Col5;
                }
            } else if (obj.id == 'prof') {
                $scope.showSelectProf = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].prof = arrayObj[i]['Col5'];
                    delete arrayObj[i].Col5;
                }
            } else if (obj.id == 'diam') {
                $scope.showSelectDiam = true;
                for (i = 0; i < arrayObj.length; i++) {
                    arrayObj[i].diam = arrayObj[i]['Col5'];
                    delete arrayObj[i].Col5;
                }
            }
        }

        $scope.selectProfu1 = function(obj) {
            console.log(obj + ' valor ' + obj.val);

            $scope.columnsIndex = [];
            var conv = obj.val;
            var arrayObj = $scope.columns;
            $scope.columnsTemp = []
            angular.forEach(arrayObj, function(val) {
                var data = {
                    barr: val.barr,
                    coordx: val.coordx,
                    coordy: val.coordy,
                    prof: parseFloat(val.prof) * conv,
                    diam: val.diam,
                }
                console.log('data prof' + val.prof)
                $scope.columnsTemp.push(data);

            });

            $scope.columns = $scope.columnsTemp;
            $scope.showSelectProf = false;

        }
        $scope.selectProfu = function(obj) {

            console.log(obj + ' valor ' + obj.val);

            $scope.columnsIndex = [];
            var conv = obj.val;
            var arrayObj = $scope.columns;
            $scope.columnsTemp = []
            angular.forEach(arrayObj, function(val) {
                var data = {
                    barr: val.barr,
                    coordx: val.coordx,
                    coordy: val.coordy,
                    prof: parseFloat(val.prof) * conv,
                    diam: val.diam,
                }
                $scope.columnsTemp.push(data);

            });

            $scope.columns = $scope.columnsTemp;
            $scope.showSelectProf = false;

        }
        $scope.selectDiame = function(obj) {

            console.log(obj + ' valor ' + obj.val);

            $scope.columnsIndex = [];
            var conv = obj.val;
            var arrayObj = $scope.columns;
            $scope.columnsTemp = []
            angular.forEach(arrayObj, function(val) {
                var data = {
                    barr: val.barr,
                    coordx: val.coordx,
                    coordy: val.coordy,
                    prof: val.prof,
                    diam: parseFloat(val.diam) * conv,
                }
                $scope.columnsTemp.push(data);

            });

            $scope.columns = $scope.columnsTemp;
            $scope.showSelectDiam = false;

        }


        $scope.selectBarreno1 = function(obj) {
            console.log(obj)
                //console.log($scope.barrcol)
            $scope.barrcol_u = obj.id;
            var col = obj.id;

            let localDivCSV = new pouchDB('barrenoscsvdiv');
            localDivCSV.createIndex({
                index: {
                    fields: ['nam', 'val', 'oldid']
                }
            }).then(function() {
                return localDivCSV.find({
                    selector: { nam: col },
                    fields: ['oldid', 'val', '_rev'],
                    // sort: ['oldid']

                }).then(function(result) {

                    $scope.valrows = result.docs;
                    console.log(result.docs);

                    angular.forEach(result.docs, function(value, key) {
                        var id = value.oldid;
                        console.log(id);

                        localDB.get(id).then(function(doc) {
                            return localDB.put({
                                _id: doc._id,
                                _rev: doc._rev,
                                barr: value.val,
                                coordx: doc.coordx || 0,
                                coordy: doc.coordy || 0,
                                prof: doc.prof || 0,
                                diam: doc.diam || 0,

                            });
                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });
                    });
                });

            });


            $scope.showCoordxSelect = 'yes';
            $scope.disSBarr = true;
            $scope.message = 'Paso 2: Seleccione la Columna que contiene la Coordenada X';
        };

        $scope.selectCoordx = function(obj) {
            console.log(obj)
            console.log($scope.coordx)
            $scope.coordx_u = obj.id;
            var col = obj.id;
            localDivCSV.createIndex({
                index: {
                    fields: ['nam', 'val', 'oldid']
                }
            }).then(function() {
                return localDivCSV.find({
                    selector: { nam: col },
                    fields: ['oldid', 'val', '_rev'],
                    // sort: ['oldid']

                }).then(function(result) {

                    $scope.valrows = result.docs;

                    angular.forEach($scope.valrows, function(value, key) {
                        var id = value.oldid;

                        localDB.get(id).then(function(doc) {
                            return localDB.put({
                                _id: doc._id,
                                _rev: doc._rev,
                                barr: doc.barr || 0,
                                coordx: value.val,
                                coordy: doc.coordy || 0,
                                prof: doc.prof || 0,
                                diam: doc.diam || 0,

                            });
                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });
                    });
                });

            });


            $scope.showCoordySelect = 'yes';
            $scope.disCx = true;
        };

        $scope.selectCoordy = function(obj) {
            console.log(obj)
            console.log($scope.coordy)
            $scope.coordy_u = obj.id;
            var col = obj.id;
            localDivCSV.createIndex({
                index: {
                    fields: ['nam', 'val', 'oldid']
                }
            }).then(function() {
                return localDivCSV.find({
                    selector: { nam: col },
                    fields: ['oldid', 'val', '_rev'],
                    // sort: ['oldid']

                }).then(function(result) {

                    $scope.valrows = result.docs;

                    angular.forEach($scope.valrows, function(value, key) {
                        var id = value.oldid;

                        localDB.get(id).then(function(doc) {
                            return localDB.put({
                                _id: doc._id,
                                _rev: doc._rev,
                                barr: doc.barr || 0,
                                coordx: doc.coordx || 0,
                                coordy: value.val,
                                prof: doc.prof || 0,
                                diam: doc.diam || 0,

                            });
                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });
                    });
                });

            });


            $scope.showProf = 'yes';
            $scope.disCy = true;
        };

        $scope.selectProf = function(obj) {
            console.log(obj)
            console.log($scope.prof)
            $scope.prof_u = obj.id;
            $scope.showProfunit = 'yes';
        };

        $scope.selectDia = function(obj) {
            console.log(obj)
            console.log($scope.diametro)
            $scope.diametro_u = obj.id;
            $scope.showDiamunit = 'yes';
        };

        $scope.selectUnitProf = function(obj) {
            console.log(obj)
            console.log($scope.unitprof)
            $scope.unitprof_u = obj.val;
            var col = $scope.prof_u;
            localDivCSV.createIndex({
                index: {
                    fields: ['nam', 'val', 'oldid']
                }
            }).then(function() {
                return localDivCSV.find({
                    selector: { nam: col },
                    fields: ['oldid', 'val', '_rev'],
                    // sort: ['oldid']

                }).then(function(result) {

                    $scope.valrows = result.docs;

                    angular.forEach($scope.valrows, function(value, key) {
                        var id = value.oldid;
                        $scope.tempresp = value;
                        //  alert(value.val);
                        localDB.get(id).then(function(doc) {
                            return localDB.put({
                                _id: doc._id,
                                _rev: doc._rev,
                                barr: doc.barr || 0,
                                coordx: doc.coordx || 0,
                                coordy: doc.coordy || 0,
                                prof: value.val * obj.val,
                                diam: doc.diam || 0,
                            });
                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });
                    });
                });

            });

            localDB.sync(remoteDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
            $scope.showDiam = 'yes';
            $scope.disP = true;
        };

        $scope.selectUnitDia = function(obj) {
            console.log(obj)
            console.log($scope.unitdiametro)
            $scope.unitdiametro_u = obj.val;
            var col = $scope.diametro_u;
            localDivCSV.createIndex({
                index: {
                    fields: ['nam', 'val', 'oldid']
                }
            }).then(function() {
                return localDivCSV.find({
                    selector: { nam: col },
                    fields: ['oldid', 'val', '_rev'],
                    // sort: ['oldid']

                }).then(function(result) {

                    $scope.valrows = result.docs;

                    angular.forEach($scope.valrows, function(value, key) {
                        var id = value.oldid;
                        $scope.tempresp = value;
                        //  alert(value.val);
                        localDB.get(id).then(function(doc) {
                            return localDB.put({
                                _id: doc._id,
                                _rev: doc._rev,
                                barr: doc.barr || 0,
                                coordx: doc.coordx || 0,
                                coordy: doc.coordy || 0,
                                prof: doc.prof || 0,
                                diam: value.val * obj.val,
                            });
                        }).then(function(response) {
                            // handle response
                        }).catch(function(err) {
                            console.log(err);
                        });
                    });
                });

            });


            $scope.continueOpt = false;
            $scope.disD = true;
        };

        $scope.tittleToggle = '';
        $scope.reloadPage = function() {
            $window.location.reload();

        }

        $scope.confirmData = function() {
            $scope.barrenosToInsert = [];
            angular.forEach($scope.columns, function(value) {
                var barreno = {
                    barr: value.barr,
                    status: 'Pending',
                    coordx: value.coordx,
                    coordy: value.coordy,
                    prof: value.prof,
                    diam: value.diam,
                }
                $scope.barrenosToInsert.push(barreno);

            });
            console.log('For Each de Barrenos ' + $scope.barrenosToInsert.length)

        }
        $scope.insertBarrenosProj = function() {
            let localprojDB = new pouchDB('projects');
            let remoteprojDB = new PouchDB('https://biznnovate.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprojDB.getSession();
            });

            $scope.projID = $scope.projnam_u + new Date().toISOString();
            var projID = $scope.projID;
            var proj = $scope.projnam_u;
            var date = new Date().toISOString();
            //console.log('data para subir projID ' + projID + ' proj ' + proj + ' date ' + date)
            localprojDB.put({
                _id: projID,
                proj: proj,
                date: date,


            }).then(function(response) {
                console.log(' subio correctamente')
            }).catch(function(err) {
                console.log(err);

            });

            localprojDB.get(projID).then(function(doc) {
                return localprojDB.put({
                    _id: projID,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: $scope.barrenosToInsert,
                    tipos: [],
                }).catch(function(err) {
                    console.log(err);
                });
            });

            localprojDB.sync(remoteprojDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });

            $state.go('menu.parametrosVoladura1', { 'proj': $scope.projID });
        }


    }
])

.controller('parMetrosDeCSVPaso1Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {


    }
])

.controller('parMetrosDeCSVPaso3Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {


    }
])

.controller('mapaVoladura1Ctrl', ['$scope', '$stateParams', 'pouchdbserv', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, pouchdbserv, pouchDB) {
        let db = pouchDB('dbtest');
        let remoteDB = new PouchDB('https://biznnovate.cloudant.com/eblast', { skipSetup: true });
        remoteDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
            console.log("I'm Batman.");
            return remoteDB.getSession();
        })
        var doc = { name: 'David' };

        db.sync(remoteDB).on('complete', function() {
            // yay, we're in sync!
        }).on('error', function(err) {
            // boo, we hit an error!
        });

        function error(err) {
            $log.error(err);
        }

        function get(res) {
            if (!res.ok) {
                return error(res);
            }
            return db.get(res.id);
        }

        function bind(res) {
            $scope.doc = res;
        }

        db.post(doc)
            .then(get)
            .then(bind)
            .catch(error);

        $scope.a = '1';
        $scope.b = '5';

        $scope.list = [{ 'val': '1' }, { 'val': '2' }, { 'val': '3' }]
        $scope.itemList = [];

        //selectiona y remplaza item seleccionado
        $scope.selectValue = function(item) {
            $scope.itemList = [];

            $scope.itemList.push(item.val);
            $scope.a = $scope.itemList;
        }


        //calcula el valor de lo seleccionado
        //$scope.calcVal = function() {
        var c = parseFloat($scope.a);
        var d = parseFloat($scope.b);
        $scope.result = (d - c);


        // };

    }
])

.controller('parametrosVoladura1Ctrl', ['$scope', '$stateParams', '$state', 'Productos', '$filter', '$window', 'pouchDB', 'passInfo', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, Productos, $filter, $window, pouchDB, $routeParams, passInfo) {
        //option.name for option in data.availableOptions track by option.id



        //var barrparam = $stateParams.id || 0;
        $scope.editBarreno = {
            'id': $stateParams.id,
            'status': $stateParams.status,
            'proj': $stateParams.proj,
        }


        $scope.projID = $scope.editBarreno.proj || '';
        $scope.tipoID = $scope.editBarreno.id || '';
        $scope.projTipos = [];

        let tempDB = new pouchDB('temp');
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
        //llama datos de DB de Explosivistas
        localprojDB.allDocs({
            include_docs: true,
            attachments: true
        }).then(function(result) {
            // handle result
            $scope.projInfo = result;

        }).catch(function(err) {
            console.log(err);
        });

        var UpdatenewBarreno = function() {
            $scope.newBarreno = { 'nam': barrparam }
        }

        $scope.loadprojTipos = function() {


            var id = $scope.projID;
            if ($scope.projID != '') {

                console.log('Projid en shobarrform' + id)
                localprojDB.get(id).then(function(doc) {
                    $scope.projTipos = doc.tipos || [];
                    $scope.tipos = doc.tipos || [];

                    console.log('projtiposthing' + doc.tipos)
                    var selectedID = $scope.tipoBarrNam;
                    //var rows = $scope.projTipos;
                    console.log('Selected ID: ' + selectedID);
                    // console.log('tiporows' + rows);
                    $scope.countTipos = doc.tipos.length;

                }).catch(function(err) {
                    console.log(err);
                });


            } else {
                console.log('no proj selected')
                $scope.projTipos = [];
            }


        }
        $scope.loadprojTipos();
        //UpdatenewBarreno();
        //$scope.newBarreno = {'nam': barrparam};
        console.log($scope.newBarreno);
        $scope.listed_productos = Productos.list;
        $scope.prods = [];
        $scope.DisableSaveButton = true;

        $scope.tipodebarr_list = [];
        //Declara y Sincroniza base de datos de Tipo
        let tipolocalDB = new pouchDB('bartype');
        let tiporemoteDB = new PouchDB('https://biznnovate.cloudant.com/eblast-bartype');

        tipolocalDB.sync(tiporemoteDB).on('complete', function() {
            // yay, we're in sync!
        }).on('error', function(err) {
            // boo, we hit an error!
        });

        $scope.tipodeprod_list = [
            //{'id': 'ini', 'tipo': 'Iniciadores' },
            { 'id': 'ce', 'tipo': 'Carga Empacada' },
            { 'id': 'cg', 'tipo': 'Carga a Granel' },
        ];
        $scope.onlyNumbers = /^(0*[1-9][0-9]*([\.\,][0-9]+)?|0+[\.\,][0-9]*[1-9][0-9]*)$/;

        //muestra los datos a capturar
        //$scope.barrForm = false;
        $scope.reloadButton = '';
        $scope.updateButton = '';
        $scope.createButton = '';
        $scope.updateForm = '';
        $scope.tipoBarrdb = {};
        $scope.enableAddIni = true;

        $scope.showBarrForm2 = function() {
            var tipo = $scope.newBarreno.nam || $scope.editBarreno.id;
            tipolocalDB.get(tipo).then(function(doc) {
                // handle doc
                //alert('yes');
                $scope.tipoBarrdb = doc;
                $scope.updateForm = 'Yes';
                $scope.updateButton = 'Yes';
                $scope.reloadButton = '';
                $scope.createButton = '';
                $scope.DisableUpdateButton = true;



            }).catch(function(err) {
                console.log(err);
                // alert('no');
                $scope.updateForm = '';
                $scope.updateButton = '';
                $scope.createButton = 'Yes';
                $scope.barrForm = 'Yes';
                $scope.DisableSaveButton = true;
            });
            $scope.showTipoprodbarrAct = false;

        }
        $scope.updateBarrenoNam = function(obj) {
            $scope.tipoBarrNam_u = obj;
            $scope.tipoBarrNam = $scope.tipoBarrNam_u || $scope.editBarreno.id;
            $scope.tipoID = obj;
            $scope.enableCreate = true;
            $scope.showMainform = true;

            console.log('updateBarrenoNam tipobarrnam ' + $scope.tipoBarrNam + 'tipoID ' + $scope.tipoID)
        }
        $scope.tipoBarrNam = $scope.tipoBarrNam_u || $scope.editBarreno.id;
        $scope.cleanTempDB = function() {
            tempDB.allDocs().then(function(result) {
                // Promise isn't supported by all browsers; you may want to use bluebird
                return Promise.all(result.rows.map(function(row) {
                    return tempDB.remove(row.id, row.value.rev);
                }));
            }).then(function() {
                // done! 
                console.log('tempDB cleaned')
            }).catch(function(err) {
                // error!
            });
        }

        $scope.showBarrForm = function() {

            // $scope.tipoBarrNam = $scope.tipoBarrNam_u || $scope.editBarreno.id;

            $scope.loadprojTipos();
            $scope.barrForm = true;
        }

        $scope.tipoprodId = '';
        $scope.showTipoprodbarr = function(obj) {
            $scope.showTipoprodbarrAct = true;
            $scope.tipoprodId = obj.id;

        }
        $scope.showAmountInput = true;
        $scope.getTipoProd = function(obj) {
            console.log(obj);
            $scope.newTipoProd = obj;

            //$scope.showAmountInput = false;
            //$scope.showAddbutton = false; 
            $scope.showCargaForm = false;
            $scope.tipoExplo = obj.tipoid;
            $scope.enableAddProd = false;
        }

        $scope.tipodecarga = 'Fija';
        $scope.getTipoIni = function(obj) {
            console.log(obj);
            $scope.newTipoProd = obj;
            //$scope.showAmountInput = false;
            $scope.showAddbutton = false;

            //s alert($scope.showCargaForm)
        }
        $scope.showCargaForm = true;
        $scope.changeShowCarga = function() {
            $scope.showCargaForm = false;
            $scope.showAddbutton = true;
        }
        $scope.showBarrFormUpdate = function() {
            $scope.barrForm = 'Yes';
            $scope.updateButton = 'Yes';
            $scope.createButton = '';
            $scope.reloadButton = '';
            var id = $scope.projID;
            localprojDB.get(id).then(function(doc) {
                $scope.projTiposUpdate = doc.tipos;
                console.log('projtiposthing' + doc.tipos)
                $scope.tipoBarrNam = $scope.tipoBarrNam_u || $scope.editBarreno.id;
                var selectedID = $scope.tipoBarrNam;
                var rows = $scope.projTipos;
                for (var i = 0; i < $scope.projTipos.length; i++) {
                    if ($scope.projTipos[i]._id == $scope.tipoBarrNam) {
                        $scope.projTipos.splice(i, 1); // removes the matched element
                        i = $scope.projTipos.length; // break out of the loop. Not strictly necessary
                    }
                }

                // }
            });
        }
        $scope.tipodecarga_u = '';
        $scope.tipodecarga = '';
        $scope.tipoprodchange = function(obj) {
            console.log(obj)
            console.log($scope.tipodecarga)


        };
        $scope.taco = 0;
        $scope.tacoini = 0;
        $scope.aire = 0;
        $scope.bordo = 0;
        $scope.espaciamiento = 0;
        $scope.changeTipoCarga = function(obj) {
            console.log(obj)
            console.log($scope.tipodecarga)
            $scope.tipodecarga_u = obj;
        };
        $scope.updateTaco = function(obj) {
            console.log(obj)
            console.log($scope.taco)

            $scope.taco_u = obj;
        };
        $scope.updateTacoIni = function(obj) {
            console.log(obj)
            console.log($scope.tacoini)

            $scope.tacoini_u = obj;
        };
        $scope.updateAire = function(obj) {
            console.log(obj)
            console.log($scope.aire)
            $scope.aire_u = obj;
        };
        //$scope.cantprod = 1;
        $scope.cantprod_u = 0;
        $scope.cantprodgra_u = 0;
        $scope.showAddbutton = true;

        $scope.enableAddIni = true;
        $scope.cantini_u = 0;
        $scope.updateCantIni = function(obj) {
            console.log(obj)

            $scope.cantini_u = obj;
            $scope.enableAddIni = false;

        };
        $scope.updateCant = function(obj) {
            console.log(obj)
            console.log($scope.cantprod)
            $scope.cantprod_u = obj;
            $scope.enableAddProd = false;

        };

        $scope.updateCantGra = function(obj) {
            console.log(obj)
            console.log($scope.cantprodgra)
            $scope.cantprodgra_u = obj;
            $scope.enableAddProd = false;

        };

        $scope.updateBordo = function(obj) {
            console.log(obj)
            console.log($scope.bordo)
            $scope.bordo_u = obj;
        };
        $scope.updateEspaciamiento = function(obj) {
            console.log(obj)
            console.log($scope.espaciamiento)
            $scope.espaciamiento_u = obj;
        };
        //$scope.diametro = 
        $scope.subperf = 0.5;
        $scope.updateDiametro = function(obj) {
            console.log(obj)
            console.log($scope.diametro)
            $scope.diametro_u = obj;
        };
        $scope.updateSubperf = function(obj) {
            console.log(obj)
            console.log($scope.subperf)
            $scope.subperf_u = obj;
        };
        $scope.selectProjFunc = function() {
            if ($scope.projID != '') {
                var proj = $scope.projID;
                localprojDB.get(proj).then(function(doc) {
                    $scope.selectedProj = doc;
                    console.log(doc)
                    $scope.tipos = doc.tipos;
                    $scope.projTipos = doc.tipos;
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
            $scope.loadprojTipos();
            $scope.selectProjFunc();


        }
        $scope.projTiposAmount = function() {
            for (var i = 0; i < $scope.projTipos.length; i++) {
                var total = $scope.projTipos.length
            }
            return total;
        }



        $scope.changeProjID = function() {
                $scope.projID = '';
            }
            //producto as producto.prod for producto in listed_productos | filter:producto.id=tipoProdv2.id

        $scope.editTipo = function(obj, idx) {

            $scope.tipoEditando = {};
            $scope.newBarreno.nam = obj.id;
            $scope.tipoIndex = idx;
            $scope.tipoID = obj.id;
            $scope.tipoBarrNam = obj.id;
            $scope.editBarrenoStatus = true;
            $scope.barrForm = true;
            $scope.showMainform = true;
            $scope.showBarrForm();
            var tipo = obj.id;
            console.log('Tipo seleccionado para editar: ' + obj.id + ' tipoID ' + $scope.tipoID + ' index ' + idx)

            $scope.tipoEditando = obj

            $scope.selectedTipo_u = $scope.tipoEditando;
            $scope.profcarga = $scope.tipoEditando.prof;
            $scope.peso = $scope.tipoEditando.peso;
            $scope.tacoini = $scope.tipoEditando.tacoini;
            $scope.taco = $scope.tipoEditando.taco;
            $scope.aire = $scope.tipoEditando.aire;
            $scope.bordo = $scope.tipoEditando.bordo;
            $scope.espaciamiento = $scope.tipoEditando.espaciamiento;
            $scope.subperf = $scope.tipoEditando.subperf;
            $scope.densidad = $scope.tipoEditando.densidad;
            $scope.diametro = $scope.tipoEditando.diametro;
            $scope.tipodecarga = $scope.tipoEditando.tipodecarga;
            $scope.carga = $scope.tipoEditando.carga;
            $scope.prods = $scope.tipoEditando.carga;
            $scope.tipoExplo = $scope.tipoEditando.tipoExplo;
            $scope.precorte = $scope.tipoEditando.precorte;

            $scope.profcarga_u = $scope.profcarga;
            $scope.peso_u = $scope.peso;
            $scope.taco_u = $scope.taco;
            $scope.tacoini_u = $scope.tacoini;
            $scope.aire_u = $scope.aire;
            $scope.bordo_u = $scope.bordo;
            $scope.espaciamiento_u = $scope.espaciamiento;
            $scope.subperf_u = $scope.subperf;
            $scope.densidad_u = $scope.densidad;
            $scope.diametro_u = $scope.diametro;
            $scope.tipodecarga_u = $scope.tipodecarga;
            $scope.carga_u = $scope.carga;
            $scope.tacofinal = $scope.taco;
        }
        $scope.reloadListUsers = function() {
            User.listUsers().then(function(response) {
                $scope.listed_productos = response.users;
            });
        }
        $scope.pushingTipoBarreno = function() {
            var subperfo = $scope.subperf_u || $scope.subperf;
            var tipodecarga = $scope.tipodecarga_u;
            var tipo = $scope.tipoBarrNam_u || $scope.editBarreno.id;

            $scope.loadprojTipos();

            var newTipo = {
                id: tipo,
                carga: $scope.prods,
                prof: $scope.LargoTotal,
                peso: $scope.PesoTotal,
                densidad: $scope.DensidadTotal,
                tipodecarga: tipodecarga,
                tacoini: $scope.tacoini_u || 0,
                taco: $scope.taco_u || 0,
                aire: $scope.aire_u || 0,
                bordo: $scope.bordo_u || 0,
                espaciamiento: $scope.espaciamiento_u || 0,
                diametro: $scope.diametro_u,
                subperf: subperfo,
                tipoexplo: $scope.tipoExplo || '',
                precorte: $scope.precorte || '',
            };
            $scope.projTipos.push(newTipo);
            $scope.countTipos = $scope.projTipos.length;
            console.log('hay ' + $scope.countTipos + ' Tipos para subir')
        }
        $scope.insertTipoBarrenos = function() {
            var id = $scope.projID;

            //$scope.pushingTipoBarreno();
            var subperfo = $scope.subperf_u || $scope.subperf;
            var tipodecarga = $scope.tipodecarga_u;
            var tipo = $scope.tipoBarrNam_u || $scope.editBarreno.id;


            //$scope.loadprojTipos();

            var newTipo = {
                id: tipo,
                carga: $scope.prods,
                prof: $scope.LargoTotal,
                peso: $scope.PesoTotal,
                densidad: $scope.DensidadTotal,
                tipodecarga: tipodecarga,
                tacoini: $scope.tacoini_u || 0,
                taco: $scope.taco_u || 0,
                aire: $scope.aire_u || 0,
                bordo: $scope.bordo_u || 0,
                espaciamiento: $scope.espaciamiento_u || 0,
                diametro: $scope.diametro_u,
                subperf: subperfo,
                tipoexplo: $scope.tipoExplo || '',
                precorte: $scope.precorte || '',
            };
            $scope.projTipos.push(newTipo);
            $scope.countTipos = $scope.projTipos.length;
            console.log('hay ' + $scope.countTipos + ' Tipos para subir')
            console.log('se va a subir tipos a ' + id)

            localprojDB.get(id).then(function(doc) {

                return localprojDB.put({
                    _id: id,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: doc.barrenos,
                    tipos: $scope.projTipos,
                    productos: doc.productos,
                    muestras: doc.muestras,
                    datagral: doc.datagral,
                }).catch(function(err) {
                    console.log(err);
                });
            });
            localprojDB.sync(remoteprojDB).on('complete', function() {
                // yay, we're in sync!

            }).on('error', function(err) {
                // boo, we hit an error!
            });
            // $scope.loadprojTipos();

            // $state.go('menu.parametrosVoladura1', { 'proj': $scope.projID });
            $scope.showMainform = false;

        }
        $scope.deleteTipo = function(index) {
            var id = $scope.projID;
            $scope.projTipos.splice(index, 1);
            // $scope.removeChoice(obj.prod, prods);
            // $scope.prods = prods;
            console.log('Tipo deleted');
            //$scope.$apply();



            localprojDB.get(id).then(function(doc) {
                return localprojDB.put({
                    _id: id,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: doc.barrenos,
                    tipos: $scope.projTipos,
                    productos: doc.productos,
                    muestras: doc.muestras,
                    datagral: doc.datagral,


                }).catch(function(err) {
                    console.log(err);
                });
            });
        }
        $scope.deleteProd = function(index) {

            $scope.prods.splice(index, 1);
            // $scope.removeChoice(obj.prod, prods);
            // $scope.prods = prods;
            console.log('Prod deleted');
            //$scope.$apply();
        }
        $scope.removeChoice = function(itemId, array, index) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id === itemId) {
                    array.splice(index, 1);
                    break;
                }
            }
        };
        $scope.addChoice = function(index) {
            var id = vm.items[index].choices.length + 1;
            vm.items[index].choices.push({
                id: id,
                req_goods: "",
                qty: 0
            });
        };


        $scope.updateTipoBarrenos = function() {

            let tempDB = new pouchDB('temp');

            var tipos = $scope.tipos;
            var subperfo = $scope.subperf_u || $scope.subperf;
            var tipodecarga = $scope.tipodecarga_u;
            var tipo = $scope.tipoID || $scope.tipoBarrNam;
            var id = $scope.projID;
            $scope.tiposUpdate = [];
            $scope.projTiposUpdate = [];

            console.log('Actualizando Tipo ' + tipo)

            $scope.removeChoice(tipo, $scope.projTipos, $scope.tipoIndex);
            var newTipo = {
                id: tipo,
                carga: $scope.prods,
                prof: $scope.LargoTotal,
                peso: $scope.PesoTotal,
                densidad: $scope.DensidadTotal,
                tipodecarga: tipodecarga,
                tacoini: $scope.tacoini_u,
                taco: $scope.taco_u,
                aire: $scope.aire_u,
                bordo: $scope.bordo_u,
                espaciamiento: $scope.espaciamiento_u,
                diametro: $scope.diametro_u,
                subperf: subperfo,
                tipoexplo: $scope.tipoExplo,
                precorte: $scope.precorte,
            }
            $scope.projTipos.push(newTipo);

            console.log('Actualizando Proyecto ' + id)
            localprojDB.get(id).then(function(doc) {
                return localprojDB.put({
                    _id: id,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: doc.barrenos,
                    tipos: $scope.projTipos,
                    productos: doc.productos,
                    muestras: doc.muestras,
                    datagral: doc.datagral,



                }).then(function(response) {
                    // handle response

                    console.log('subio la bd  ' + response);
                }).catch(function(err) {
                    console.log(err);
                });

            });
            $scope.tipoID = '';
            $scope.showMainform = false;

            console.log('Se actualizo el Tipo ' + tipo)
            localprojDB.sync(remoteprojDB).on('complete', function() {
                // yay, we're in sync!

            }).on('error', function(err) {
                // boo, we hit an error!
            });
            // $scope.loadprojTipos();
            //  $state.go('menu.parametrosVoladura1', { 'proj': $scope.projID, });



        }


        $scope.showtipoEditthing = function() {
            console.log('editBarreno.status ' + $scope.editBarrenoStatus + ' tipoID ' + $scope.tipoID)
        }

        //suma total Largo
        $scope.getLargoTotal = function() {
            var total = 0;
            for (var i = 0; i < $scope.prods.length; i++) {
                var product = $scope.prods[i];
                var cantidad = product.cantidad || product.cantidad_gra || product.cantidad_ini;

                total += (product.largo / 1 * cantidad);
                $scope.LargoTotal = total;
            }
            return total;
        }

        //suma total Peso granel
        $scope.getPesoGra = function() {
            var total = 0;

            for (var i = 0; i < $scope.prods.length; i++) {

                var product = $scope.prods[i];
                var cantidad = product.cantidad || product.cantidad_gra || product.cantidad_ini || 1;
                total += (product.peso / 1 * cantidad);
                $scope.PesoTotal = total;
            }
            return total;

        }
        $scope.getDensidad = function() {
            var total = 0;
            for (var i = 0; i < $scope.prods.length; i++) {

                var product = $scope.prods[i];
                //var cantidad = product.cantidad || product.cantidad_gra || product.cantidad_ini;
                total += (product.densidad);
                $scope.DensidadTotal = total;
            }
            return total;

        }

        //suma total Generico
        $scope.getTotal = function() {
            var total = 0;
            for (var i = 0; i < $scope.prods.length; i++) {
                var product = $scope.prods[i];
                total += (product.diametro);
            }
            return total;
        }

        $scope.selectedProd = {
            //'paramid': $scope.listed_params[0].id,
            //'param': $scope.listed_params[0].tipo,
            'id': $scope.listed_productos[0].id,
            'tipoid': $scope.listed_productos[0].tipoid,
            'tipo': $scope.listed_productos[0].tipo,
            'prod': $scope.listed_productos[0].prod,
            'peso': $scope.listed_productos[0].peso,
            'diametro': $scope.listed_productos[0].diametro,
            'largo': $scope.listed_productos[0].largo,
        }


        $scope.selectedParam = {
            'param': ''
        }


        $scope.newProdnam = '';

        $scope.newProdold = {


            'id': $scope.selectedProd.id,
            'tipoid': $scope.selectedProd.tipoid,
            'tipo': $scope.selectedProd.tipo,
            'prod': $scope.selectedProd.prod,
            'peso': ($scope.selectedProd.peso / 1) * $scope.cantprod_u,
            'diametro': $scope.selectedProd.diametro,
            'largo': ($scope.selectedProd.largo / 1) * $scope.cantprod_u,
            'densidad': ($scope.selectedProd.densidad) / 1,

        }

        $scope.newBarreno = [];
        //crea producto nuevo en lista

        $scope.enableAddProd = true;
        $scope.add = function(obj) {

            var newProd = {
                    'id': obj.id,
                    'tipoid': obj.tipoid,
                    'tipo': obj.tipo,
                    'prod': obj.prod,
                    'peso': (obj.peso / 1),
                    'diametro': obj.diametro,
                    'largo': (obj.largo / 1),
                    'densidad': (obj.densidad) / 1,
                    'cantidad': $scope.cantprod_u / 1,
                    'cantidad_gra': $scope.cantprodgra_u / 1,
                    'tipodecarga': $scope.tipodecarga_u,


                }
                // $scope.prods.nam.push('blahblah');
            $scope.prods.push(newProd);
            $scope.showAddbutton = true;
            $scope.showAmountInput = true;
            $scope.enableAddProd = true;
        }
        $scope.addIni = function(obj, cant) {
                console.log(cant)
                var newProd = {
                        'id': obj.id,
                        'tipoid': obj.tipoid,
                        'tipo': obj.tipo,
                        'prod': obj.prod,
                        'peso': (obj.peso / 1),
                        'diametro': obj.diametro,
                        'largo': (obj.largo / 1),
                        'densidad': (obj.densidad) / 1,
                        'cantidad_ini': cant,
                        'tipodecarga': $scope.tipodecarga_u,


                    }
                    // $scope.prods.nam.push('blahblah');
                $scope.prods.push(newProd);
                $scope.showAddbutton = true;
                $scope.showAmountInput = true;
                $scope.enableAddProd = true;
            }
            //$scope.newTipoBar = [];
        $scope.addTipoBar = function(newBarreno) {
            $scope.newTipoBar.push(newBarreno);

        }
        $scope.newTipoBar = {
            'nam': '',
            'carga': []
        }




        //update Tipo de Barreno  

        $scope.updateType = function() {
                var subperfo = $scope.subperf_u || $scope.subperf;
                var tipodecarga = $scope.tipodecarga_u;
                var tipo = $scope.tipoBarrNam_u || $scope.editBarreno.id;
                tipolocalDB.get(tipo).then(function(doc) {

                    //doc._id= $scope.newBarreno.nam;
                    doc.rev = doc._rev;
                    doc.carga = $scope.prods;
                    doc.prof = $scope.LargoTotal;
                    doc.peso = $scope.PesoTotal;
                    doc.densidad = $scope.DensidadTotal;
                    doc.tipodecarga = tipodecarga;
                    doc.tacoini = $scope.tacoini_u || 0;
                    doc.taco = $scope.taco_u || 0;
                    doc.aire = $scope.aire_u || 0;
                    doc.bordo = $scope.bordo_u || 0;
                    doc.espaciamiento = $scope.espaciamiento_u || 0;
                    doc.diametro = $scope.diametro_u;
                    doc.subperf = subperfo;
                    return tipolocalDB.put(doc);
                }).then(function() {
                    return tipolocalDB.get(tipo);
                    // handle response
                }).catch(function(err) {
                    console.log(err);
                });






                $scope.DisableSaveButton = false
                tipolocalDB.sync(tiporemoteDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });
                $scope.reloadButton = 'Yes'
                $scope.updateButton = '';
                $scope.createButton = '';
            }
            //create tipo de barreno
        $scope.createType = function() {
            var tipodecarga = $scope.tipodecarga_u;
            var subperfo = $scope.subperf_u || $scope.subperf;
            var tipo = $scope.tipoBarrNam_u || $scope.editBarreno.id;
            var newTipo = {
                _id: tipo,
                carga: $scope.prods,
                prof: $scope.LargoTotal,
                peso: $scope.PesoTotal,
                densidad: $scope.DensidadTotal,
                tipodecarga: tipodecarga,
                tacoini: $scope.tacoini_u || 0,
                taco: $scope.taco_u || 0,
                aire: $scope.aire_u || 0,
                bordo: $scope.bordo_u || 0,
                espaciamiento: $scope.espaciamiento_u || 0,
                diametro: $scope.diametro_u,
                subperf: subperfo,
            }
            $scope.projTipos.push(newTipo);
            tipolocalDB.put({
                _id: $scope.newBarreno.nam,
                carga: $scope.prods,
                prof: $scope.LargoTotal,
                peso: $scope.PesoTotal,
                densidad: $scope.DensidadTotal,
                tipodecarga: tipodecarga,
                tacoini: $scope.tacoini_u || 0,
                taco: $scope.taco_u || 0,
                aire: $scope.aire_u || 0,
                bordo: $scope.bordo_u || 0,
                espaciamiento: $scope.espaciamiento_u || 0,
                diametro: $scope.diametro_u,
                subperf: subperfo,

            }).then(function(response) {
                // handle response

                console.log(err);
            });

            $scope.DisableSaveButton = false

            tipolocalDB.sync(tiporemoteDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
            $scope.reloadButton = 'Yes'
            $scope.updateButton = '';
            $scope.createButton = '';
        }

        $scope.reloadPage = function() {
            $state.go('menu.ajustarCSVCtrl', { 'proj': $scope.projID });

        }

        $scope.saveTipoLocal = function(item) {
            // $scope.TipoLocal = $window.localStorage['tipobarr'] || [];
            $scope.TipoLocal.push(item);
            $scope.barrForm = false;
            $scope.prods = [];
            //$scope.TipoLocal = $scope.TipoLocala;
            // $scope.TipoLocalLoad  = '';
            //

            // $scope.TipoLocalLoad=[];
        }

        $scope.addToLocal = function() {
            //$scope.TipoLocal = JSON.parse($window.localStorage['tipobarr']) 
            //$scope.TipoLocalPar = $window.localStorage['tipobarr']


        }






        $scope.produ = Productos.keys;
        $scope.itemChanged = function() {

            $scope.selectedProd = {
                'id': $scope.listed_productos[0].id,
                'tipo': $scope.listed_productos[0].tipo,
                'prod': $scope.listed_productos[0].prod,
                'peso': $scope.listed_productos[0].peso,
                'diametro': $scope.listed_productos[0].diametro,
                'largo': $scope.listed_productos[0].largo,
            }

        }



        $scope.addProd = function() {
            $scope.productos.$add({
                producto: $scope.data.producto,
                iniciador: $scope.data.iniciador

            });
            $scope.data.producto = $scope.listed_productos[0].id;
            $scope.data.iniciador = $scope.listed_iniciadores[0].id;

        };


        //Filtra productos por ID
        $scope.params = $stateParams;

        $scope.surveys = [];

        $scope.loadData = function() {

                if ($scope.params.id || $scope.params.status) {
                    Survey.query($scope.params).then(function(res) {
                        $scope.surveys = res;
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                } else {
                    Survey.all().then(function(res) {
                        $scope.surveys = res;
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }

            }
            //filter dat
        $scope.prodFilter = function(id) {
            return id === $scope.data.producto;
        };
        $scope.gotoPage = function() {
            $state.go('menu.editarVoladuraMapa', { 'proj': $scope.projID });
        }

    }
])

.controller('editarVoladuraMapaCtrl', ['$scope', '$stateParams', '$window', '$state', '$filter', 'pouchDB', 'Excel', '$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $window, $state, $filter, pouchDB, Excel, $timeout) {
        //tipo as tipo.tipo for tipo in newTipoBars
        //$scope.Math = window.Math;

        //eblast 95e8e3fcb47664acac7c204ccc23ad7ff774deab
        //barrenos 8061ba7e4cd3b34bd5d3f7ab8b0c36b77eec6400    otedgeorthatenisestreent
        //Load BD de de Proyectos y sus caracteristicas

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
        }).then('complete', function() {
            localprojDB.sync(remoteprojDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
        })

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
            console.log(doc.tipos)

        }).catch(function(err) {
            console.log(err);
            // alert('no');
            $scope.showForm2 = true;
            $scope.projExists = false;

        });
        var proj = $scope.projID;
        localprojDB.get(proj).then(function(doc) {

            $scope.proj = doc;
            console.log(doc)
            $scope.tipobarr = doc.tipos;
            $scope.Barrenos = [];
            $scope.Barrenos = doc.barrenos;
            console.log(doc.tipos)
        }).catch(function(err) {
            console.log(err);

        });
        $scope.selectProj = function(obj) {
            console.log(obj)
            $scope.selectedproj_u = obj;
            $scope.projID = obj.doc._id;
            var proj = $scope.projID;
            localprojDB.get(proj).then(function(doc) {

                $scope.proj = doc;
                console.log(doc)
                $scope.tipobarr = doc.tipos;
                $scope.Barrenos = doc.barrenos;
                console.log(doc.tipos)
            }).catch(function(err) {
                console.log(err);

            });
        }

        $scope.selectedBarrUpdate = function() {
            var id = $scope.projparam.id
            if (id != '') {
                $scope.searchedbarr = {};
                $scope.searchedbarr = {
                    barr: id
                }


            }
        }
        $scope.selectedBarrUpdate();


        $scope.gotoMenu = function() {
            $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
        }

        $scope.params = $stateParams;

        $scope.surveys = [];
        $scope.tipobar_list = [];

        //count barrenos
        $scope.countUpdatedBarras = function() {

            var rows = $scope.Barrenos;
            var count = 0;
            angular.forEach(rows, function(barreno) {
                count += barreno.status == 'Updated' ? 1 : 0;
            });
            return count;


        }
        $scope.statusFilter = {
            status: 'Pending',
        };
        $scope.incluirName = 'Pendientes'
        $scope.complexFilter = function(obj) {
            console.log(obj)
            if (obj == true) {
                $scope.statusFilter.status = 'Updated'
                $scope.incluirName = 'Trabajados'
                console.log('status ' + $scope.statusFilter.status)
            } else if (obj == false) {
                $scope.statusFilter.status = 'Pending'
                $scope.incluirName = 'Pendientes'
                console.log('status ' + $scope.statusFilter.status)
            }
        }

        $scope.shownewBarrForm = false;

        $scope.updateSelectedBarr = function(obj) {
            console.log(obj)
            console.log($scope.selectedBarreno)
                //alert($scope.selectedBarreno.doc)
                // $scope.selectedbarr_id = obj.id;
            $scope.selectedbarr = obj;
            $scope.profDis = obj.prof;
            $scope.profreal = obj.prof;
            $scope.profreal_u = $scope.profreal;
            $scope.diametro = obj.diam;
            $scope.diametro_u = $scope.diametro;
            $scope.coordx = obj.coordx / 1;
            $scope.coordy = obj.coordy / 1;
            $scope.coordx_u = $scope.coordx;
            $scope.coordy_u = $scope.coordy;

            //count barrenos
            $scope.message = "Presione Agregar Barreno"
            $scope.shownewBarrForm = true;
            $scope.calc();

        };
        $scope.updateSelectedBarr2 = function(obj) {
            console.log(obj)
            console.log($scope.selectedBarreno)
                //alert($scope.selectedBarreno.doc)
            $scope.selectedbarr_id = obj.doc._id;
            $scope.selectedbarr = obj.doc;
            $scope.profreal = obj.doc.prof;
            $scope.profreal_u = $scope.profreal;
            $scope.diametro = obj.doc.diam;
            $scope.diametro_u = $scope.diametro;
            $scope.coordx = obj.doc.coordx / 1;
            $scope.coordy = obj.doc.coordy / 1;
            $scope.coordx_u = $scope.coordx;
            $scope.coordy_u = $scope.coordy;


        };
        $scope.updateSelectedNewBarr = function(obj, nam) {
            console.log(obj)
            console.log($scope.selectedBarreno)
                //alert($scope.selectedBarreno.doc)

            //$scope.selectedbarr_id = $scope.newBarrnam;
            $scope.selectedbarr = obj;
            $scope.profreal = obj.prof;
            $scope.profreal_u = $scope.profreal;
            $scope.diametro = obj.diam;
            $scope.diametro_u = $scope.diametro;
            $scope.coordx = (obj.coordx / 1) + 0.1;
            $scope.coordy = (obj.coordy / 1) + 0.1;
            $scope.coordx_u = $scope.coordx;
            $scope.coordy_u = $scope.coordy;

            //$scope.message = "Guardar para Continuar";
            var newDataBarr = {
                //'id': $scope.selectedbarr.id,
                'barr': nam,
                'prof': $scope.profDis || 0,
                'diam': obj.diam || 0,
                'tipo': $scope.selectedTipo_u,
                'profreal': $scope.profreal_u,
                'coordx': $scope.coordx_u,
                'coordy': $scope.coordy_u,
                'taco': $scope.taco_u,
                'tacoini': $scope.tacoini_u,
                'aire': $scope.aire_u,
                'bordo': $scope.bordo_u,
                'espaciamiento': $scope.espaciamiento_u,
                'diametro': $scope.diametro_u,
                'densidad': $scope.densidad_u,
                'status': "Updated",
                'calcs': $scope.calcVals,
                'cargas ': $scope.cargas,
                'iniciadores ': $scope.iniciadores,
                'tacofinal ': $scope.tacofinal,
            }
            $scope.Barrenos.push(newDataBarr);
            console.log(newDataBarr)
            localprojDB.get(id).then(function(doc) {

                return localprojDB.put({
                    _id: id,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: $scope.Barrenos,
                    tipos: doc.tipos,
                    productos: doc.productos,
                    muestras: doc.muestras,
                    datagral: doc.datagral,
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

            // $scope.showCoord = false;

            $scope.dataChartBarrs()

        };






        $scope.selectnewBarr = function(obj) {
            console.log(obj)
            $scope.selectedBarreno = obj;


        }
        $scope.enableResults = false;
        $scope.enableCalc = false;
        $scope.carga_u = [];
        $scope.tipodecarga = '';
        $scope.updateSelectedTipo = function(obj) {
            console.log(obj)
            console.log($scope.selectedTipo)
            $scope.selectedTipo_u = obj;
            $scope.profcarga = obj.prof / 1;
            $scope.peso = obj.peso / 1;
            $scope.tacoini = obj.tacoini / 1;
            $scope.taco = obj.taco / 1;
            $scope.aire = obj.aire / 1;
            $scope.bordo = obj.bordo / 1;
            $scope.espaciamiento = obj.espaciamiento / 1;
            $scope.subperf = obj.subperf / 1;
            $scope.densidad = (+(obj.densidad / 1).toFixed(2));
            $scope.diametro = (obj.diametro / 1) || $scope.diametro;
            $scope.tipodecarga = obj.tipodecarga;
            $scope.carga = obj.carga;
            $scope.tipoExplo = obj.tipoexplo;
            $scope.precorte = obj.precorte;

            $scope.profcarga_u = $scope.profcarga;
            $scope.peso_u = $scope.peso;
            $scope.taco_u = $scope.taco;
            $scope.tacoini_u = $scope.tacoini;
            $scope.aire_u = $scope.aire;
            $scope.bordo_u = $scope.bordo;
            $scope.espaciamiento_u = $scope.espaciamiento;
            $scope.subperf_u = $scope.subperf;
            $scope.densidad_u = $scope.densidad;
            $scope.diametro_u = $scope.diametro;
            $scope.tipodecarga_u = $scope.tipodecarga;
            $scope.carga_u = $scope.carga;
            $scope.tacofinal = $scope.taco;

            if ($scope.tipodecarga_u == 'Variable') {

                if ($scope.tipoExplo == 'ce') {

                    $scope.calc = function() {
                        $scope.calcVarEmp();

                        console.log('Se calculo Carga Variable con Explosivo Empacado ')
                    }
                } else if ($scope.tipoExplo == 'cg') {

                    $scope.calc = function() {
                        $scope.calcVarGra();
                        console.log('Se calculo Carga Variable con Explosivo a Granel ')
                    }
                } else {
                    $scope.tempTipoExplo = 'N/A'
                }

            } else if ($scope.tipodecarga_u == 'Fija') {
                if ($scope.tipoExplo == 'ce') {
                    $scope.calc = function() {
                        $scope.calcFijEmp();
                        console.log('Se calculo Carga Fija con Explosivo Empacado ')
                    }
                } else if ($scope.tipoExplo == 'cg') {
                    $scope.calc = function() {
                        $scope.calcFijGra();
                        console.log('Se calculo Carga Fija con Explosivo a Granel ')
                    }
                } else {
                    $scope.tempTipoExplo = 'N/A'
                }
            }
            $scope.enableCalc = true;
            $scope.enableResults = true;
            $scope.calc();

        }


        //suma total Peso granel
        $scope.getPesoGra = function() {
            var total = 0;
            for (var i = 0; i < $scope.prods.length; i++) {
                var product = $scope.prods[i];
                total += (product.peso);
                $scope.PesoTotal = total;
            }
            return total;

        }
        $scope.getDensidad = function() {
            var total = 0;
            for (var i = 0; i < $scope.prods.length; i++) {
                var product = $scope.prods[i];
                total += (product.densidad);
                $scope.DensidadTotal = +(total).toFixed(2);
            }
            return total;

        }
        $scope.updateCoordx = function(obj, barr) {
            console.log(obj)
            console.log($scope.coordx)
            $scope.coordx_u = obj;
            $scope.coordx = obj;
            dataChartBarrs();


        };
        $scope.updateCoordy = function(obj) {
            console.log(obj)
            console.log($scope.coordy)
            $scope.coordy_u = obj;
        };
        $scope.showProfDis = false;
        $scope.updateProfReal = function(obj) {
            console.log(obj)
            $scope.profreal = obj;
            $scope.profreal_u = obj;

            $scope.showProfDis = true;
            $scope.calc();

        };
        $scope.updateLdecarga = function(obj) {
            console.log(obj)
            console.log($scope.ldecarga)
            $scope.ldecarga_u = obj;
            $scope.profcarga_u = obj;
            $scope.calc();
        };
        $scope.updatePeso = function(obj) {
            console.log(obj)
            console.log($scope.peso)
            $scope.peso_u = obj;
            $scope.calc();
        };
        $scope.updateProf = function(obj) {
            console.log(obj)
            console.log($scope.profcarga)
            $scope.profcarga_u = obj;
            $scope.calc();
        };
        $scope.updateTaco = function(obj) {
            console.log(obj)
            console.log($scope.taco)
            $scope.taco_u = obj;
            $scope.calc();
        };
        $scope.updateTacoIni = function(obj) {
            console.log(obj)
            console.log($scope.tacoini)
            $scope.tacoini_u = obj;
            $scope.calc();
        };
        $scope.updateAire = function(obj) {
            console.log(obj)
            console.log($scope.aire)
            $scope.aire_u = obj;
        };

        $scope.updateBordo = function(obj) {
            console.log(obj)
            console.log($scope.bordo)
            $scope.bordo_u = obj;
            $scope.calc();
        };
        $scope.updateEspaciamiento = function(obj) {
            console.log(obj)
            console.log($scope.espaciamiento)
            $scope.espaciamiento_u = obj;
            $scope.calc();
        };
        $scope.updateDiametro = function(obj) {
            console.log(obj)
            console.log($scope.diametro)
            $scope.diametro_u = obj;
            $scope.calc();
        };
        $scope.updateSubperf = function(obj) {
            console.log(obj)
            console.log($scope.subperf)
            $scope.subperf_u = obj;
            $scope.calc();
        };
        $scope.updateSelectedProdGra = function(obj) {
            console.log(obj)
            console.log($scope.selectedProdGra)
            $scope.prodgra_u = obj.doc;
            $scope.calc();
        };


        $scope.updateCargagra = function(obj) {
            console.log(obj)
            console.log($scope.cargaAgranel)
            $scope.cargaAgranel = obj;
            $scope.calc();
        };
        $scope.updateBarrid = function(obj) {
            console.log(obj)
            console.log($scope.newBarrnam)

            $scope.newBarrnam = 'N-' + obj;
            $scope.message = 'Seleccione el Barreno más cercano para copiar parámetros';
            $scope.showCoord = true;
            $scope.calc();
        };

        $scope.hideCalcs = false;
        //Calculos de Barrenos
        $scope.calcVarGra = function() {
            var calcCargasVar = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo !== 'Iniciadores') {
                        val.peso += carga.peso / 1;
                        val.largo += carga.largo / 1;

                        val.cantidad = carga.cantidad_gra;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.cargasVal = val;

            }


            var calcCargasIni = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo === 'Iniciadores') {
                        val.peso += carga.peso / 1 * carga.cantidad_ini / 1;
                        val.largo += carga.largo / 1 * carga.cantidad_ini / 1;
                        val.cantidad += carga.cantidad_ini;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.iniVal = val;

            }
            $scope.cargasVar = calcCargasVar();
            $scope.iniciadores = calcCargasIni();
            //definicion de variables

            var L = $scope.profreal_u; //Largo real (L) 
            var D = $scope.diametro_u || $scope.diametro; //Diámetro (D) =
            var Tf = $scope.taco_u; //Taco final (Tf) = 
            var Ta = $scope.aire; //Taco aire (Ta) =
            //Iniciador 
            var Li = $scope.iniciadores.largo //Largo iniciador (Li) =
            var Ci = $scope.iniciadores.peso //Peso del iniciador (Ci) =
            var ci = $scope.iniciadores.cantidad //Cant de iniciadores (ci) =
                //Carga Variable
            var d = $scope.densidad_u //Densidad Carga Var (d) =
            var B = $scope.bordo_u //Bordo (B) =
            var Es = $scope.espaciamiento_u //Espaciamiento (Es) =
            var s = $scope.subperf_u //Sub-excavación (s) =
            var Lc = L - Tf - Ta - ((ci * Li));
            var Vc = 3.1416 * ((D / 2) * (D / 2)) //* L * 1000;
            var Cm = Vc * d / 1000;
            var Ct = Cm * Lc;
            var V = B * Es * (L - s);
            var Pt = Ct + (Ci * ci);
            var Fc = Ct / V;

            console.log('Valores a Calcular ' +
                'L ' + L +
                ' D ' + D +
                ' Tf ' + Tf +
                ' Ta ' + Ta +
                ' Li ' + Li +
                ' Ci ' + Ci +
                ' ci ' + ci +
                ' d ' + d +
                ' B ' + B +
                ' Es ' + Es +
                ' s ' + s);

            $scope.calcVals = {
                L: L,
                D: D,
                Tf: Tf,
                Ta: Ta,
                Li: Li,
                Ci: Ci,
                ci: ci,
                d: d,
                B: B,
                Es: Es,
                s: s,
                Lc: Lc,
                Cm: Cm,
                Ct: +(Ct).toFixed(2),
                V: V,
                Pt: Pt,
                Fc: Fc

            }

            console.log('Paso1 Cálculo del largo de la carga' +
                ' Lc ' + Lc
            );

            console.log('Paso2 Cálculo del volumen de un cilindro en 1 metro' +
                ' Vc ' + Vc
            );

            console.log('Paso3 Cálculo de Carga x metro' +
                ' Cm ' + Cm
            );
            console.log('Paso 4 - Carga total de la carga variable' +
                ' Ct ' + Ct
            );
            console.log('Paso 5 - Cálculo del volumen del barreno' +
                ' V ' + V
            );
            console.log('Paso 6 - Peso total de la carga' +
                ' Pt ' + Pt
            );
            console.log('Paso 7 - Factor de carga' +
                ' Fc ' + Fc
            );
        }

        $scope.calcVarEmp = function() {
            var calcCargasVar = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo !== 'Iniciadores') {
                        val.peso += carga.peso;
                        val.largo += carga.largo;

                        val.cantidad = carga.cantidad_gra;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.cargasVal = val;

            }


            var calcCargasIni = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo === 'Iniciadores') {
                        val.peso += carga.peso / 1 * carga.cantidad_ini / 1;
                        val.largo += carga.largo / 1 * carga.cantidad_ini / 1;
                        val.cantidad += carga.cantidad_ini;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.iniVal = val;

            }
            $scope.cargasVar = calcCargasVar();
            $scope.iniciadores = calcCargasIni();
            //definicion de variables

            var L = $scope.profreal_u; //Largo real (L) 
            var D = $scope.diametro_u || $scope.diametro; //Diámetro (D) =
            var Tf = $scope.taco_u; //Taco final (Tf) = 
            var Ta = $scope.aire; //Taco aire (Ta) =
            //Iniciador 
            var Li = $scope.iniciadores.largo //Largo iniciador (Li) =
            var Ci = $scope.iniciadores.peso //Peso del iniciador (Ci) =
            var ci = $scope.iniciadores.cantidad //Cant de iniciadores (ci) =
                //Carga Variable
            var d = $scope.densidad_u //Densidad Carga Var (d) =
            var B = $scope.bordo_u //Bordo (B) =
            var Es = $scope.espaciamiento_u //Espaciamiento (Es) =
            var s = $scope.subperf_u //Sub-excavación (s) =
            var Lv = $scope.cargasVar.largo //Largo Carga Var
            var Pe = $scope.cargasVar.peso // Peso UN empacado
            var Lc = L - Tf - Ta - ((ci * Li));
            var Vc = 3.1416 * ((D / 2) * (D / 2)) //* L * 1000;
            var Cm = (1 / (Lv)) * Pe;
            var Ct = Cm * Lc;
            var V = B * Es * (L - s);
            var Pt = Ct + (Ci * ci);
            var Fc = Ct / V;
            $scope.calcVals = {
                L: L,
                D: D,
                Tf: Tf,
                Ta: Ta,
                Li: Li,
                Ci: Ci,
                ci: ci,
                d: d,
                B: B,
                Es: Es,
                s: s,
                Lv: Lv,
                Pe: Pe,
                V: V,
                Ct: +(Ct).toFixed(2),
                Pt: Pt,
                Fc: Fc
            }
            console.log('Valores a Calcular ' +
                'L ' + L +
                ' D ' + D +
                ' Tf ' + Tf +
                ' Ta ' + Ta +
                ' Li ' + Li +
                ' Ci ' + Ci +
                ' ci ' + ci +
                ' d ' + d +
                ' B ' + B +
                ' Es ' + Es +
                ' s ' + s +
                ' Lv ' + Lv +
                ' Pe ' + Pe);


            console.log('Paso1 Cálculo del largo de la carga' +
                ' Lc ' + Lc
            );

            // console.log('Paso2 Cálculo del volumen de un cilindro en 1 metro' +
            //  ' Vc ' + Vc
            //);

            console.log('Paso 2 Cálculo de Carga x metro' +
                ' Cm ' + Cm
            );
            console.log('Paso 3 - Carga total de la carga variable' +
                ' Ct ' + Ct
            );
            console.log('Paso 4 - Cálculo del volumen del barreno' +
                ' V ' + V
            );
            console.log('Paso 5 - Peso total de la carga' +
                ' Pt ' + Pt
            );
            console.log('Paso 6 - Factor de carga' +
                ' Fc ' + Fc
            );
        }
        $scope.calcFijGra = function() {
            var calcCargasEmp = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo !== 'Iniciadores') {
                        if (carga.tipo == 'Carga a Granel') {
                            val.peso += 0;
                            val.largo += carga.largo / 1 * carga.cantidad / 1;
                            val.cantidad += carga.cantidad || carga.cantidad_gra;
                            val.prod = carga.prod;
                            val.tipo = carga.tipo;
                            val.pesogra = carga.cantidad || carga.cantidad_gra;
                        } else {
                            val.peso += carga.peso / 1 * carga.cantidad / 1;
                            val.largo += carga.largo / 1 * carga.cantidad / 1;
                            val.cantidad += carga.cantidad || carga.cantidad_gra;
                            val.prod = carga.prod;
                            val.tipo = carga.tipo;
                            val.pesogra = 0;
                        }
                    }
                });
                return val;
                $scope.cargasVal = val;



            }


            var calcCargasIni = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo === 'Iniciadores') {
                        val.peso += carga.peso / 1 * carga.cantidad_ini / 1;
                        val.largo += carga.largo / 1 * carga.cantidad_ini / 1;
                        val.cantidad += carga.cantidad_ini;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.iniVal = val;

            }
            $scope.cargasEmp = calcCargasEmp();
            $scope.iniciadores = calcCargasIni();
            //definicion de variables

            var L = $scope.profreal_u; //Largo real (L) 
            var D = $scope.diametro_u || $scope.diametro; //Diámetro (D) =
            var Tf = $scope.taco_u; //Taco final (Tf) = 
            var Ta = $scope.aire; //Taco aire (Ta) =
            //Iniciador 
            var Li = $scope.iniciadores.largo / $scope.iniciadores.cantidad //Largo iniciador (Li) =
            var Ci = $scope.iniciadores.peso / $scope.iniciadores.cantidad //Peso del iniciador (Ci) =
            var ci = $scope.iniciadores.cantidad //Cant de iniciadores (ci) =
                //Carga Variable
            var d = $scope.densidad_u / $scope.cargasEmp.cantidad //Densidad Carga Var (d) =
            var B = $scope.bordo_u //Bordo (B) =
            var Es = $scope.espaciamiento_u //Espaciamiento (Es) =
            var s = $scope.subperf_u //Sub-excavación (s) =
            var Lv = $scope.cargasEmp.largo //Largo Carga Var
            var Pe = $scope.cargasEmp.peso // Peso UN empacado
            var Lc = $scope.cargasEmp.cantidad //L - Tf - Ta - ((ci * Li));
            var Vc = 3.1416 * ((D / 2) * (D / 2)) // * L *1000
            var Cm = Vc * d / 1000;
            var Ct = Cm * Lc;
            var V = B * Es * (L - s);
            var Pt = Ct + (Ci * ci);
            var Fc = Ct / V;

            console.log('Valores a Calcular ' +
                'L ' + L +
                ' D ' + D +
                ' Tf ' + Tf +
                ' Ta ' + Ta +
                ' Li ' + Li +
                ' Ci ' + Ci +
                ' ci ' + ci +
                ' d ' + d +
                ' B ' + B +
                ' Es ' + Es +
                ' s ' + s +
                ' Lv ' + Lv +
                ' Pe ' + Pe +
                ' Lc ' + Lc);

            $scope.calcVals = {
                L: L,
                D: D,
                Tf: Tf,
                Ta: Ta,
                Li: Li,
                Ci: Ci,
                ci: ci,
                d: d,
                B: B,
                Es: Es,
                s: s,
                Lv: Lv,
                Pe: Pe,
                Lc: Lc,
                Pt: Pt,
                Ct: +(Ct).toFixed(2),
                V: V,
                Fc: Fc
            }

            console.log('Paso1 Cálculo del volumen de un cilindro en 1 metro' +
                ' Vc ' + Vc
            );



            console.log('Paso 2 Cálculo de Carga x metro' +
                ' Cm ' + Cm
            );
            console.log('Paso 3 - Carga total de la carga variable' +
                ' Ct ' + Ct
            );
            console.log('Paso 4 - Cálculo del volumen del barreno' +
                ' V ' + V
            );
            console.log('Paso 5 - Peso total de la carga' +
                ' Pt ' + Pt
            );
            console.log('Paso 6 - Factor de carga' +
                ' Fc ' + Fc
            );
        }
        $scope.calcFijEmp = function() {
            var calcCargasEmp = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo !== 'Iniciadores') {
                        if (carga.tipo == 'Carga a Granel') {
                            val.peso += 0;
                            val.largo += carga.largo / 1 * carga.cantidad / 1;
                            val.cantidad += carga.cantidad || carga.cantidad_gra;
                            val.prod = carga.prod;
                            val.tipo = carga.tipo;
                            val.pesogra = carga.cantidad || carga.cantidad_gra;
                        } else {
                            val.cantidad += carga.cantidad || carga.cantidad_gra;
                            val.peso += carga.peso / 1 * carga.cantidad / 1;
                            val.largo += carga.largo / 1 * carga.cantidad / 1;

                            val.prod = carga.prod;
                            val.tipo = carga.tipo;
                            val.pesogra = 0;
                        }
                    }
                });
                return val;
                $scope.cargasVal = val;



            }


            var calcCargasIni = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo === 'Iniciadores') {
                        val.peso += carga.peso / 1 * carga.cantidad_ini / 1;
                        val.largo += carga.largo / 1 * carga.cantidad_ini / 1;
                        val.cantidad += carga.cantidad_ini;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.iniVal = val;

            }
            $scope.cargasEmp = calcCargasEmp();
            $scope.iniciadores = calcCargasIni();
            //definicion de variables

            var L = $scope.profreal_u; //Largo real (L) 
            var D = $scope.diametro_u || $scope.diametro; //Diámetro (D) =
            var Tf = $scope.taco_u; //Taco final (Tf) = 
            var Ta = $scope.aire; //Taco aire (Ta) =
            //Iniciador 
            var Li = $scope.iniciadores.largo / $scope.iniciadores.cantidad //Largo iniciador (Li) =
            var Ci = $scope.iniciadores.peso / $scope.iniciadores.cantidad //Peso del iniciador (Ci) =
            var ci = $scope.iniciadores.cantidad //Cant de iniciadores (ci) =
                //Carga Variable
            var d = $scope.densidad_u / $scope.cargasEmp.cantidad //Densidad Carga Var (d) =
            var B = $scope.bordo_u //Bordo (B) =
            var Es = $scope.espaciamiento_u //Espaciamiento (Es) =
            var s = $scope.subperf_u //Sub-excavación (s) =
            var Lf = $scope.cargasEmp.largo //Largo Carga Var
            var Pe = $scope.cargasEmp.peso // Peso UN empacado
            var Lc = $scope.cargasEmp.cantidad //L - Tf - Ta - ((ci * Li));
            var Vc = 3.1416 * ((D / 2) * (D / 2)) // * L *1000
            var Cm = Cm = (1 / (Lf)) * Pe;
            var Ct = Cm * Lc;
            var V = B * Es * (L - s);
            var Pt = Ct + (Ci * ci);
            var Fc = Ct / V;

            console.log('Valores a Calcular ' +
                'L ' + L +
                ' D ' + D +
                ' Tf ' + Tf +
                ' Ta ' + Ta +
                ' Li ' + Li +
                ' Ci ' + Ci +
                ' ci ' + ci +
                ' d ' + d +
                ' B ' + B +
                ' Es ' + Es +
                ' s ' + s +
                //' Lv ' + Lv +
                ' Pe ' + Pe +
                ' Lc ' + Lc +
                ' Pt ' + Pt +
                ' Fc ' + Fc);

            $scope.calcVals = {
                    L: L,
                    D: D,
                    Tf: Tf,
                    Ta: Ta,
                    Li: Li,
                    Ci: Ci,
                    ci: ci,
                    d: d,
                    B: B,
                    Es: Es,
                    s: s,
                    // Lv : Lv ,
                    Pe: Pe,
                    Lc: Lc,
                    Pt: Pt,
                    Ct: +(Ct).toFixed(2),
                    V: V,
                    Fc: Fc

                }
                //console.log('Paso1 Cálculo del volumen de un cilindro en 1 metro' +
                //   ' Vc ' + Vc
                //);



            console.log('Paso 1 Cálculo de Carga x metro' +
                ' Cm ' + Cm
            );
            console.log('Paso 2 - Carga total de la carga variable' +
                ' Ct ' + Ct
            );
            console.log('Paso 3 - Cálculo del volumen del barreno' +
                ' V ' + V
            );
            console.log('Paso 4 - Peso total de la carga' +
                ' Pt ' + Pt
            );
            console.log('Paso 5 - Factor de carga' +
                ' Fc ' + Fc
            );
        }
        $scope.calculos = function() {
            var calcCargasEmp = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo !== 'Iniciadores') {
                        if (carga.tipo == 'Carga a Granel') {
                            val.peso += 0;
                            val.largo += carga.largo / 1 * carga.cantidad / 1;
                            val.cantidad += carga.cantidad || carga.cantidad_gra;
                            val.prod = carga.prod;
                            val.tipo = carga.tipo;
                            val.pesogra = carga.cantidad || carga.cantidad_gra;
                        } else {
                            val.peso += carga.peso / 1 * carga.cantidad / 1;
                            val.largo += carga.largo / 1 * carga.cantidad / 1;
                            val.cantidad += carga.cantidad || carga.cantidad_gra;
                            val.prod = carga.prod;
                            val.tipo = carga.tipo;
                            val.pesogra = 0;
                        }
                    }
                });
                return val;
                $scope.cargasVal = val;



            }


            var calcCargasIni = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo === 'Iniciadores') {
                        val.peso += carga.peso / 1 * carga.cantidad_ini / 1;
                        val.largo += carga.largo / 1 * carga.cantidad_ini / 1;
                        val.cantidad += carga.cantidad_ini;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.iniVal = val;

            }
            $scope.cargas = calcCargasEmp();
            $scope.iniciadores = calcCargasIni();
            $scope.peso_u = $scope.cargas.peso || $scope.cargas.pesogra;
            $scope.cantidaddecarga = $scope.cargas.cantidad * 1;
            $scope.areadelbarreno = 3.1416 * ($scope.diametro_u * $scope.diametro_u) / 4;
            $scope.cargaSinAire = $scope.profreal_u - $scope.taco_u;
            $scope.cargaMenosAire = $scope.cargaSinAire - $scope.aire_u;
            $scope.cargaAgraneldisp = $scope.cargaMenosAire - ($scope.profcarga_u);
            $scope.longituddeCarga = $scope.cargaMenosAire;
            $scope.volumenbarr = ($scope.longituddeCarga * 1000) * $scope.areadelbarreno;
            $scope.pesoxmetro = $scope.peso_u * (1000 / $scope.profcarga_u);


            $scope.volumenCil = $scope.volumenbarr;
            $scope.cargaAgranel = $scope.cargas.pesogra || +(((($scope.densidad) / 1000) * ($scope.volumenCil)) / 1000).toFixed(2);

            $scope.pesoenkg = +(((($scope.densidad) / 1000) * ($scope.volumenbarr)) / 1000).toFixed(2);
            $scope.volumenTotalcalc = ($scope.profreal_u - $scope.subperf_u) * ($scope.bordo_u || 0) * ($scope.espaciamiento_u || 0);
            $scope.pesoTotalcalc = Math.round($scope.peso_u + $scope.cargaAgranel);
            $scope.pesoTotalEmpFija = +($scope.longituddeCarga * $scope.pesoxmetro).toFixed(2);
            $scope.pesoFinal = +($scope.cargaAgranel || $scope.pesoTotalEmpFija).toFixed(2);
            $scope.volumenTotal = $scope.volumenTotalcalc;
            $scope.pesoTotal = +($scope.pesoFinal).toFixed(2);
            $scope.factorDeCarga = +($scope.pesoFinal / $scope.volumenTotal).toFixed(2);
            var resultados = {
                'carga': calcCargasEmp(),
                'iniciadores': calcCargasIni(),
                'peso': $scope.peso_u,
                'profdecarga': $scope.profcarga_u,
                'longituddeCarga': $scope.longituddeCarga,
                'area': $scope.areadelbarreno,
                'prof real': $scope.profreal_u,
                'pesoxmetro': $scope.pesoxmetro,
                'cargasinaire': $scope.cargaSinAire,
                'cargamenosaire': $scope.cargaMenosAire,
                'cargadisponible': $scope.cargaAgraneldisp,
                'volumenbarr': $scope.volumenbarr,
                'volumen cilindrico': $scope.volumenCil,
                'carga a granel': $scope.cargaAgranel,
                'pesoempfija': $scope.pesoTotalEmpFija,
                'volumentotal': $scope.volumenTotal,
                'pesoenkg': $scope.pesoenkg,
                'pesototal': $scope.pesoTotal,
                'factor de carga': $scope.factorDeCarga,
            }

            console.log(resultados);
            // Carga a Grandel Disponible *1000*3.1416*(Diametro*Diametro)/4

        }

        $scope.calculosVar = function() {
            var calcCargasVar = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo !== 'Iniciadores') {
                        val.peso += carga.peso / 1 * carga.cantidad_gra / 1;
                        val.largo += carga.largo / 1 * carga.cantidad_gra / 1;
                        val.cantidad == carga.cantidad_gra;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.cargasVal = val;

            }


            var calcCargasIni = function() {

                var rows = $scope.carga_u;
                var val = {
                    'peso': 0,
                    'largo': 0,
                    'cantidad': 0,
                    'prod': '',
                    'tipo': '',
                }

                angular.forEach(rows, function(carga) {
                    if (carga.tipo === 'Iniciadores') {
                        val.peso += carga.peso / 1 * carga.cantidad_ini / 1;
                        val.largo += carga.largo / 1 * carga.cantidad_ini / 1;
                        val.cantidad += carga.cantidad_ini;
                        val.prod = carga.prod;
                        val.tipo = carga.tipo;
                    }
                });
                return val;
                $scope.iniVal = val;

            }
            $scope.cargas = calcCargasVar();
            $scope.iniciadores = calcCargasIni();
            $scope.peso_u = $scope.cargas.peso;
            $scope.cantidaddecarga = $scope.cargas.cantidad * 1;
            $scope.areadelbarreno = 3.1416 * ($scope.diametro_u * $scope.diametro_u) / 4;
            $scope.volumenbarr = ($scope.longituddeCarga * 1000) * $scope.areadelbarreno;
            $scope.pesoxmetro = $scope.peso_u * (1000 / $scope.profcarga_u);
            $scope.cargaSinAire = $scope.profreal_u - $scope.taco_u;
            $scope.cargaMenosAire = $scope.cargaSinAire - $scope.aire_u;
            $scope.cargaAgraneldisp = $scope.cargaMenosAire - ($scope.profcarga_u);
            $scope.longituddeCarga = $scope.cargaMenosAire;

            $scope.volumenCil = $scope.volumenbarr;
            $scope.cargaAgranel = +(((($scope.densidad) / 1000) * ($scope.volumenCil)) / 1000).toFixed(2);

            $scope.pesoenkg = +(((($scope.densidad) / 1000) * ($scope.volumenbarr)) / 1000).toFixed(2);
            $scope.volumenTotalcalc = ($scope.profreal_u - $scope.subperf_u) * ($scope.bordo_u || 0) * ($scope.espaciamiento_u || 0);
            $scope.pesoTotalcalc = Math.round($scope.peso_u + $scope.cargaAgranel)
            $scope.pesoTotalEmpFija = +($scope.longituddeCarga * $scope.pesoxmetro).toFixed(2);
            $scope.pesoFinal = +($scope.cargaAgranel || $scope.pesoTotalEmpFija).toFixed(2);
            $scope.volumenTotal = $scope.volumenTotalcalc;
            $scope.pesoTotal = +($scope.pesoFinal).toFixed(2);
            $scope.factorDeCarga = +($scope.pesoFinal / $scope.volumenTotal).toFixed(2);
            var resultados = {
                'carga': calcCargasVar(),
                'iniciadores': calcCargasIni(),
                'peso': $scope.peso_u,
                'profdecarga': $scope.profcarga_u,
                'longituddeCarga': $scope.longituddeCarga,
                'area': $scope.areadelbarreno,
                'prof real': $scope.profreal_u,
                'pesoxmetro': $scope.pesoxmetro,
                'cargasinaire': $scope.cargaSinAire,
                'cargamenosaire': $scope.cargaMenosAire,
                'cargadisponible': $scope.cargaAgraneldisp,
                'volumenbarr': $scope.volumenbarr,
                'volumen cilindrico': $scope.volumenCil,
                'carga a granel': $scope.cargaAgranel,
                'pesoempfija': $scope.pesoTotalEmpFija,
                'volumentotal': $scope.volumenTotal,
                'pesoenkg': $scope.pesoenkg,
                'pesototal': $scope.pesoTotal,
                'factor de carga': $scope.factorDeCarga,

            }

            console.log(resultados);
            // Carga a Grandel Disponible *1000*3.1416*(Diametro*Diametro)/4

        }
        $scope.barrDetailstoggle = function() {
            $scope.barrDetails = true;
        }

        //agrega valores al barreno
        $scope.updateBarr = function() {


            var id = $scope.projID;
            var selectedID = $scope.selectedbarr.barr;
            var rows = $scope.Barrenos;


            //var index = $scope.Barrenos.barr.indexOf(selectedID)
            //console.log('El indice es'+index)
            //$scope.Barrenos.splice(index,1);     
            // }
            for (var i = 0; i < $scope.Barrenos.length; i++) {
                if ($scope.Barrenos[i].barr == selectedID) {
                    $scope.Barrenos.splice(i, 1); // removes the matched element
                    i = $scope.Barrenos.length; // break out of the loop. Not strictly necessary
                }
            }
            var newDataBarr = {
                //'id': $scope.selectedbarr.id,
                'barr': $scope.selectedbarr.barr,
                'prof': $scope.profDis,
                'diam': $scope.selectedbarr.diam,
                'tipo': $scope.selectedTipo_u,
                'profreal': $scope.profreal_u,
                'coordx': $scope.coordx_u,
                'coordy': $scope.coordy_u,
                'taco': $scope.taco_u,
                'tacoini': $scope.tacoini_u,
                'aire': $scope.aire_u,
                'bordo': $scope.bordo_u,
                'espaciamiento': $scope.espaciamiento_u,
                'diametro': $scope.diametro_u,
                'densidad': $scope.densidad_u,
                'status': "Updated",
                'calcs': $scope.calcVals,
                'cargas ': $scope.cargas,
                'iniciadores ': $scope.iniciadores,
                'tacofinal ': $scope.tacofinal,
            }
            $scope.Barrenos.push(newDataBarr);
            console.log(newDataBarr)
            localprojDB.get(id).then(function(doc) {

                return localprojDB.put({
                    _id: id,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: $scope.Barrenos,
                    tipos: doc.tipos,
                    productos: doc.productos,
                    muestras: doc.muestras,
                    datagral: doc.datagral,
                });
            }).then(function() {
                return localprojDB.get(id);
                // handle response

            }).catch(function(err) {
                console.log(err);
            });

            $scope.shownewBarrForm = false;

            localprojDB.sync(remoteprojDB).on('complete', function() {
                // yay, we're in sync!

            }).on('error', function(err) {
                // boo, we hit an error!
            });



            $scope.message = "El Barreno fue Actualizado.";
            //$scope.showReloadButton = true;
            console.log($scope.message);
            // $state.go('menu.editarVoladuraMapa', { 'proj': $scope.projID, 'status': new Date().toISOString() });


        }



        $scope.message2 = '';
        $scope.showAddNewBarr = true;
        //create a new Barreno
        $scope.addNewBarr = function() {
            $scope.showAddNewBarr = false;
            $scope.showBarrnam = true;
            $scope.message = '';
            $scope.message2 = 'Confirme o Ingrese el nombre del Barreno Nuevo';
            // $scope.newBarrnam = new Date().toISOString();
        }

        $scope.addNewBarrS2 = function(nam, cx, cy) {
            //$scope.showCoord = true;

            console.log('coordenadas x ' + cx + ' y ' + cy)

            $scope.showCoord = true;
            console.log('actualizando barreno ' + nam);

            var newDataBarr = {
                //'id': $scope.selectedbarr.id,
                'barr': 'N-' + nam,
                'prof': $scope.profDis,
                'diam': $scope.selectedbarr.diam,
                //'tipo': $scope.selectedTipo_u,
                'profreal': $scope.profreal_u,
                'coordx': cx,
                'coordy': cy,
                // 'taco': $scope.taco_u,
                //'tacoini': $scope.tacoini_u,
                // 'aire': $scope.aire_u,
                // 'bordo': $scope.bordo_u,
                // 'espaciamiento': $scope.espaciamiento_u,
                // 'diametro': $scope.diametro_u,
                // 'densidad': $scope.densidad_u,
                'status': "Pending",
                //  'calcs': $scope.calcVals,
                //   'cargas ': $scope.cargas,
                //  'iniciadores ': $scope.iniciadores,
                // 'tacofinal ': $scope.tacofinal,
            }
            $scope.Barrenos.push(newDataBarr);
            console.log(newDataBarr)
            var id = $scope.projID;
            localprojDB.get(id).then(function(doc) {
                return localprojDB.put({
                    _id: id,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: $scope.Barrenos,
                    tipos: doc.tipos,
                    productos: doc.productos,
                    muestras: doc.muestras,
                    datagral: doc.datagral,

                });
            }).then(function(response) {
                // handle response

            }).catch(function(err) {
                console.log(err);
            });

            // $state.go('menu.editarVoladuraMapa', { 'proj': $scope.projID});
            $scope.showAddNewBarr = true;
            $scope.showBarrnam = false;
            $scope.showCoord = false;

        }

        $scope.createBarr = function() {
            localDB.put({
                _id: $scope.newBarrNam,
                barr: 'N-' + $scope.selectedbarr_id,
                tipo: $scope.selectedTipo_u,
                profreal: $scope.profreal_u,
                coordx: $scope.coordx_u,
                coordy: $scope.coordy_u,
                tacoini: $scope.tacoini_u,
                taco: $scope.taco_u,
                aire: $scope.aire_u,
                bordo: $scope.bordo_u,
                espaciamiento: $scope.espaciamiento_u,
                diametro: $scope.diametro_u,
                densidad: $scope.densidad_u,
                status: "Nuevo",
                cargasinaire: $scope.cargaSinAire,
                cargamenosaire: $scope.cargaMenosAire,
                cargaagraneldisp: $scope.cargaAgraneldisp,
                volumencil: $scope.volumenCil,
                cargaagranel: $scope.cargaAgranel,
                volumentotal: $scope.volumenTotal,
                pesototal: $scope.pesoTotal,
                factordecarga: $scope.factorDeCarga,
                cargas: $scope.cargas,
                iniciadores: $scope.iniciadores,
                tacofinal: $scope.tacofinal,

            }).then(function(response) {
                // handle response

                console.log(err);
            });



            localDB.sync(remoteDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });

            // $scope.showCoord = false;


        }


        $scope.dataChart = [];
        $scope.dataSeries = [];






        $scope.showmap = false;
        $scope.hideMap = function() {
            $scope.showmap = false;
        }
        $scope.dataChartBarrs1 = function() {
            $scope.colors = [{
                backgroundColor: "rgba(159,204,0, 0.2)",
                pointBackgroundColor: "rgba(159,204,0, 1)",
                pointHoverBackgroundColor: "rgba(159,204,0, 0.8)",
                borderColor: "rgba(159,204,0, 1)",
                pointBorderColor: '#fff',
                pointHoverBorderColor: "rgba(159,204,0, 1)"
            }];
            var barrenosforchart = $scope.Barrenos
            angular.forEach(barrenosforchart, function(value, key) {

                var data = {
                    'Barreno': value.barr,
                    'x': value.coordx,
                    'y': value.coordy,
                    'r': 10
                }


                $scope.dataChart.push(data);


            })
            $scope.showmap = true;
        }
        $scope.dataChartBarrs = function(obj) {

            var barrenosforchart = $scope.Barrenos;
            var radio = obj || 5;
            $scope.dataChart = [];
            angular.forEach(barrenosforchart, function(value, key) {

                var data = {
                    //'Barreno': value.barr,
                    'x': value.coordx,
                    'y': value.coordy,
                    'r': radio
                }


                $scope.dataChart.push(data);


            })
            $scope.ctx = document.getElementById("mapaBarrenos");

            $scope.mapaBarrenos = new Chart($scope.ctx, {
                type: 'bubble',
                data: {
                    datasets: [{
                        label: 'Info de Barreno',
                        data: $scope.dataChart,

                    }]
                },

            });
            $scope.showmap = true;
        }

        $scope.showselectbarrchar = false;
        $scope.editBarr = function() {
            $scope.message = 'Edite los valores del Barreno';
            $scope.barrDetails = true;
            $scope.showCoord = true;
        }

    }
])

.controller('editarVoladuraCaptaciNCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {


    }
])

.controller('tomaDeMuestraCtrl', ['$scope', '$stateParams', '$state', '$window', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, $window, pouchDB) {
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
        $scope.selectProjFunc = function() {
            if ($scope.projID != '') {
                var proj = $scope.projID;
                localprojDB.get(proj).then(function(doc) {
                    $scope.selectedProj = doc;
                    console.log(doc)
                    $scope.tipobarr = doc.tipos;
                    $scope.Barrenos = doc.barrenos;
                    $scope.muestraData = doc.muestras || [];

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

.controller('tomaDeSismografosCtrl', ['$scope', '$stateParams', '$window', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $window, pouchDB) {


            let localSDB = new PouchDB('sismografo');
            let remoteSDB = new PouchDB('https://biznnovate.cloudant.com/eblast-sismografo', { skipSetup: true });
            remoteSDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteDB.getSession();
            });


            localSDB.sync(remoteSDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });

            //declara db de Explosivistas

            let localexpDB = new pouchDB('explo');
            let remoteexpDB = new PouchDB('https://biznnovate.cloudant.com/eblast-explo', { skipSetup: true });
            remoteexpDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteexpDB.getSession();
            });
            localexpDB.sync(remoteexpDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });

            $scope.Sismografos = [];
            localSDB.allDocs({
                include_docs: true,
                attachments: true
            }).then(function(result) {
                // handle result
                $scope.Sismografos = result;
                $scope.Sisrow = result.rows;
            }).catch(function(err) {
                console.log(err);
            });
            //llama datos de DB de Explosivistas
            localexpDB.allDocs({
                include_docs: true,
                attachments: true
            }).then(function(result) {
                // handle result
                $scope.explolist = result;
            }).catch(function(err) {
                console.log(err);
            });
            $scope.updateSis = function(obj) {
                console.log(obj)
                $scope.sis = obj;
                $scope.sis_u = obj;
            };
            $scope.updateSelectedSis = function(obj) {
                console.log(obj)
                $scope.sis = obj.doc.sis;
                $scope.sis_u = obj.doc.sis;
                console.log($scope.sis_u)
            };



            $scope.updateInst = function(obj) {
                console.log(obj)
                console.log($scope.inst)
                $scope.inst_u = obj;
            };
            $scope.updateSens = function(obj) {
                console.log(obj)
                console.log($scope.sens)
                $scope.sens_u = obj;
            };
            $scope.updateHora = function(obj) {
                console.log(obj)
                console.log($scope.hora)
                $scope.hora_u = obj;
            };
            $scope.caldate = new Date();
            $scope.updateCaldate = function(obj) {
                console.log(obj)
                console.log($scope.caldate)
                $scope.caldate_u = obj;
            };
            $scope.lecdate = new Date();
            $scope.updateLecdate = function(obj) {
                console.log(obj)
                console.log($scope.lecdate)
                $scope.lecdate_u = obj;
            };
            $scope.updateEstruc = function(obj) {
                console.log(obj)
                console.log($scope.estruc)
                $scope.estruc_u = obj;
            };
            $scope.updateDist = function(obj) {
                console.log(obj)
                console.log($scope.dist)
                $scope.dist_u = obj;
            };
            $scope.updateRadial = function(obj) {
                console.log(obj)
                console.log($scope.radial)
                $scope.radial_u = obj;
            };
            $scope.updateVert = function(obj) {
                console.log(obj)
                console.log($scope.vert)
                $scope.vert_u = obj;
            };
            $scope.updateTrans = function(obj) {
                console.log(obj)
                console.log($scope.trans)
                $scope.trans_u = obj;
            };
            $scope.updateAcust = function(obj) {
                console.log(obj)
                console.log($scope.acust)
                $scope.acust_u = obj;
            };
            $scope.updateExplo = function(obj) {
                console.log(obj)
                console.log($scope.selectedExplo)
                $scope.selectedExplo_u = obj;
                $scope.selectedExploName = obj.doc.name;
                $scope.selectedExploLic = obj.doc.lic;

            };



            $scope.gotoMenu = function() {
                $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
            }
            $scope.reloadPage = function() {
                $state.go('menu.tomaDeMuestra', { 'proj': $scope.projID });

            }
            $scope.showSis = false;
            $scope.newSismografo = function() {
                localSDB.put({

                    _id: new Date().toISOString(),
                    sis: $scope.sis_u,
                    inst: $scope.inst_u,
                    caldate: $scope.caldate_u,
                    lecdate: $scope.lecdate_u,
                    hora: $scope.hora_u,
                    estruc: $scope.estruc_u,
                    dist: $scope.dist_u,
                    radial: $scope.radial_u,
                    vert: $scope.vert_u,
                    trans: $scope.trans_u,
                    acust: $scope.acust_u,
                    explosivista: $scope.selectedExploName,
                    lic: $scope.selectedExploLic,


                }).then(function(response) {
                    // handle response

                    console.log(err);

                });



                localSDB.sync(remoteSDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });

                $scope.message = "Su Sismografo se ha grabado con Exito!";


            }
            $scope.viewSis = function() {
                $scope.showSis = true;

            }
            $scope.hideSis = function() {
                $scope.showSis = false;

            }
        }
    ])
    .controller('vistaPreviaMuestraCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', 'Excel', '$timeout', '$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, pouchDB, Excel, $timeout, $window) {

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
                $('#customers').tableExport({ type: 'json', escape: 'false' });
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

.controller('vistaPreviaGrlCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', 'Excel', '$timeout', '$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, pouchDB, Excel, $timeout, $window) {

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
        //llama datos de DB de Explosivistas
        localprojDB.allDocs({
            include_docs: true,
            attachments: true
        }).then(function(result) {
            // handle result
            $scope.projInfo = result;
        }).catch(function(err) {
            console.log(err);
        });
        $scope.updateSelectId = function(obj) {
            $scope.selectedId = obj;
            console.log(obj)
            $scope.selectedProj = obj.doc.stracon;
            console.log(obj.doc.stracon)
        }
        $scope.selectedProj = '';
        $scope.fragoptions = ['Excelente', 'Bueno', 'Regular', 'Pobre']

    }
])

.controller('generarReporteProductosCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', 'Excel', '$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, pouchDB, Excel, $timeout) {
        $scope.projparam = {
            'id': $stateParams.id,
            'status': $stateParams.status,
            'proj': $stateParams.proj,
        }
        $scope.projID = $scope.projparam.proj || '';
        var proj = $scope.projparam.proj;

        let localprodDB = new pouchDB('productos');
        let remoteprodDB = new PouchDB('https://biznnovate.cloudant.com/eblast-prods', { skipSetup: true });
        remoteprodDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
            console.log("I'm Batman.");
            return remoteprodDB.getSession();
        });
        localprodDB.sync(remoteprodDB).on('complete', function() {
            // yay, we're in sync!
        }).on('error', function(err) {
            // boo, we hit an error!
        });
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

        $scope.selectProj = function(obj) {
            console.log(obj)
            $scope.selectedProj_u = obj;
            $scope.projID = obj.doc._id;
            $scope.prod_list = obj.doc.productos || $scope.prodlist_format;
        }

        $scope.prodlist_format = [{
                'id': 'prod_1',
                'tipo': 'Componentes / Emulsión a granel',
                'prod': 'Hydromite 70 - Emulsión Gasificada',
                "fab": "APP",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_2',
                'tipo': 'Componentes / Emulsión a granel',
                'prod': 'Hydromite 100 - Emulsión Gasificada',
                "fab": "APP",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_3',
                'tipo': 'Emulsión Empacada',
                'prod': 'Hydromite 3 (63x400mm)',
                "fab": "IACR",
                'del': 0,
                'dev': 0,
                'used': 0,
            }

            ,
            {
                'id': 'prod_4',
                'tipo': 'Emulsión Empacada',
                'prod': 'Hydromite 3 (75x800mm)',
                "fab": "IACR",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_5',
                'tipo': 'Emulsión Empacada',
                'prod': 'Emulex 1 (25x400)',
                "fab": "IACR",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_6',
                'tipo': 'Emulsión Empacada',
                'prod': 'Emulex 1 (25x200)',
                "fab": "IACR",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_7',
                'tipo': 'Emulsión Empacada',
                'prod': 'Emulex 1 (32x400)',
                "fab": "IACR",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_8',
                'tipo': 'Booster (Iniciador)',
                'prod': 'Booster HDP-1/2 lb',
                "fab": "FAMESA",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_9',
                'tipo': 'Booster (Iniciador)',
                'prod': 'Booster HDP-1 lb',
                "fab": "FAMESA",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_10',
                'tipo': 'Booster (Iniciador)',
                'prod': 'Booster HDP-3 lb',
                "fab": "FAMESA",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_11',
                'tipo': 'Booster (Iniciador)',
                'prod': 'Emulex 50x400',
                "fab": "IACR",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_12',
                'tipo': 'Detonadores Duales',
                'prod': "SSDD 30'(9m 25/500 ms)",

                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_13',
                'tipo': 'Detonadores Duales',
                'prod': "SSDD 40' (12m 25/500 ms)",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_14',
                'tipo': 'Detonadores Duales',
                'prod': "SSDD 60' (18m 25/500 ms)",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_15',
                'tipo': 'Detonadores Duales',
                'prod': "SSDD 80' (24m 25/500 ms)",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_16',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 30' 17 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_17',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 30' 42 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_18',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 30' 67 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_19',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 40' 17 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_20',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 40' 42 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_21',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 40' 67 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_22',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 20' 17 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_23',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 20' 42 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_24',
                'tipo': 'Conectores de Superficie',
                'prod': "QRC 40' 25 ms",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_25',
                'tipo': 'Líneas de inicio',
                'prod': "STD 1500",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_26',
                'tipo': 'Líneas de inicio',
                'prod': "STD 2500",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_27',
                'tipo': 'Líneas de inicio',
                'prod': "STD 2500 Quick Start",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_28',
                'tipo': 'Líneas de inicio',
                'prod': "STD 1000",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_29',
                'tipo': 'Cordón detonante',
                'prod': "5P",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_30',
                'tipo': 'Cordón detonante',
                'prod': "10 PE",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_31',
                'tipo': 'Cordón detonante',
                'prod': "80P",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_32',
                'tipo': 'Cordón detonante',
                'prod': "40P",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_33',
                'tipo': 'Detonadores eléctricos y electrónicos',
                'prod': "Det. Electrónico Electro Star 24'",
                'del': 0,
                'dev': 0,
                'used': 0,
            },
            {
                'id': 'prod_34',
                'tipo': 'Detonadores eléctricos y electrónicos',
                'prod': "Det Eléctrico Rock Stars 0 ms 16ft #0",
                'del': 0,
                'dev': 0,
                'used': 0,
            },

            {
                'id': 'prod_35',
                'tipo': 'Otros',
                'prod': "Buswire 1250 ft",
                'del': 0,
                'dev': 0,
                'used': 0,
            }

        ]
        if ($scope.projID != '') {
            localprojDB.get(proj).then(function(doc) {
                $scope.proj = doc;
                $scope.prod_list = doc.productos || $scope.prodlist_format;
                $scope.Barrenos = doc.barrenos;
                $scope.tipos = doc.tipos;
                console.log(doc.tipos)
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            $scope.prod_list = $scope.prodlist_format;
            $scope.message = "Seleccione un Proyecto para Continuar";
        }

        $scope.createProductos = function() {
            let localprodDB = new pouchDB('productos');
            let remoteprodDB = new PouchDB('https://biznnovate.cloudant.com/eblast-prods', { skipSetup: true });
            remoteprodDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprodDB.getSession();
            });
            localprodDB.sync(remoteprodDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
            angular.forEach($scope.prod_list, function(value, key) {

                localprodDB.post({

                    _id: value.id,
                    tipo: value.tipo,
                    prod: value.prod,
                    del: value.del,
                    dev: value.dev,
                    used: value.del - value.dev,

                }).then(function(response) {
                    // handle response
                }).catch(function(err) {
                    console.log(err);
                });
            });
            localprodDB.sync(remoteprodDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
        }
        $scope.gotoMenu = function() {
            $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
        }
        $scope.calcProds = function() {
            $scope.prodListUpload = [];
            angular.forEach($scope.prod_list, function(value) {
                var data = {
                    tipo: value.tipo,
                    prod: value.prod,
                    fab: value.fab,
                    del: value.del || 0,
                    dev: value.dev || 0,
                    used: (value.del - value.dev) || 0
                }
                $scope.prodListUpload.push(data);
            });
        }
        $scope.updateProductos = function() {

            var id = $scope.projID;
            $scope.calcProds();

            localprojDB.get(id).then(function(doc) {
                return localprojDB.put({
                    _id: id,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: doc.barrenos,
                    tipos: doc.tipos,
                    muestras: doc.muestras || [],
                    productos: $scope.prodListUpload,
                });


            }).catch(function(err) {
                console.log(err);

            });
            console.log('se subio el proyecto ' + id);
            localprojDB.sync(remoteprojDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
            $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });

        }

        $scope.updateProductos1 = function() {
            let localprodDB = new pouchDB('productos');
            let remoteprodDB = new PouchDB('https://biznnovate.cloudant.com/eblast-prods', { skipSetup: true });
            remoteprodDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprodDB.getSession();
            });
            localprodDB.sync(remoteprodDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
            angular.forEach($scope.prod_list.rows, function(value, key) {
                var id = value.doc._id;
                console.log(id)
                localprodDB.get(id).then(function(doc) {

                    doc.del = value.doc.del;
                    doc.dev = value.doc.dev;
                    doc.used = value.doc.del - value.doc.dev;


                    return localprodDB.put(doc);
                }).then(function() {
                    return localprodDB.get(id);
                    // handle response

                }).catch(function(err) {
                    console.log(err);
                });



                localprodDB.sync(remoteprodDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });


            });
            $state.go('menu.vistaDeProyecto');
        }
        $scope.gotoMenu = function() {
            $state.go('menu.vistaDeReporte');
        }

        $scope.export = function() {
            html2canvas(document.getElementById('productTable'), {
                onrendered: function(canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 600,
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("productos.pdf");
                }
            });
        }
        $scope.exportToExcel = function(tableId, name) { // ex: '#my-table'
            var data = tableId;

            var exportHref = Excel.tableToExcel(data, name);
            $timeout(function() { location.href = exportHref; }, 100); // trigger download
        };

    }
])

.controller('generarReporteDatosGeneralesCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', '$timeout', 'Excel', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, pouchDB, $timeout, Excel) {
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
        $scope.BarrenosUpdated = [];
        $scope.BarrenosUpdatedCalcs = [];
        $scope.createBarrenosUpdated = function() {
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
        $scope.calcBarrenosUpdated = function() {
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
        }
        $scope.projFormat = {
            'voladuranum': '',
            'horavol': '',
            'fechatiro': '',
            'stracon': '',
            'horaini': '',
            'ubica': '',
            'fechacarga': '',
            'tipotiro': '',
            'material': '',
            'mlperf': '',
            'barcarg': '',
            'diam': '',
            'profagua': '',
            'filas': '',
            'bordo': '',
            'esp': '',
            'profprom': '',
            'caralibre': '',
            'subperf': '',
            'tipotaco': '',
            'alttaco': '',
            'mlcarg': '',
            'precortecarg': '',
            'mlprecorte': '',
            'exp1.exp': '',
            'exp1.cant': '',
            'exp1.prodpor': '',
            'exp2.exp': '',
            'exp2.cant': '',
            'exp2.prodpor': '',
            'exp3.exp': '',
            'exp3.cant': '',
            'exp3.prodpor': '',
            'exp4.exp': '',
            'exp4.cant': '',
            'exp4.prodpor': '',
            'exp5.exp': '',
            'exp5.cant': '',
            'exp5.prodpor': '',
            'exp6.exp': '',
            'exp6.cant': '',
            'exp6.prodpor': '',
            'ini1.exp': '',
            'ini1.cant': '',
            'ini1.prodpor': '',
            'ini2.exp': '',
            'ini2.cant': '',
            'ini2.prodpor': '',
            'ini3.exp': '',
            'ini3.cant': '',
            'ini3.prodpor': '',
            'ini4.exp': '',
            'ini4.cant': '',
            'ini4.prodpor': '',
            'pesotot': '',
            'tipodet1': '',
            'tipodet2': '',
            'tipodet3': '',
            'tipodet4': '',
            'tipodet5': '',
            'tipodet6': '',
            'pesoexpbar': '',
            'pesomaxbar': '',
            'matprod': '',
            'fc': '',
            'explo': '',
            'expllic': '',
            'comment': '',
        }

        $scope.selectProjFunc = function() {
            if ($scope.projID != '') {
                var proj = $scope.projID;
                localprojDB.get(proj).then(function(doc) {
                    $scope.selectedProj = doc;
                    console.log(doc)
                    $scope.tipobarr = doc.tipos;
                    $scope.Barrenos = doc.barrenos;
                    $scope.muestraData = doc.muestras;
                    $scope.prodlist = doc.productos;
                    $scope.proj = doc.datagral || $scope.projFormat;
                    console.log(doc.tipos)
                    console.log('se encontro el proyecto:' + proj)
                    $scope.createBarrenosUpdated();
                    $scope.calcBarrenosUpdated();
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




        $scope.editProjstatus = '';
        $scope.explisttemp = [
            { 'name': 'Arnaldo Barría', 'lic': 'DIASP-00380-040615' },
            { 'name': 'Eliodoro Olmos', 'lic': 'DIASP-00378-200515' },
            { 'name': 'Hernan de Leon', 'lic': 'DIASP-00261-190314' },
            { 'name': 'José Luis Hernandez', 'lic': 'DIASP-00381-190615' },
            { 'name': 'Nelson Martinez', 'lic': 'DIASP-00267-070414' },
            { 'name': 'Omar Rodriguez', 'lic': 'DIASP-00266-070414' },
            { 'name': 'Osman Jiménez', 'lic': 'DIASP-00382-250615' },
        ];
        //declara db de Explosivistas

        let localexpDB = new pouchDB('explo');
        let remoteexpDB = new PouchDB('https://biznnovate.cloudant.com/eblast-explo', { skipSetup: true });
        remoteexpDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
            console.log("I'm Batman.");
            return remoteexpDB.getSession();
        });
        localexpDB.sync(remoteexpDB).on('complete', function() {
            // yay, we're in sync!
        }).on('error', function(err) {
            // boo, we hit an error!
        });


        //llama datos de DB de Explosivistas
        localexpDB.allDocs({
            include_docs: true,
            attachments: true
        }).then(function(result) {
            // handle result
            $scope.explolist = result;
        }).catch(function(err) {
            console.log(err);
        });



        $scope.ExplosiveTypeList = ['Componentes / Emulsión a granel', 'Emulsión Empacada'];

        $scope.filterByType = function(producto) {
            return ($scope.ExplosiveTypeList.indexOf(producto.tipo) !== -1);
        };

        $scope.DetTypeList = ['Detonadores Duales', 'Conectores de Superficie', 'Líneas de inicio', 'Detonadores eléctricos y electrónicos', 'Otros'];

        $scope.filterByTypeDet = function(producto) {
            return ($scope.DetTypeList.indexOf(producto.tipo) !== -1);
        };

        var uploadExplosivista = function() {
                angular.forEach($scope.explisttemp, function(value, key) {


                    localexpDB.post({

                        name: value.name,
                        lic: value.lic,

                    }).then(function(response) {
                        // handle response
                    }).catch(function(err) {
                        console.log(err);
                    });
                });
                localexpDB.sync(remoteexpDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });
            }
            //llama bd de data





        $scope.updateStracon = function(obj) {
            console.log(obj)
            console.log($scope.stracon)
            $scope.stracon_u = obj;

        };

        $scope.updateVoladuranum = function(obj) {
            console.log(obj)
            console.log($scope.voladuranum)
            $scope.voladuranum_u = obj;

        };

        $scope.updateHoraini = function(obj) {
            console.log(obj)
            console.log($scope.horaini)
            $scope.horaini_u = obj;

        };
        $scope.updateTipotiro = function(obj) {
            console.log(obj)
            console.log($scope.tipotiro)
            $scope.tipotiro_u = obj;

        };
        $scope.updateFechatiro = function(obj) {
            console.log(obj)
            console.log($scope.fechatiro)
            $scope.fechatiro_u = obj;

        };
        $scope.updateFechacarga = function(obj) {
            console.log(obj)
            console.log($scope.fechacarga)
            $scope.fechacarga_u = obj;

        };
        $scope.updateFrentetrab = function(obj) {
            console.log(obj)
            console.log($scope.frentetrab)
            $scope.frentetrab_u = obj;

        };
        $scope.updateExplo = function(obj) {
            console.log(obj)
            console.log($scope.selectedExplo)
            $scope.selectedExplo_u = obj;
            $scope.proj.explo = obj.doc.name;
            $scope.proj.expllic = obj.doc.lic;
        };

        $scope.saveDataGral = function() {
            var id = $scope.projID;

            localprojDB.get(id).then(function(doc) {
                return localprojDB.put({
                    _id: id,
                    _rev: doc._rev,
                    proj: doc.proj,
                    date: doc.date,
                    barrenos: doc.barrenos,
                    tipos: doc.tipos,
                    muestras: doc.muestras || [],
                    productos: doc.productos,
                    datagral: $scope.proj,
                });


            }).catch(function(err) {
                console.log(err);

            });

            localprojDB.sync(remoteprojDB).on('complete', function() {
                // yay, we're in sync!
            }).on('error', function(err) {
                // boo, we hit an error!
            });
        }

        $scope.loadDataproj = function() {




            var id = $scope.projID;
            localprojDB.get(id).then(function(doc) {
                $scope.proj = doc.datagral;
                $scope.proj1 = {
                    'voladuranum': doc.info.voladuranum,
                    'horavol': doc.info.horavol,
                    'fechatiro': doc.info.fechatiro,
                    'stracon': doc.info.stracon,
                    'horaini': doc.info.horaini,
                    'ubica': doc.info.ubica,
                    'fechacarga': doc.info.fechacarga,
                    'tipotiro': doc.info.tipotiro,
                    'material': doc.info.material,
                    'mlperf': doc.info.mlperf,
                    'barcarg': doc.info.barcarg,
                    'diam': doc.info.diam,
                    'profagua': doc.info.profagua,
                    'filas': doc.info.filas,
                    'bordo': doc.info.bordo,
                    'esp': doc.info.esp,
                    'profprom': doc.info.profprom,
                    'caralibre': doc.info.caralibre,
                    'subperf': doc.info.subperf,
                    'tipotaco': doc.info.tipotaco,
                    'alttaco': doc.info.alttaco,
                    'mlcarg': doc.info.mlcarg,
                    'precortecarg': doc.info.precortecarg,
                    'mlprecorte': doc.info.mlprecorte,
                    'pesotot': doc.info.pesotot,
                    'pesoexpbar': doc.info.pesoexpbar,
                    'pesomaxbar': doc.info.pesomaxbar,
                    'matprod': doc.info.matprod,
                    'fc': doc.info.fc,
                    'explo': doc.info.explo,
                    'expllic': doc.info.expllic,
                    'comment': doc.info.comment,
                };
                $scope.prodlist = doc.prods;

                console.log(doc);



            }).then(function(response) {
                // handle response

                console.log(response);
            }).catch(function(err) {
                console.log(err);
            });

            $scope.editProjstatus = 'edit';


        }


        $scope.updateProject1 = function() {
            var proj = $scope.proj
            var id = $scope.project_id;
            localprojDB.get(id).then(function(doc) {
                return localprojDB.put({
                    _id: doc._id,
                    _rev: doc._rev,
                    stracon: $scope.proj.stracon,
                    info: $scope.proj,
                    prods: $scope.prodlist,

                });
            }).then(function(response) {
                // handle response
            }).catch(function(err) {
                console.log(err);
            });
            $window.location.reload();
        }
        $scope.tempfunc = function() {
            localDB.createIndex({
                index: {
                    fields: ['barr', '_id', 'pesototal', 'status', 'volumentotal', 'prof', 'profreal', 'volumencil']
                }
            }).then(function() {
                return localDB.find({
                    selector: { status: 'Updated' },
                    fields: ['_rev', '_id', 'barr', 'factordecarga', 'pesototal', 'status', 'prof', 'profreal', 'volumentotal', 'volumencil'],
                    // sort: ['oldid']

                }).then(function(result) {

                    $scope.BarrenosUpdated = result;
                    console.log(result);
                }).catch(function(err) {
                    console.log(err);
                });
            });
        }



        $scope.getPesoTotal = function() {
            var total = 0;
            for (var i = 0; i < $scope.BarrenosUpdated.length; i++) {
                var product = $scope.BarrenosUpdated[i];
                console.log(product.calcs.Pt * 1);
                total += (product.calcs.Pt);
                //$scope.PesoTotal = total;
            }
            return total;

        }
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
            for (var i = 0; i < $scope.BarrenosUpdated.length; i++) {
                var product = $scope.BarrenosUpdated[i];
                console.log(product.profreal * 1);
                total += (product.profreal);
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
        $scope.gotoMenu = function() {
            $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
        }

        $scope.export = function() {
            html2canvas(document.getElementById('portada'), {
                onrendered: function(canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 600,
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("portada.pdf");
                }
            });
        }
        $scope.exportToExcel = function(tableId, name) { // ex: '#my-table'
            var data = tableId;

            var exportHref = Excel.tableToExcel(data, name);
            $timeout(function() { location.href = exportHref; }, 100); // trigger download
        };


    }
])

.controller('agregarBarrenoCtrl', ['$scope', '$stateParams', 'Survey', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, Survey, $ionicPopup) {

        $scope.data = {
            'id': '',
            'coordx': '',
            'coordy': '',
            'dist': '',
            'status': 'grey'
        }
        $scope.gotoView = function() {
            $state.go('menu.tiposDeBarreno');
        }

        $scope.submitting = false;

        $scope.submit = function() {
            $scope.submitting = true;
            Survey.add($scope.data).then(function() {
                $scope.data = {
                    id: '',
                    coordx: '',
                    coordy: '',
                    dist: '',
                    status: 'grey'
                }
                $scope.submitting = false;

                $ionicPopup.alert({
                    title: 'Listo!',
                    template: 'Se ha actualizado el Barreno.'
                });

            })
        }
    }
])

.controller('verBarrenosCtrl', ['$scope', '$stateParams', 'Survey', '$window', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, Survey, $window, $state) {

        $scope.params = $stateParams;

        $scope.surveys = [];
        $scope.Barrenos = JSON.parse($window.localStorage['barrenos']);

        $scope.loadData = function() {

            if ($scope.params.id || $scope.params.status) {
                Survey.query($scope.params).then(function(res) {
                    $scope.surveys = res;
                    $scope.$broadcast('scroll.refreshComplete');
                })
            } else {
                Survey.all().then(function(res) {
                    $scope.surveys = res;
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }

        }

        $scope.loadData();

        $scope.showDelete = false;
        $scope.toggleDelete = function() {
            $scope.showDelete = !$scope.showDelete;
        }

        $scope.deleteItem = function($index) {
            Survey.delete($scope.surveys[$index].id).then(function() {
                $scope.surveys.splice($index - 1, 1);
            })
        }
        $scope.gotoSearch = function() {
            $state.go('menu.buscarBarreno');
        }
        $scope.gotoAdd = function() {
            $state.go('menu.agregarBarreno');
        }

    }
])

.controller('tiposDeBarrenoCtrl', ['$scope', '$stateParams', '$state', '$window', 'pouchDB', 'passInfo', '$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, $window, pouchDB, passInfo, $location) {
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

        //$scope.prods = [];
        var proj = $scope.projparam.proj;
        localprojDB.get(proj).then(function(doc) {

            $scope.proj = doc;
            console.log(doc)
            $scope.tipos = doc.tipos;
            console.log(doc.tipos)

        }).catch(function(err) {
            console.log(err);
            // alert('no');
            $scope.showForm2 = true;
            $scope.projExists = false;

        });
        //$scope.prods

        $scope.newVar = {
            'val': ''
        }
        $scope.selectBarrenoclk = function(barr) {
            console.log(barr)
            $state.go('menu.parametrosVoladura1', { 'id': barr, 'status': 'Edit', 'proj': $scope.projparam.proj });
        };



    }
])

.controller('buscarBarrenoCtrl', ['$scope', '$stateParams', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state) {

        $scope.fields = {
            id: '',
            status: 'Any Status'
        }
        $scope.search = function() {
            var params = {
                Col1: $scope.fields.id
            }

            if ($scope.fields.status != 'Any Status') {
                params.status = $scope.fields.status;
            }


            $state.go('menu.verBarrenos', params);

        }


    }
])