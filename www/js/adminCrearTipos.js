angular.module('app.adminCrearTipos', [])
    .controller('adminCrearTiposCtrl', ['$scope', '$stateParams', '$state', 'Productos', '$filter', '$window', '$timeout', '$ionicLoading', 'pouchDB', 'passInfo', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function($scope, $stateParams, $state, Productos, $filter, $window, $timeout, $ionicLoading, pouchDB, $routeParams, passInfo) {
            //option.name for option in data.availableOptions track by option.id

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

            //var barrparam = $stateParams.id || 0;
            $scope.editBarreno = {
                'id': $stateParams.id,
                'status': $stateParams.status,
                'proj': $stateParams.proj,
            }

            $scope.enableCreate = true;
            $scope.projID = $scope.editBarreno.proj || '';
            $scope.tipoID = $scope.editBarreno.id || '';
            $scope.projTiposGlob = [];
            let localAdminDB = new pouchDB('admin');
            let remoteAdminDB = new PouchDB('https://biznnovate.cloudant.com/eblast-admin', { skipSetup: true });
            remoteAdminDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                console.log("I'm Batman.");
                return remoteAdminDB.getSession();
            });
            //Declara y Sincroniza base de datos de Tipo

            $scope.sync = function() {
                    $scope.show();
                    localAdminDB.sync(remoteAdminDB).on('complete', function() {
                        // yay, we're in sync!
                    }).on('error', function(err) {
                        // boo, we hit an error!
                    });

                    $scope.hide();
                }
                // let tempDB = new pouchDB('temp');
                // let localprojDB = new pouchDB('projects');
                //  let remoteprojDB = new PouchDB('https://biznnovate.cloudant.com/eblast-proj', { skipSetup: true });
                // remoteprojDB.login('biznnovate', '5t24XN-Am@8dqF:R').then(function(batman) {
                //     console.log("I'm Batman.");
                //     return remoteprojDB.getSession();
                // });
                //Declara y Sincroniza base de datos de Tipo

            $scope.sync1 = function() {
                $scope.show();
                localprojDB.sync(remoteprojDB).on('complete', function() {
                    // yay, we're in sync!
                }).on('error', function(err) {
                    // boo, we hit an error!
                });

                $scope.hide();
            }

            //llama datos de DB
            // localprojDB.allDocs({
            //    include_docs: true,
            //    attachments: true
            // }).then(function(result) {
            // handle result
            //   $scope.projInfo = result;

            //}).catch(function(err) {
            //   console.log(err);
            // });



            var UpdatenewBarreno = function() {
                $scope.newBarreno = { 'nam': barrparam }
            }

            $scope.loadprojTipos = function() {
                $scope.show();

                var id = 'tipos'

                localAdminDB.get(id).then(function(doc) {
                    $scope.projTiposGlob = doc.tipos || [];
                    $scope.tipos = doc.tipos || [];
                    // $scope.projNam = doc.proj

                    console.log('projtiposthing' + doc.tipos)
                    var selectedID = $scope.tipoBarrNam;
                    //var rows = $scope.projTiposGlob;
                    console.log('Selected ID: ' + selectedID);
                    // console.log('tiporows' + rows);
                    $scope.countTipos = doc.tipos.length;

                }).catch(function(err) {
                    console.log(err);
                });


                $scope.hide();
            }

            $scope.loadprojTipos();
            //UpdatenewBarreno();
            //$scope.newBarreno = {'nam': barrparam};
            console.log($scope.newBarreno);
            $scope.listed_productos = Productos.list;
            $scope.prods = [];
            $scope.DisableSaveButton = true;

            $scope.tipodebarr_list = [];


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
                $scope.enableCreate = false;
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
                var id = 'tipos';
                localAdminDB.get(id).then(function(doc) {
                    $scope.projTiposGlobUpdate = doc.tipos;
                    console.log('projtiposthing' + doc.tipos)
                    $scope.tipoBarrNam = $scope.tipoBarrNam_u || $scope.editBarreno.id;
                    var selectedID = $scope.tipoBarrNam;
                    var rows = $scope.projTiposGlob;
                    for (var i = 0; i < $scope.projTiposGlob.length; i++) {
                        if ($scope.projTiposGlob[i]._id == $scope.tipoBarrNam) {
                            $scope.projTiposGlob.splice(i, 1); // removes the matched element
                            i = $scope.projTiposGlob.length; // break out of the loop. Not strictly necessary
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
                            $scope.projTiposGlob = doc.tipos;
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
                //$scope.selectProjFunc();
            $scope.selectProj = function(obj) {
                console.log(obj)
                $scope.selectedproj_u = obj;
                $scope.projID = obj.doc._id;
                $scope.loadprojTipos();
                // $scope.selectProjFunc();


            }
            $scope.projTiposGlobAmount = function() {
                for (var i = 0; i < $scope.projTiposGlob.length; i++) {
                    var total = $scope.projTiposGlob.length
                }
                return total;
            }



            $scope.changeProjID = function() {
                    $scope.projID = '';
                }
                //producto as producto.prod for producto in listed_productos | filter:producto.id=tipoProdv2.id

            $scope.editTipo = function(obj, idx) {
                $scope.show();

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
                $scope.hide();
            }

            $scope.pushingTipoBarreno = function() {

                var subperfo = $scope.subperf_u || $scope.subperf;
                var tipodecarga = $scope.tipodecarga_u;
                var tipo = $scope.tipoBarrNam_u || $scope.editBarreno.id;

                $scope.loadprojTipos();
                $scope.show();

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
                $scope.projTiposGlob.push(newTipo);
                $scope.countTipos = $scope.projTiposGlob.length;
                console.log('hay ' + $scope.countTipos + ' Tipos para subir')
                $scope.hide();
            }
            $scope.insertTipoBarrenos = function() {
                $scope.show();
                var id = 'tipos';

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
                $scope.projTiposGlob.push(newTipo);
                $scope.countTipos = $scope.projTiposGlob.length;
                console.log('hay ' + $scope.countTipos + ' Tipos para subir')
                console.log('se va a subir tipos a ' + id)

                localAdminDB.get(id).then(function(doc) {

                    return localAdminDB.put({
                        _id: id,
                        _rev: doc._rev,


                        tipos: $scope.projTiposGlob,

                    }).catch(function(err) {
                        console.log(err);
                    });
                });
                $scope.hide();
                $scope.showMainform = false;
                $scope.enableCreate = true;

            }
            $scope.deleteTipo = function(index) {
                $scope.show();
                var id = 'tipos';
                $scope.projTiposGlob.splice(index, 1);
                // $scope.removeChoice(obj.prod, prods);
                // $scope.prods = prods;
                console.log('Tipo deleted');
                //$scope.$apply();



                localAdminDB.get(id).then(function(doc) {
                    return localAdminDB.put({
                        _id: id,
                        _rev: doc._rev,

                        tipos: $scope.projTiposGlob,



                    }).catch(function(err) {
                        console.log(err);
                    });
                });
                $scope.hide();
            }
            $scope.deleteProd = function(index) {
                $scope.show();
                $scope.prods.splice(index, 1);
                // $scope.removeChoice(obj.prod, prods);
                // $scope.prods = prods;
                console.log('Prod deleted');
                //$scope.$apply();
                $scope.hide();
            }
            $scope.removeChoice = function(itemId, array, index) {
                $scope.show();
                for (var i = 0; i < array.length; i++) {
                    if (array[i].id === itemId) {
                        array.splice(index, 1);
                        break;
                    }
                }
                $scope.hide();
            };
            $scope.addChoice = function(index) {
                $scope.show();
                var id = vm.items[index].choices.length + 1;
                vm.items[index].choices.push({
                    id: id,
                    req_goods: "",
                    qty: 0
                });
                $scope.hide();
            };


            $scope.updateTipoBarrenos = function() {

                let tempDB = new pouchDB('temp');

                var tipos = $scope.tipos;
                var subperfo = $scope.subperf_u || $scope.subperf;
                var tipodecarga = $scope.tipodecarga_u;
                var tipo = $scope.tipoID || $scope.tipoBarrNam;
                var id = 'tipos';
                $scope.tiposUpdate = [];
                $scope.projTiposGlobUpdate = [];

                console.log('Actualizando Tipo ' + tipo)

                $scope.removeChoice(tipo, $scope.projTiposGlob, $scope.tipoIndex);
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
                $scope.projTiposGlob.push(newTipo);

                console.log('Actualizando Proyecto ' + id)
                localAdminDB.get(id).then(function(doc) {
                    return localAdminDB.put({
                        _id: id,
                        _rev: doc._rev,
                        proj: doc.proj,
                        date: doc.date,
                        barrenos: doc.barrenos,
                        tipos: $scope.projTiposGlob,
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
                localAdminDB.sync(remoteAdminDB).on('complete', function() {
                    // yay, we're in sync!

                }).on('error', function(err) {
                    // boo, we hit an error!
                });
                // $scope.loadprojTipos();
                //  $state.go('menu.parametrosVoladura1', { 'proj': $scope.projID, });

                $state.go('menu.adminCrearTipos');

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
                    $scope.show();
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
                    $scope.hide();
                }
                //create tipo de barreno
            $scope.createType = function() {
                $scope.show();
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
                $scope.projTiposGlob.push(newTipo);
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
                $scope.hide();
            }

            $scope.reloadPage = function() {
                $state.go('menu.ajustarCSVCtrl', { 'proj': $scope.projID });

            }

            $scope.saveTipoLocal = function(item) {
                $scope.show();
                // $scope.TipoLocal = $window.localStorage['tipobarr'] || [];
                $scope.TipoLocal.push(item);
                $scope.barrForm = false;
                $scope.prods = [];
                //$scope.TipoLocal = $scope.TipoLocala;
                // $scope.TipoLocalLoad  = '';
                //

                // $scope.TipoLocalLoad=[];
                $scope.hide();
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
            $scope.gotovistaDeProj = function() {
                $state.go('menu.vistaDeProyecto', { 'proj': $scope.projID });
            }

        }
    ])