angular.module('dnsim').controller('itemEditPotentialCtrl',

['dntData','items',
function(dntData,items) {
  'use strict';
  
  this.potentials = null;
  this.potential = null;
  
  if(this.item == null) return;
  
  if('itemSource' in this.item) {
    this.itemType = items[this.item.itemSource];
  }
  
  if(!this.itemType || !this.item.pid || !('potentialDnt' in this.itemType)) {
    return;
  }
  
  var vm = this;
  
  this.getPotentials = function() {
    if(!vm.potentials) {
      if(vm.item && vm.item.pid && 'potentialDnt' in vm.itemType) {
        var potentials = dntData.find(vm.itemType.potentialDnt, 'id', vm.item.pid);
        if(potentials.length == 1) {
          vm.potential = potentials[0];
          vm.potentials = dntData.find(vm.itemType.potentialDnt, 'PotentialID', vm.potential.PotentialID);
        }
      }
    }
    
    return vm.potentials;
  }
  
  this.nextPotential = function() {
    for(var i=0;i<vm.potentials.length;++i) {
      if(vm.potential.id == vm.potentials[i].id) {
        vm.potential = vm.potentials[i+1];
        vm.item.pid = vm.potential.id;
        vm.onChange();
        return;
      }
    }
  }
  
  this.prevPotential = function() {
    for(var i=0;i<vm.potentials.length;++i) {
      if(vm.potential.id == vm.potentials[i].id) {
        vm.potential = vm.potentials[i-1];
        vm.item.pid = vm.potential.id;
        vm.onChange();
        return;
      }
    }
  }
  
  this.isFirstPotential = function() {
    this.getPotentials();
    return !vm.potentials || vm.potentials.length <= 1 || !vm.potential || vm.potential.id == vm.potentials[0].id;
  }
  
  this.isLastPotential = function() {
    this.getPotentials();
    return !vm.potentials || vm.potentials.length <= 1 || !vm.potential || vm.potential.id == vm.potentials[vm.potentials.length-1].id;
  }
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }

}])
.directive('dngearsimItemEditPotential', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditPotentialCtrl',
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/item-edit-potential.html?bust=' + Math.random().toString(36).slice(2)
  };
});