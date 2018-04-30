angular.module('app.ajustarCSV', [])
    .controller('ajustarCSVCtrl', ['$scope', '$stateParams', '$state', '$window', '$timeout', '$ionicLoading', '$filter', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, $window, $timeout, $ionicLoading, $filter, pouchDB) {
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
            $scope.changeDiamQ = function(obj) {
                $scope.diamQ_u = obj;
                console.log('Diametro incluido ' + obj)
            }
            $scope.hide = function() {
                $ionicLoading.hide().then(function() {
                    console.log("The loading indicator is now hidden");
                });
            };
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
            let remoteprojDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprojDB.getSession();
            });
            $scope.sync = function() {
                $scope.show();
                localprojDB.sync(remoteprojDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });
                $scope.hide();
            }



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
                { 'id': 'coordx', 'nam': 'Este', 'status': '' },
                { 'id': 'coordy', 'nam': 'Norte', 'status': '' },
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
                $scope.show();
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
                $scope.hide();
            }
            $scope.selectCol2 = function(obj, conv) {
                $scope.show();
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
                $scope.hide();
            }
            $scope.selectCol3 = function(obj, conv) {
                $scope.show();
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
                $scope.hide();
            }
            $scope.selectCol4 = function(obj, conv) {
                $scope.show();
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
                $scope.hide();
            }
            $scope.selectCol5 = function(obj, conv) {
                $scope.show();
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
                $scope.hide();
            }
            $scope.selectCol6 = function(obj, conv) {
                $scope.show();
                console.log(obj);
                $scope.showSelectProf = false;
                $scope.showSelectDiam = false;
                $scope.columnsIndex = [];
                var conversion = conv || 1;
                var arrayObj = $scope.columns;
                if (obj.id == 'barr') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].barr = arrayObj[i]['Col6'];
                        delete arrayObj[i].Col6;
                    }

                } else if (obj.id == 'coordx') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordx = arrayObj[i]['Col6'];
                        delete arrayObj[i].Col6;
                    }
                } else if (obj.id == 'coordy') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordy = arrayObj[i]['Col6'];
                        delete arrayObj[i].Col6;
                    }
                } else if (obj.id == 'prof') {
                    $scope.showSelectProf = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].prof = arrayObj[i]['Col6'];
                        delete arrayObj[i].Col6;
                    }
                } else if (obj.id == 'diam') {
                    $scope.showSelectDiam = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].diam = arrayObj[i]['Col6'];
                        delete arrayObj[i].Col6;
                    }
                }
                $scope.hide();
            }
            $scope.selectCol7 = function(obj, conv) {
                $scope.show();
                console.log(obj);
                $scope.showSelectProf = false;
                $scope.showSelectDiam = false;
                $scope.columnsIndex = [];
                var conversion = conv || 1;
                var arrayObj = $scope.columns;
                if (obj.id == 'barr') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].barr = arrayObj[i]['Col7'];
                        delete arrayObj[i].Col7;
                    }

                } else if (obj.id == 'coordx') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordx = arrayObj[i]['Col7'];
                        delete arrayObj[i].Col7;
                    }
                } else if (obj.id == 'coordy') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordy = arrayObj[i]['Col7'];
                        delete arrayObj[i].Col7;
                    }
                } else if (obj.id == 'prof') {
                    $scope.showSelectProf = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].prof = arrayObj[i]['Col7'];
                        delete arrayObj[i].Col7;
                    }
                } else if (obj.id == 'diam') {
                    $scope.showSelectDiam = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].diam = arrayObj[i]['Col7'];
                        delete arrayObj[i].Col7;
                    }
                }
                $scope.hide();
            }
            $scope.selectCol8 = function(obj, conv) {
                $scope.show();
                console.log(obj);
                $scope.showSelectProf = false;
                $scope.showSelectDiam = false;
                $scope.columnsIndex = [];
                var conversion = conv || 1;
                var arrayObj = $scope.columns;
                if (obj.id == 'barr') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].barr = arrayObj[i]['Col8'];
                        delete arrayObj[i].Col8;
                    }

                } else if (obj.id == 'coordx') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordx = arrayObj[i]['Col8'];
                        delete arrayObj[i].Col8;
                    }
                } else if (obj.id == 'coordy') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordy = arrayObj[i]['Col8'];
                        delete arrayObj[i].Col8;
                    }
                } else if (obj.id == 'prof') {
                    $scope.showSelectProf = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].prof = arrayObj[i]['Col8'];
                        delete arrayObj[i].Col8;
                    }
                } else if (obj.id == 'diam') {
                    $scope.showSelectDiam = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].diam = arrayObj[i]['Col8'];
                        delete arrayObj[i].Col8;
                    }
                }
                $scope.hide();
            }
            $scope.selectCol9 = function(obj, conv) {
                $scope.show();
                console.log(obj);
                $scope.showSelectProf = false;
                $scope.showSelectDiam = false;
                $scope.columnsIndex = [];
                var conversion = conv || 1;
                var arrayObj = $scope.columns;
                if (obj.id == 'barr') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].barr = arrayObj[i]['Col9'];
                        delete arrayObj[i].Col9;
                    }

                } else if (obj.id == 'coordx') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordx = arrayObj[i]['Col9'];
                        delete arrayObj[i].Col9;
                    }
                } else if (obj.id == 'coordy') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordy = arrayObj[i]['Col9'];
                        delete arrayObj[i].Col9;
                    }
                } else if (obj.id == 'prof') {
                    $scope.showSelectProf = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].prof = arrayObj[i]['Col9'];
                        delete arrayObj[i].Col9;
                    }
                } else if (obj.id == 'diam') {
                    $scope.showSelectDiam = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].diam = arrayObj[i]['Col9'];
                        delete arrayObj[i].Col9;
                    }
                }
                $scope.hide();
            }
            $scope.selectProfu1 = function(obj) {
                $scope.show();
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
                $scope.hide();
            }
            $scope.selectCol10 = function(obj, conv) {
                $scope.show();
                console.log(obj);
                $scope.showSelectProf = false;
                $scope.showSelectDiam = false;
                $scope.columnsIndex = [];
                var conversion = conv || 1;
                var arrayObj = $scope.columns;
                if (obj.id == 'barr') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].barr = arrayObj[i]['Col10'];
                        delete arrayObj[i].Col10;
                    }

                } else if (obj.id == 'coordx') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordx = arrayObj[i]['Col10'];
                        delete arrayObj[i].Col10;
                    }
                } else if (obj.id == 'coordy') {
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].coordy = arrayObj[i]['Col10'];
                        delete arrayObj[i].Col10;
                    }
                } else if (obj.id == 'prof') {
                    $scope.showSelectProf = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].prof = arrayObj[i]['Col10'];
                        delete arrayObj[i].Col10;
                    }
                } else if (obj.id == 'diam') {
                    $scope.showSelectDiam = true;
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].diam = arrayObj[i]['Col10'];
                        delete arrayObj[i].Col10;
                    }
                }
                $scope.hide();
            }
            $scope.profuValue = 1;
            $scope.diameValue = 1;
            $scope.selectProfu = function(obj) {
                $scope.profuValue = obj.val;

            }
            $scope.selectDiame = function(obj) {
                $scope.diameValue = obj.val;

            }
            $scope.calcProfu = function(obj) {
                $scope.show();
                //  $scope.continueOpt = false;
                console.log(' valor ' + obj);

                $scope.columnsIndex = [];
                var conv = obj;
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

                $scope.hide();
            }
            $scope.calcDiame = function(obj) {
                $scope.show();

                console.log(' valor ' + obj);

                $scope.columnsIndex = [];
                var conv = obj;
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
                $scope.hide();
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
            $scope.continueOpt = true;
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

            $scope.confirmData = function(prof, diame) {
                $scope.barrenosToInsert = [];
                $scope.calcProfu(prof);
                $scope.calcDiame(diame)
                if ($scope.diamQ == "Si") {
                    console.log('Diametro fue Incluido en CSV')
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
                } else {
                    console.log('Diametro no fue Incluido en CSV')
                    angular.forEach($scope.columns, function(value) {
                        var barreno = {
                            barr: value.barr,
                            status: 'Pending',
                            coordx: value.coordx,
                            coordy: value.coordy,
                            prof: value.prof,
                            diam: 0,
                        }
                        $scope.barrenosToInsert.push(barreno);

                    });
                }


                alert("Las medidas han sido cuardadas correctamente")

                console.log('For Each de Barrenos ' + $scope.barrenosToInsert.length)

            }
            $scope.insertBarrenosProj = function() {
                $scope.show();
                let localprojDB = new pouchDB('projects');
                let remoteprojDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-proj', { skipSetup: true });
                remoteprojDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
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
                $scope.hide();
                $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
            }


        }
    ])