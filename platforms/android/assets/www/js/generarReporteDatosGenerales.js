angular.module('app.generarReporteDatosGenerales', [])
    .controller('generarReporteDatosGeneralesCtrl', ['$scope', '$stateParams', '$state', 'pouchDB', '$timeout', 'Excel', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, pouchDB, $timeout, Excel, $ionicLoading) {
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

            let localAdminDB = new pouchDB('admin');
            let remoteAdminDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-admin', { skipSetup: true });
            remoteAdminDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteAdminDB.getSession();
            });
            $scope.explo = []
            $scope.loadprojExplo = function() {
                $scope.show();

                var id = 'explo'

                localAdminDB.get(id).then(function(doc) {

                    $scope.explo = doc.explo || [];


                    console.log('projtiposthing' + doc.explo)


                    $scope.countExplos = doc.explo.length;

                }).catch(function(err) {
                    console.log(err);
                });


                $scope.hide();
            }

            $scope.loadprojExplo();

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
            let remoteexpDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-explo', { skipSetup: true });
            remoteexpDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
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
                $scope.proj.explo = obj.name;
                $scope.proj.expllic = obj.lic;
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

            $scope.exportData = function() {
                alasql('SELECT * INTO XLSX("datosgrales.xlsx",{headers:true}) \ FROM HTML("#portada",{headers:true})');
                //alasql('SELECT * INTO XLSX("reporte.xlsx",{headers:true}) FROM ?', [$scope.Barrenos]);
            };
            $scope.exportToExcel = function(tableId, name) { // ex: '#my-table'
                var data = tableId;

                var exportHref = Excel.tableToExcel(data, name);
                $timeout(function() { location.href = exportHref; }, 100); // trigger download
            };


        }
    ])