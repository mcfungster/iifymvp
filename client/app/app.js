
var DEBUG = true;
if (DEBUG) console.log("app.js loaded");
// if (DEBUG) console.log("");


angular.module('iifyMVP', [])
  .factory('calorieTracker', function() {
    var userCals = 0;
    var setCals = function(cals) {
      userCals = cals;
      return userCals;
    }
    var getCals = function() {
      return userCals;
    }

    return {
      setCals: setCals,
      getCals: getCals
    }
  })
  .controller('CalorieController', function($scope, calorieTracker) {
    var calories = this;

    if (DEBUG) console.log("app.js: CalorieController loaded");
    if (DEBUG) console.log("$scope: ", $scope);

    calories.macroSplit = function() {
      calorieTracker.setCals($scope.totalCals);
      if (DEBUG) console.log(calorieTracker.getCals(), 'calories submitted');
    };
  })
  .controller('MacroController', function($scope, calorieTracker) {

  });
