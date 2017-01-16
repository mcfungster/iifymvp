console.log("app.js loaded");

angular.module('iifyMVP', [])
  .controller('CalorieController', function($scope) {
    console.log("app.js: CalorieController loaded");
    console.log($scope.calories.totalCals);


    var macroSplit = function() {
      console.log('calories submitted');
    }
    var totalCals = $scope.calories.totalCals;






  });
