angular.module('app.vistaPreviaMuestra', [])
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
            $scope.loadChartData = function() {


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