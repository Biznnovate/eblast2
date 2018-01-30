angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


        .state('menu.inicio', {
        url: '/page1',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/inicio.html',
                controller: 'inicioCtrl'
            }
        }
    })

    .state('menu.vistaDeProyecto', {
        url: '/page13',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/vistaDeProyecto.html',
                controller: 'vistaDeProyectoCtrl'
            }
        }
    })

    .state('menu.vistaDeReporte', {
        url: '/page16',
        params: {
            id: "",
            status: "",
            proj: ""
        },

        views: {
            'side-menu21': {
                templateUrl: 'templates/vistaDeReporte.html',
                controller: 'vistaDeReporteCtrl'
            }
        }
    })

    .state('menu', {
        url: '/side-menu21',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    })

    .state('menu.login', {
        url: '/page4',

        views: {
            'side-menu21': {
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            }
        }
    })

    .state('menu.subirProyecto', {
        url: '/page5',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/subirProyecto.html',
                controller: 'subirProyectoCtrl'
            }
        }
    })

    .state('menu.ajustarCSV', {
        url: '/page6',
        params: {
            id: "",
            status: "",
            proj: ""
        },

        views: {
            'side-menu21': {
                templateUrl: 'templates/ajustarCSV.html',
                controller: 'ajustarCSVCtrl'
            }
        }
    })


    .state('menu.mapaVoladura1', {
        url: '/page7',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/mapaVoladura1.html',
                controller: 'mapaVoladura1Ctrl'
            }
        }
    })

    .state('menu.parametrosVoladura1', {
        url: '/page8/',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/parametrosVoladura1.html',
                controller: 'parametrosVoladura1Ctrl'
            }
        }
    })


    .state('menu.editarVoladuraMapa', {
        url: '/page12',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/editarVoladuraMapa.html',
                controller: 'editarVoladuraMapaCtrl'
            }
        }
    })

    .state('menu.editarVoladuraCaptaciN', {
        url: '/page17',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/editarVoladuraCaptaciN.html',
                controller: 'editarVoladuraMapaCtrl'
            }
        }
    })

    .state('menu.tomaDeMuestra', {
        url: '/page11',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/tomaDeMuestra.html',
                controller: 'tomaDeMuestraCtrl'
            }
        }
    })

    .state('menu.generarReporteProductos', {
        url: '/page14',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/generarReporteProductos.html',
                controller: 'generarReporteProductosCtrl'
            }
        }
    })

    .state('menu.generarReporteDatosGenerales', {
        url: '/page15',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/generarReporteDatosGenerales.html',
                controller: 'generarReporteDatosGeneralesCtrl'
            }
        }
    })

    .state('menu.agregarBarreno', {
        url: '/page18',
        params: {
            id: "",
            status: "",
            proj: ""
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/agregarBarreno.html',
                controller: 'agregarBarrenoCtrl'
            }
        }
    })

    .state('menu.verBarrenos', {
        url: '/page19',
        params: {
            id: "",
            status: "",
            proj: ""
        },

        views: {
            'side-menu21': {
                templateUrl: 'templates/verBarrenos.html',
                controller: 'verBarrenosCtrl'
            }
        }
    })

    .state('menu.tiposDeBarreno', {
        url: '/page20',
        params: {
            id: "",
            status: "",
            proj: "",
        },
        views: {
            'side-menu21': {
                templateUrl: 'templates/tiposDeBarreno.html',
                controller: 'tiposDeBarrenoCtrl'
            }
        }
    })

    .state('menu.buscarBarreno', {
            url: '/page21',
            params: {
                id: "",
                status: "",
                proj: ""
            },
            views: {
                'side-menu21': {
                    templateUrl: 'templates/buscarBarreno.html',
                    controller: 'buscarBarrenoCtrl'
                }
            }
        })
        .state('menu.tomaDeSismografos', {
            url: '/page22',
            views: {
                'side-menu21': {
                    templateUrl: 'templates/tomaDeSismografos.html',
                    controller: 'tomaDeSismografosCtrl'
                }
            }
        })
        .state('menu.vistaPreviaMuestra', {
            url: '/page23',
            params: {
                id: "",
                status: "",
                proj: ""
            },
            views: {
                'side-menu21': {
                    templateUrl: 'templates/vistaPreviaMuestra.html',
                    controller: 'vistaPreviaMuestraCtrl'
                }
            }
        })
        .state('menu.vistaPreviaGrl', {
            url: '/page24',
            params: {
                id: "",
                status: "",
                proj: ""
            },
            views: {
                'side-menu21': {
                    templateUrl: 'templates/vistaPreviaGrl.html',
                    controller: 'vistaPreviaGrlCtrl'
                }
            }
        })
        .state('menu.reporteCarga1', {
            url: '/page25',
            params: {
                id: "",
                status: "",
                proj: ""
            },
            views: {
                'side-menu21': {
                    templateUrl: 'templates/reporteCarga1.html',
                    controller: 'reporteCarga1Ctrl'
                }
            }
        })
        .state('menu.admincons', {
            url: '/page26',
            params: {
                id: "",
                status: "",
                proj: ""
            },
            views: {
                'side-menu21': {
                    templateUrl: 'templates/admincons.html',
                    controller: 'adminconsCtrl'
                }
            }
        })
        .state('menu.editProds', {
            url: '/page27',
            params: {
                id: "",
                status: "",
                proj: ""
            },
            views: {
                'side-menu21': {
                    templateUrl: 'templates/editProds.html',
                    controller: 'editProdsCtrl'
                }
            }
        })
        .state('menu.adminCrearTipos', {
            url: '/page28',
            params: {
                id: "",
                status: "",
                proj: ""
            },
            views: {
                'side-menu21': {
                    templateUrl: 'templates/adminCrearTipos.html',
                    controller: 'adminCrearTiposCtrl'
                }
            }
        })

    $urlRouterProvider.otherwise('/side-menu21/page13')




});