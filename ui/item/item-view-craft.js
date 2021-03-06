angular.module('dnsim').controller('itemViewCraftCtrl',

['$timeout','dntData','itemFactory','hCodeValues','translations',
  function($timeout, dntData, itemFactory, hCodeValues, translations) {
  'use strict';
  
  if(this.item == null) return;
  
  var vm = this;
  vm.crafts = [];

  var cFiles = [
    'itemcompoundtable.lzjson',
    'itemcompoundtable_custom.lzjson',
    'itemcompoundtable_glyph.lzjson',
    'itemcompoundtable_jewel.lzjson',
    'itemcompoundtable_renewal.lzjson',
    'itemcompoundtable_set.lzjson'];
  
  var allItemFileName = 'all-items.lzjson';
  
  var files = cFiles.concat([allItemFileName]);
  for(var i=0;i<files.length;++i) {
    dntData.init(files[i], null, function() {}, function() {
      $timeout(function() {
        vm.initCrafts();
      });
    });
  }
  
  this.initCrafts = function() {
    for(var i=0;i<files.length;++i) {
      if(!dntData.isLoaded(files[i])) {
        return;
      }
    }
    
    vm.crafts = [];
    for(var i=0;i<cFiles.length;++i) {
      vm.initCraft(cFiles[i]);
    }
    
    var newCrafts = [];
    for(var i=0;i<vm.crafts.length;++i) {
      var found = false;
      for(var j=0;j<newCrafts.length;++j) {
        if(vm.crafts[i].gold == newCrafts[j].gold &&
          vm.crafts[i].items.length == newCrafts[j].items.length) {
            
            found = true;
            for(var k=0;k<vm.crafts[i].items.length;++k) {
              if(vm.crafts[i].items[k].item.id != newCrafts[j].items[k].item.id ||
                vm.crafts[i].items[k].num != newCrafts[j].items[k].num) {
                  found = false;
              }
            }
        }
      }
      
      if(!found) {
        newCrafts.push(vm.crafts[i]);
      }
    }
    
    vm.crafts = newCrafts;
  }

  this.initCraft = function(fileName) {
    var fCrafts = dntData.find(fileName, 'SuccessItemID1', vm.item.id);
    
    for(var i=0;i<fCrafts.length;++i) {
      var c = fCrafts[i];
      
      var craft = {
        id: c.id,
        fileName: fileName.replace('.lzjson', ''),
        gold: c.Cost/100/100,
        items: [],
      };
      
      var j=0;
      for(;;) {
        j++;
        var itemColName = 'Slot' + j +'Id';
        var qtyColName = 'Slot' + j +'Num';
        if(!(itemColName in c)) {
          break;
        }

        var items = dntData.find(allItemFileName, 'id', c[itemColName]);
        if(items.length > 0) {
          craft.items.push({
            item: itemFactory.createBasicItem(items[0]),
            num: c[qtyColName],
          });
        }
      }
      
      vm.crafts.push(craft);
    }
  }

}])
.directive('dngearsimItemViewCraft', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
    },
    controller: 'itemViewCraftCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'ui/item/item-view-craft.html'
  };
});