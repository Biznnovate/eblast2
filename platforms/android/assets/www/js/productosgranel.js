/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module('productosgranel', [])
.service('ProductosGranel', [function(){
    
    var productogranel_list = [
    {'id': 'gra-101', 'tipo': 'Carga a Granel', 'prod': 'ANFO', 'peso': 0.860, 'diametro': 0, 'largo': 0, },
    {'id': 'gra-102', 'tipo': 'Carga a Granel', 'prod': 'Hydromite 100', 'peso': 1.190, 'diametro': 0, 'largo': 0, },
    {'id': 'gra-103', 'tipo': 'Carga a Granel', 'prod': 'Hydromite 70', 'peso': 1.190, 'diametro': 0, 'largo': 0, },
    ];
    var productogranel_keys = {};

      for (var i=0;i<productogranel_list.length;i++){
        productogranel_keys[productogranel_list[i].id] = productogranel_list[i];
      }

    return {
        list: productogranel_list,
        keys: productogranel_keys
    } 
}]);

        