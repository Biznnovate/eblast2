angular.module('app.subirProyecto', [])
    .controller('subirProyectoCtrl', ['$scope', '$stateParams', '$state', '$filter', '$window', '$timeout', '$ionicLoading', 'Uploadcsv', 'CsvParser', 'pouchDB', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, $filter, $window, $timeout, $ionicLoading, Uploadcsv, CsvParser, pouchDB, ngCsvImport) {
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
            $scope.clearAll = function() {
                $scope.csv = {}
                console.log('csv cleared')
            }

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

            //  $scope.show();
            let localDB = new pouchDB('barrenoscsv');
            let remoteDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-barrenoscsv', { skipSetup: true });
            remoteDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteDB.getSession();
            });



            let localDivCSV = new pouchDB('barrenoscsvdiv');
            let remoteDivCSV = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-barrenoscsvdiv', { skipSetup: true });
            remoteDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteDivCSV.getSession();
            });


            let localDB2 = new pouchDB('barrenos');
            let remoteDB2 = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-barrenos', { skipSetup: true });
            remoteDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteDB2.getSession();
            });
            let localprojDB = new pouchDB('projects');
            let remoteprojDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-proj', { skipSetup: true });
            remoteprojDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
                console.log("I'm Batman.");
                return remoteprojDB.getSession();
            });
            // $scope.hide();


            $scope.sync = function() {
                $scope.show();
                localDB.sync(remoteDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });
                localprojDB.sync(remoteprojDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });
                localDivCSV.sync(remoteDivCSV).on('complete', function() {
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
                $scope.hide();
            }
            $scope.sync();

            $scope.updateSelectId = function(obj) {
                $scope.selectedId = obj;
                console.log(obj)
                $scope.selectedProj = obj.doc.stracon;
                console.log(obj.doc.stracon)
            }
            $scope.selectedProj = '';

            $scope.showcontinue = false;


            var cleanLocalDB = function() {

                $scope.show();

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



                $scope.hide();
                console.log('Cleaned Working DBS')


            }
            cleanLocalDB();
            $scope.addCSV = function() {
                $scope.show();
                let localDB = new pouchDB('barrenoscsv');
                // let remoteDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-barrenoscsv');

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
                        Col6: o[5],
                        Col7: o[6],
                        Col8: o[7],
                        Col9: o[8],
                        Col10: o[9],

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
                $scope.hide();
                alert("El CSV se cargó correctamente");
            }
            $scope.addCSV1 = function() {
                let localDB = new pouchDB('barrenoscsv');
                let remoteDB = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-barrenoscsv');

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
            $scope.showAll = false;
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
            $scope.projnam_u = '';
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
                $scope.show();

                let localDB2 = new pouchDB('barrenos');
                let remoteDB2 = new PouchDB('https://00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix.cloudant.com/eblast-barrenos', { skipSetup: true });
                remoteDB.login('00f2357b-9163-4332-9dce-6c8fa099eb55-bluemix', 'c9df512c425d8e0673255933bac2b2daa7ebdef9ad2806b48c5a2dd1239925b1').then(function(batman) {
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
                $scope.hide();

            }
            $scope.gotoMenu = function() {
                $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
            }
        }
    ])