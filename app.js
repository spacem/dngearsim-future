(function () {
'use strict';

// templates are imported via gulp job
angular.module('templates', []);
angular.module('dnsim', ['ngRoute','angulartics','angulartics.google.analytics','templates', 'ngMaterial']);

})();