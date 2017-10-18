/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module('productos', [])
    .service('Productos', [function() {

        var producto_list = [
            { 'id': 'ini-101', 'tipoid': 'ini', 'tipo': 'Iniciadores', 'prod': 'Booster HDP-1 lb', 'peso': 0.45, 'densidad': 0, 'diametro': 0, 'largo': 0, },
            { 'id': 'ini-102', 'tipoid': 'ini', 'tipo': 'Iniciadores', 'prod': 'Booster HDP-1/2 lb', 'peso': 0.225, 'densidad': 0, 'diametro': 0, 'largo': 0, },
            { 'id': 'ini-103', 'tipoid': 'ini', 'tipo': 'Iniciadores', 'prod': 'Booster HDP-2 lb', 'peso': 0.9, 'densidad': 0, 'diametro': 0, 'largo': 0, },
            { 'id': 'ini-104', 'tipoid': 'ini', 'tipo': 'Iniciadores', 'prod': 'Booster HDP-3 lb', 'peso': 0.675, 'densidad': 0, 'diametro': 0, 'largo': 0, },
            { 'id': 'ini-105', 'tipoid': 'ini', 'tipo': 'Iniciadores', 'prod': 'Emulex 32x400', 'peso': 0.4, 'densidad': 0, 'diametro': 32, 'largo': .400, },
            { 'id': 'ini-106', 'tipoid': 'ini', 'tipo': 'Iniciadores', 'prod': 'Emulex 38x400', 'peso': 0.58, 'densidad': 0, 'diametro': 38, 'largo': .400, },
            { 'id': 'ini-107', 'tipoid': 'ini', 'tipo': 'Iniciadores', 'prod': 'Emulex 50x400', 'peso': 1, 'densidad': 0, 'diametro': 50, 'largo': .400, },
            { 'id': 'ini-108', 'tipoid': 'ini', 'tipo': 'Iniciadores', 'prod': 'Emulex 63x400', 'peso': 1.667, 'densidad': 0, 'diametro': 63, 'largo': .400, },
            { 'id': 'ce-101', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Emulex 25x400', 'peso': 0.255, 'densidad': 0, 'diametro': 25, 'largo': .400, },
            { 'id': 'ce-102', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Emulex 32x400', 'peso': 0.4, 'densidad': 0, 'diametro': 32, 'largo': .400, },
            { 'id': 'ce-103', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Emulex 38x400', 'peso': 0.58, 'densidad': 0, 'diametro': 38, 'largo': .400, },
            { 'id': 'ce-104', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Emulex 50x400', 'peso': 1, 'densidad': 0, 'diametro': 50, 'largo': .400, },
            { 'id': 'ce-105', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Emulex 63x400', 'peso': 1.667, 'densidad': 0, 'diametro': 63, 'largo': .400, },
            { 'id': 'ce-106', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Emulex 92x400', 'peso': 3.26, 'densidad': 0, 'diametro': 92, 'largo': .400, },
            { 'id': 'ce-107', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Hydromite 100x400', 'peso': 4.166, 'densidad': 0, 'diametro': 100, 'largo': 400, },
            { 'id': 'ce-108', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Hydromite 63x400', 'peso': 1.667, 'densidad': 0, 'diametro': 63, 'largo': .400, },
            { 'id': 'ce-109', 'tipoid': 'ce', 'tipo': 'Carga Empacada', 'prod': 'Hydromite 75x800', 'peso': 5, 'densidad': 0, 'diametro': 75, 'largo': .800, },
            { 'id': 'gra-101', 'tipoid': 'cg', 'tipo': 'Carga a Granel', 'prod': 'ANFO', 'peso': 0, 'densidad': 0.860, 'diametro': 0, 'largo': 0, },
            { 'id': 'gra-102', 'tipoid': 'cg', 'tipo': 'Carga a Granel', 'prod': 'Hydromite 100', 'peso': 0, 'densidad': 1.190, 'diametro': 0, 'largo': 0, },
            { 'id': 'gra-103', 'tipoid': 'cg', 'tipo': 'Carga a Granel', 'prod': 'Hydromite 70', 'peso': 0, 'densidad': 1.190, 'diametro': 0, 'largo': 0, },
        ];
        var producto_keys = {};

        for (var i = 0; i < producto_list.length; i++) {
            producto_keys[producto_list[i].id] = producto_list[i];
        }

        return {
            list: producto_list,
            keys: producto_keys
        }
    }]);