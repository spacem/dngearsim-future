angular.module('dnsim').controller('NavCtrl', 
  ['$scope','$location','translations','region','itemCategory','saveHelper',
  function($scope,$location,translations,region,itemCategory,saveHelper) {
    'use strict';

    var aboutAction = { path: 'about', name: '', icon: 'question-sign' }
    
    var noMenu = [];
    var noLocationMenu = [aboutAction];
    var normalMenu = [
      {path: 'builds', name:'builds', icon: 'wrench'},
      {path: 'search', name:'gear', icon: 'search'},
      {path: 'items', name:'items', icon: 'search'},
      aboutAction,
      ];
    
    var buildAction = {path: 'build', name:'build', icon: 'wrench'};
    
    var withBuildMenu = [
      {path: 'builds', name:'builds', icon: 'wrench'},
      buildAction,
      {path: 'search', name:'gear', icon: 'search'},
      {path: 'items', name:'items', icon: 'search'},
      aboutAction,
      ];
      
    //var basePath = angular.element(document.querySelector('base')).attr('href');
      
    region.init();
  
    $scope.isSearch = function() {
      return $location.path().indexOf('/search') == 0;
    }

    $scope.isLoading = function() {
      return translations.startedLoading && 
            !translations.isLoaded() &&
            region.tlocation != null &&
            region.tlocation.url != '' &&
            !$scope.noRegion();
    }
    
    $scope.noRegion = function() {
      return region.dntLocation == null;
    }
    
    $scope.getActionUrl = function(action) {
      if(action.name == 'search') {
        var cat = localStorage.getItem('selectedItemCategory', action.name);
        if(cat) {
          return action.path + '?cat=' + cat;
        }
        else {
          return action.path;
        }
      }
      else {
          return action.path;
      }
    }
      
    $scope.getActions = function() {
      // console.log('getting actions');
      var menu = null;
      
      var currentBuild = saveHelper.getCurrentBuild();
      if(currentBuild) {
        var savedItems = saveHelper.getSavedItems();
        if(!(currentBuild in savedItems)) {
          currentBuild = null;
        }
      }

      if(region.dntLocation != null && region.dntLocation.url == '') {
        menu = noLocationMenu; 
      }
      else if(region.tlocation != null && region.tlocation.url == '') {
        menu = noLocationMenu; 
      }
      else if(currentBuild && currentBuild != 'null') {
        menu = withBuildMenu;
        buildAction.path = 'build/' + currentBuild;
        buildAction.name = currentBuild;
      }
      else if($location.path() == '/view-group' || region.dntLocation == null) {
        menu = normalMenu;
      }
      else {
        menu = normalMenu;
      }
      
      angular.forEach(menu, function(value, key) {
        delete value.extraCss;
        if($location.path().length == 1) {
          if(value.path.length == 1) {
            value.extraCss = 'active';
          }
        }
        else if(value.path.length > 1 && $location.path().indexOf('/' + value.path) == 0) {
          if(value.path != 'builds' || $location.path() == '/builds') {
            value.extraCss = 'active';
          }
        }
      });
      
      return menu;
    };
  }
])
.directive('dngearsimNav', function() {
  return {
    templateUrl: 'ui/nav/nav.html'
  };
});