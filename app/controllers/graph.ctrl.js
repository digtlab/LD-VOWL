'use strict';

module.exports = function ($scope, $log, ClassExtractor, RelationExtractor, TypeExtractor,
  DetailExtractor, RequestConfig, Requests) {

  var vm = this;

  vm.extractTypes = false;
  vm.includeLoops = false;

  vm.endpointURL = RequestConfig.getEndpointURL();
  vm.data = {};
  vm.data.nodes = [];

  vm.classes = [];

  $scope.selected = {
    uri: 'none',
    name: '',
    type: '',
    value: 0,
    props: []
  };

  $scope.showSelection = false;

  $scope.pendingRequests = Requests.getPendingRequests();
  $scope.failedRequests = Requests.getFailedRequests();
  $scope.successfulRequests = Requests.getSuccessfulRequests();

  $scope.onClick = function(item) {
    $scope.$apply(function () {
      if (item.hasOwnProperty('uri')) {
          vm.data.selected  = item.uri;
          $scope.selected = item;
          DetailExtractor.requestCommentForClass(item.uri);
          $scope.showSelection = true;
        } else {
          $scope.selected.uri = 'none';
        }
    });
  };

  $scope.$on("pending-requests-changed", function(event, pending) {
    $scope.pendingRequests = pending;
    $scope.successfulRequests = Requests.getSuccessfulRequests();
    $scope.failedRequests = Requests.getFailedRequests();
  });

  vm.loadTypes = function () {
    if (vm.extractTypes) {
      $log.info("[Graph] Send requests for types...");
      for (var i = 0; i < vm.classes.length; i++) {
        TypeExtractor.requestReferringTypes(vm.classes[i].class.value);
      }
    }
  };

  vm.loadLoops = function () {
    if (vm.includeLoops) {
      for (var i = 0; i < vm.classes.length; i++) {
        var currentClass = vm.classes[i].class.value;
        RelationExtractor.requestClassClassRelation(currentClass, currentClass);
      }
    }
  };

  vm.startLoading = function () {
    ClassExtractor.requestClasses().then(function (classes) {

      vm.classes = classes;

      vm.loadTypes();

      console.log("[Graph] Send requests for relations.");

      // search for relations between classes
      for (var end = 0; end < classes.length; end++) {
        for (var start = 0; start < classes.length; start++) {
          if (vm.includeLoops || start !== end) {
            var origin = classes[start].class.value;
            var target = classes[end].class.value;
            RelationExtractor.requestClassClassRelation(origin, target);
          }
        }
      }
    });
  };

  vm.startLoading();

};