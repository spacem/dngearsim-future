angular.module('dnsim').controller('itemEditSkillCtrl',

['$timeout','dntData','statHelper',
function($timeout,dntData,statHelper) {
  'use strict';
  
  if(this.item == null) return;
  if(this.item.itemSource != 'skills') {
    return;
  }
  
  if(!this.item.enchantmentNum) {
    this.item.enchantmentNum = 1;
  }
  
  var vm = this;
  
  this.initSkills = function() {
    var dntFile = 'skillleveltable_character' + vm.item.baseJobName + vm.item.pve + '.lzjson';
    dntData.init(dntFile, null, reportProgress, function() { $timeout(function() {
      vm.skillData = dntData.find(dntFile, 'SkillIndex', vm.item.id);
      vm.getSkillStats();
    })});
  }
  
  this.getSkillStats = function() {
    if(!vm.item) {
      return;
    }
    
    if(!vm.skillData || vm.skillData.length == 0) {
      return;
    }
    
    if(!vm.item.enchantmentNum) {
      vm.item.enchantmentNum = 1;
    }
    
    vm.item.stats = statHelper.getSkillStats(vm.item, vm.skillData);
    vm.onChange();
  }
  
  this.nextEnchantment = function() {
    if(this.skillData && this.item.enchantmentNum < this.skillData.length) {
      this.item.enchantmentNum++;
      this.getSkillStats();
    }
  }
  
  this.isMaxSkillLevel = function() {
    return this.skillData && this.item && this.item.enchantmentNum >= this.skillData.length;
  }
  
  this.prevEnchantment = function() {
    if(this.item.enchantmentNum > 0) {
      this.item.enchantmentNum--;
    }
    else {
      this.item.enchantmentNum = 0;
    }

    this.getSkillStats();
  }
  
  this.initSkills();
  
  function reportProgress(msg) {
    // console.log('progress: ' + msg);
  }

}])
.directive('dngearsimItemEditSkill', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditSkillCtrl',
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/item-edit-skill.html'
  };
});