/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module('iniciadores', [])
.service('Iniciadores', [function(){
    
    var iniciador_list = [
        {'id': 'ini-101', 'tipo': 'Iniciadores', 'prod': 'Booster HDP-1 lb', 'peso': 0.45, 'diametro': 0, 'largo': 0, },
        {'id': 'ini-102', 'tipo': 'Iniciadores', 'prod': 'Booster HDP-1/2 lb', 'peso': 0.225, 'diametro': 0, 'largo': 0, },
        {'id': 'ini-103', 'tipo': 'Iniciadores', 'prod': 'Booster HDP-2 lb', 'peso': 0.9, 'diametro': 0, 'largo': 0, },
        {'id': 'ini-104', 'tipo': 'Iniciadores', 'prod': 'Booster HDP-3 lb', 'peso': 0.675, 'diametro': 0, 'largo': 0, },
        {'id': 'ini-105', 'tipo': 'Iniciadores', 'prod': 'Emulex 32x400', 'peso': 0.4, 'diametro': 32, 'largo': 400, },
        {'id': 'ini-106', 'tipo': 'Iniciadores', 'prod': 'Emulex 38x400', 'peso': 0.58, 'diametro': 38, 'largo': 400, },
        {'id': 'ini-107', 'tipo': 'Iniciadores', 'prod': 'Emulex 50x400', 'peso': 1, 'diametro': 50, 'largo': 400, },
        {'id': 'ini-108', 'tipo': 'Iniciadores', 'prod': 'Emulex 63x400', 'peso': 1.667, 'diametro': 63, 'largo': 400, },
    ];
    var iniciador_keys = {};

      for (var i=0;i<iniciador_list.length;i++){
        iniciador_keys[iniciador_list[i].id] = iniciador_list[i];
      }

    return {
        list: iniciador_list,
        keys: iniciador_keys
    } 
}]);

        