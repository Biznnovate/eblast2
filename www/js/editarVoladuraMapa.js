angular.module('app.editarVoladuraMapa', [])
    .controller('editarVoladuraMapaCtrl', ['$scope', '$stateParams', '$window', '$state', '$filter', 'pouchDB', 'Excel', '$timeout', '$ionicLoading', 'Page', '$ionicScrollDelegate', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $window, $state, $filter, pouchDB, Excel, $timeout, $ionicLoading, Page, $ionicScrollDelegate, $ionicPopup) {
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

            angular.element($window).bind('orientationchange', function() {
                $scope.dataChartBarrs();

            });

            //Load BD de de Proyectos y sus caracteristicas

            $scope.projparam = {
                'id': $stateParams.id,
                'status': $stateParams.status,
                'proj': $stateParams.proj,
            }
            Page.setTitle($stateParams.proj);

            //Declara y Sincroniza base de datos de Tipo
            let localprojDB = new pouchDB('projects');
            let remoteprojDB = new PouchDB('https://biznnovate.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprojDB.getSession();
            }).then('complete', function() {

            })
            $scope.dataChartBarrs = function(obj) {
                //$scope.show();
                console.log("datachartbarrs started")
                var barrenosforchart = $scope.Barrenos;
                var radio = obj || 5;
                $scope.dataChart = [];
                // $scope.dataChart1 = [];
                $scope.labelChart = [];
                $scope.pendingChart = [];
                angular.forEach(barrenosforchart, function(value, key) {
                    if (value.status == "Pending") {
                        var data = {
                            'v': value.barr,
                            'x': value.coordx,
                            'y': value.coordy,
                            // 'r': radio,

                        }
                        console.log(value)
                        $scope.pendingChart.push(data);
                        // var colorbarr = "#d42827"
                    } else {
                        var data = {
                            'v': value.barr,
                            'x': value.coordx,
                            'y': value.coordy,
                            //'r': radio,

                        }
                        $scope.dataChart.push(data);
                        // var colorbarr = "#a6a6a6"
                    }


                })
                $scope.testData = [

                    { label: ['1'], title: 'title1', data: [{ x: 1, y: 2, r: 5 }] },
                    { label: ['2'], title: 'title2', data: [{ x: 1.1, y: 2.1, r: 5 }] },
                    { label: ['3'], title: 'title3', data: [{ x: 1.3, y: 2.4, r: 5 }] },
                ]

                $scope.ctx = document.getElementById("mapaBarrenos");
                $scope.ctx.height = 700;

                $scope.mapaBarrenos = new Chart($scope.ctx, {
                    type: 'bubble',
                    data: {
                        //labels: $scope.labelChart,
                        datasets: [{
                            backgroundColor: '#d42827',
                            data: $scope.dataChart,

                        }, {
                            backgroundColor: '#a6a6a6',
                            color: '#ffffff',
                            data: $scope.pendingChart,


                        }]



                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        aspectRatio: 1,
                        tooltips: false,
                        layout: {
                            padding: {
                                top: 42,
                                right: 16,
                                bottom: 32,
                                left: 16
                            }
                        },
                        elements: {
                            point: {
                                radius: function(context) {
                                    var value = context.dataset.data[context.dataIndex];
                                    var size = context.chart.width;
                                    var base = 0.4;
                                    return (size / 24) * base;
                                }
                            }
                        },
                        pan: {
                            // Boolean to enable panning
                            enabled: true,

                            // Panning directions. Remove the appropriate direction to disable 
                            // Eg. 'y' would only allow panning in the y direction
                            mode: 'xy',
                            rangeMin: {
                                // Format of min pan range depends on scale type
                                x: null,
                                y: null
                            },
                            rangeMax: {
                                // Format of max pan range depends on scale type
                                x: null,
                                y: null
                            }
                        },

                        // Container for zoom options
                        zoom: {
                            // Boolean to enable zooming
                            enabled: true,

                            // Zooming directions. Remove the appropriate direction to disable 
                            // Eg. 'y' would only allow zooming in the y direction
                            mode: 'xy',
                            rangeMin: {
                                // Format of min pan range depends on scale type
                                x: null,
                                y: null
                            },
                            rangeMax: {
                                // Format of max pan range depends on scale type
                                x: null,
                                y: null
                            }
                        },
                        plugins: {
                            //legend: false,
                            // title: false,


                            datalabels: {
                                anchor: 'center',
                                align: 'center',
                                color: 'white',

                                font: {
                                    weight: 'bold'
                                },
                                formatter: function(value) {

                                    return value.v;

                                },
                                offset: 0,
                                padding: 0
                            }
                        }
                    },

                    optionsa: {
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: 'Mapa de Barrenos'
                        },
                        responsive: true,
                        tooltips: false,
                        aspectRatio: 1,

                        layout: {
                            padding: {
                                top: 42,
                                right: 16,
                                bottom: 32,
                                left: 8
                            }
                        },
                        // hover: {
                        //   mode: 'nearest',
                        // intersect: true
                        //},
                        scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Norte"
                                },
                                ticks: {
                                    beginAtZero: true
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Este"
                                }
                            }]

                        },
                        // Container for pan options
                        pan: {
                            // Boolean to enable panning
                            enabled: true,

                            // Panning directions. Remove the appropriate direction to disable 
                            // Eg. 'y' would only allow panning in the y direction
                            mode: 'xy'
                        },

                        // Container for zoom options
                        zoom: {
                            // Boolean to enable zooming
                            enabled: true,

                            // Zooming directions. Remove the appropriate direction to disable 
                            // Eg. 'y' would only allow zooming in the y direction
                            mode: 'xy',
                        },
                        plugins: {
                            datalabels: {
                                anchor: 'center',
                                align: 'center',
                                color: 'white',

                                font: {
                                    weight: 'bold'
                                },
                                formatter: function(value) {
                                    return value.v;
                                },
                                offset: 2,
                                padding: 0
                            }
                        },
                        elements: {
                            point: {
                                radius: function(context) {
                                    //var value = context.dataset.data[context.dataIndex];
                                    var value = context.dataset.data[context.dataIndex];
                                    var size = context.chart.width;
                                    var base = 0.25;
                                    return (size / 24) * base;
                                }
                            }
                        },

                    }
                });
                // $scope.showmap = true;
                // $scope.hide();
                console.log("datachartbarrs ended " + $scope.dataChart)
            }
            screen.orientation.onchange = function() {

                // $scope.dataChartBarrs();
                console.log(screen.orientation.type);
            };
            $scope.sync = function() {
                $scope.show();
                localprojDB.sync(remoteprojDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });
                $scope.hide();
            }

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
                $scope.dataChartBarrs();

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
                $scope.tipobarr = doc.tipos;
                $scope.Barrenos = [];
                $scope.Barrenos = doc.barrenos;
                $scope.projNam = doc.proj;
                $scope.dataChartBarrs();
                console.log(doc.tipos)
                $scope.hide();
            }).catch(function(err) {
                console.log(err);

            });
            $scope.selectProj = function(obj) {
                $scope.show();
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
                $scope.hide();
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

            $scope.dataChartBarrs();
            $scope.shownewBarrForm = false;

            $scope.updateSelectedBarr = function(obj) {
                console.log(obj)
                $scope.selectedBarreno = obj;

                console.log('updateSelectedBarr ' + $scope.selectedBarreno.barr)
                    //alert($scope.selectedBarreno.doc)
                    // $scope.selectedbarr_id = obj.id;
                $scope.selectedbarr = obj;
                //$scope.profreal = 0
                $scope.profDis = +(obj.prof).toFixed(2)
                if ($scope.profreal == obj.prof) {
                    $scope.profreal = $scope.profreal
                } else {
                    $scope.profreal = obj.prof;
                }
                $scope.profreal = +(obj.prof).toFixed(2);
                $scope.profreal_u = $scope.profreal;
                if (obj.diam > 0) {
                    $scope.diametro = obj.diam;
                } else {
                    $scope.diametro = $scope.diametro;
                }
                //$scope.diametro = obj.diam;
                $scope.diametro_u = $scope.diametro;
                $scope.coordx = obj.coordx / 1;
                $scope.coordy = obj.coordy / 1;
                $scope.coordx_u = $scope.coordx;
                $scope.coordy_u = $scope.coordy;

                //count barrenos
                $scope.message = "Barreno Seleccionado"
                $scope.shownewBarrForm = true;
                $scope.calc();
                $scope.$applyAsync();
                //  $scope.dataChartBarrs();
            };
            $scope.updateSelectedBarr23 = function(obj) {
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



                // $scope.showCoord = false;

                $scope.dataChartBarrs()

            };






            $scope.selectnewBarr = function(obj) {
                console.log(obj)
                $scope.selectedBarreno = obj;


            }
            $scope.findIndexBarr = function(value) {
                for (var i = 0; i < $scope.Barrenos.length; i++) {
                    if ($scope.Barrenos[i].barr === value) {
                        return $scope.Barrenos[i];
                    }
                }
            }
            $scope.findBarr = function(value) {
                var item = $scope.Barrenos;
                return function(item) {
                    return item.barr === value;
                };

                console.log('Found Barreno ' + value)

            };
            $scope.criteriaMatch = function(criteria) {
                return function(item) {
                    return item.name === criteria.name;
                };
            };
            $scope.selectedMapDataFunc = function(obj) {
                console.log('Selected Map Object ' + obj);
                var prop = 'barr';
                var value = obj;
                var i = $scope.findIndexBarr(obj);


                //var result = $filter('filter')($scope.Barrenos, { barr: value })[0];
                //var result = $scope.findBarr(value);
                console.log('******selected barreno ' + i)
                $scope.searchedbarr = {
                    barr: obj,
                }
                var result = i.barr
                $scope.updateSelectedBarr(i);
                //$scope.dataChartBarrs();


            }
            $scope.canvasMap = document.getElementById('mapaBarrenos');
            $scope.showPopup = function() {
                $scope.datapop = {};
                var mapTitle = 'ID ';

                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    templateUrl: 'templates/editarVoladuraCaptaciN.html',
                    title: mapTitle,
                    // subTitle: 'Please use normal things',
                    scope: $scope,
                    buttons: [
                        { text: 'Cerrar' },

                    ]
                });

                myPopup.then(function(res) {
                    console.log('Tapped!', res);
                });

                $timeout(function() {
                    myPopup.close(); //close the popup after 3 seconds for some reason
                }, 180000);
            };

            $scope.canvasMap.onclick = function(evt) {
                //$scope.showPopup();
                $scope.searchedbarr = {};

                var activePoint = $scope.mapaBarrenos.getElementAtEvent(evt)[0];
                console.log('activePoint' + activePoint)
                var data = activePoint._chart.data;
                var datasetIndex = activePoint._datasetIndex;
                var label = data.datasets[datasetIndex].data[activePoint._index].v;
                var value = data.datasets[datasetIndex].data[activePoint._index];
                $scope.selectedMapData = data.datasets[datasetIndex].data[activePoint._index].v;
                $scope.selectedBarr_idx = $scope.dataChart[datasetIndex];
                // console.log('label ' + label)
                console.log("selected barr" + $scope.dataChart[datasetIndex])

                $scope.selectedMapDataFunc($scope.selectedMapData);

                console.log('data ' + data + 'datasetindex ' + data._Index + ' selectedmapdata ' + $scope.selectedMapData);
            };
            $scope.mapDataFunc = function(points, evt) {
                console.log(points, evt);
            };

            $scope.showselectbarrchar = false;
            $scope.editBarr = function() {
                $scope.message = 'Edite los valores del Barreno';
                $scope.barrDetails = true;
                $scope.showCoord = true;
            }
            $scope.enableResults = false;
            $scope.enableCalc = false;
            $scope.carga_u = [];
            $scope.tipodecarga = '';
            $scope.updateSelectedTipo = function(obj) {
                $scope.show();
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
                if ($scope.diametro > 0) {
                    $scope.diametro = obj.diametro

                } else {
                    $scope.diametro = obj.diametro || $scope.diametro;
                }

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

                if ($scope.precorte == '') {
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
                } else {
                    $scope.calc = function() {
                        $scope.calcVarEmpPrec();

                        console.log('Se calculo Carga Precorte Variable con Explosivo Empacado ')
                    }

                }

                $scope.enableCalc = true;
                $scope.enableResults = true;
                $scope.calc();
                $scope.hide();

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
            $scope.profName = 'Diseño'
            $scope.updateProfReal = function(obj) {
                console.log(obj)
                $scope.profreal = +(obj).toFixed(2);
                $scope.profreal_u = +(obj).toFixed(2);
                $scope.profName = 'Real'
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
            $scope.calcVarEmpPrec = function() {
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
                var Tf = 0; //Taco final (Tf) = 
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
                var V = 0;
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
                $scope.show();

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
                $scope.hide();
                $scope.$applyAsync();
                $scope.dataChartBarrs();
                $scope.profName = 'Diseño'
                $scope.profreal = 0
                $scope.showProfDis = false;


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
                $scope.show();
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
                $scope.hide();
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




        }
    ])