/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module('barrenos', [])
.service('Barrenos', [function(){
    
    var barreno_list = [
        {

           
        },
        
    ];
    var barreno_keys = {};

      for (var i=0;i<barreno_list.length;i++){
        barreno_keys[barreno_list[i].id] = barreno_list[i];
      }

    return {
        list: barreno_list,
        keys: barreno_keys
    } 
}]);

        