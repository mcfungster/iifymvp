
var DEBUG = true;
if (DEBUG) console.log("app.js loaded");
// if (DEBUG) console.log("");

angular.module('iifyMVP', [])
  .factory('macroTracker', function() {
    var userCals = 0;
    var macros = {
      protein: 0,
      fat: 0,
      carb: 0
    }

    var setProtein = function(percent) {
      macros.protein = percent;
    }
    var setFat = function(percent) {
      macros.fat = percent;
    }
    var setCarb = function(percent) {
      macros.carb = percent;
    }

    var getMacros = function() {
      return macros;
    }
    var setCals = function(cals) {
      userCals = cals;
      return userCals;
    }

    var getCals = function() {
      return userCals;
    }

    return {
      setCals: setCals,
      getCals: getCals,
      setProtein: setProtein,
      setFat: setFat,
      setCarb: setCarb,
      getMacros: getMacros
    }
  })
  .controller('CalorieController', function($scope, macroTracker) {
    var calories = this;
    // if (DEBUG) console.log("app.js: CalorieController loaded");
    if (DEBUG) console.log("CalorieController $scope: ", $scope);
    calories.macroSplit = function() {
      macroTracker.setCals($scope.totalCals);
      if (DEBUG) console.log(macroTracker.getCals(), 'calories submitted');
    };
  })
  .controller('MacroController', function($scope, macroTracker) {
    var macros = this;

    macros.macroCalc = function() {
      console.log("macro percents submitted!");
      macroTracker.setProtein($scope.macroProtein);
      macroTracker.setFat($scope.macroFat);
      macroTracker.setCarb($scope.macroCarb);
      console.log("macros: ", macroTracker.getMacros());
    }
    if (DEBUG) console.log("MacroController $scope: ", $scope);
    if (DEBUG) console.log("MacroController: macros.macroCalc: ", macros.macroCalc);
  })
  .controller('SearchController', function() {


  });
























;
