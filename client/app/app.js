var DEBUG = true;
if (DEBUG) console.log("app.js loaded");

angular.module('iifyMVP', [])
.factory('macroTracker', function() {
  var userCals = 0;
  var calsRemaining = 0;
  var macros = {
    protein: 0,
    fat: 0,
    carb: 0
  };

  var setProtein = function(percent) {
    macros.protein = ~~(percent / 400 * userCals);
  }
  var setFat = function(percent) {
    macros.fat = ~~(percent / 900 * userCals);
  }
  var setCarb = function(percent) {
    macros.carb = ~~(percent / 400 * userCals);
  }

  var getMacros = function() {
    return macros;
  }
  var setCals = function(cals) {
    userCals = cals;
    calsRemaining = cals;
    return userCals;
  }

  var getCals = function() {
    return userCals;
  }
  var getCalsRemaining = function() {
    return calsRemaining;
  }

  var eatStuff = function(cals) {
    calsRemaining = calsRemaining - cals;
    return calsRemaining;
  }

  return {
    setCals: setCals,
    getCals: getCals,
    getCalsRemaining: getCalsRemaining,
    setProtein: setProtein,
    setFat: setFat,
    setCarb: setCarb,
    getMacros: getMacros,
    eatStuff: eatStuff
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
  $scope.gramProtein = "";
  $scope.gramFat = "";
  $scope.gramCarb = "";

  macros.macroCalc = function() {
    var warning = "submit a calorie target!"
    if (DEBUG) console.log("macro percents submitted!");
    macroTracker.setProtein($scope.macroProtein);
    macroTracker.setFat($scope.macroFat);
    macroTracker.setCarb($scope.macroCarb);

    $scope.gramProtein =
      "Goal: " + macroTracker.getMacros().protein + " grams" || warning;
    $scope.gramFat =
      "Goal: " + macroTracker.getMacros().fat + " grams" || warning;
    $scope.gramCarb =
      "Goal: " + macroTracker.getMacros().carb + " grams" || warning;

    if (DEBUG) console.log("macros: ", macroTracker.getMacros());
  }
  if (DEBUG) console.log("MacroController $scope: ", $scope);
})
.controller('SearchController', function($scope, $http, macroTracker) {
  if (DEBUG) console.log('SearchController scope: ', $scope);
  var search = this;

  $scope.gramProtein = macroTracker.getMacros().protein;
  $scope.gramFat = macroTracker.getMacros().fat;
  $scope.gramCarb = macroTracker.getMacros().carb;

  search.getFoods = function(query) {
    console.log("SEARCHING", $scope.query);
    $http.post('/search', {data: $scope.query})
      .then(function(response) {
        // console.log("raw response data", response);
        $scope.remainingCals = macroTracker.getCalsRemaining();
        $scope.searchResults = response.data;
        console.log('\n\ndata:', response.data);
      });
  }
})
.controller('FoodController', function($scope, $http, macroTracker) {
  // console.log('FoodController scope: ', $scope);
  var food = this;

  $scope.shown = true;
  $scope.foodInfo = '';
  $scope.foodNetCals = 0;
  // $scope.error = $parentScope.error;

  food.moreInfo = function(ndbno) {
    console.log("toggled!", ndbno);
    $scope.shown = !$scope.shown;

    $http.post('/food', {data: ndbno})
    .then(function(response) {
      // console.log('.nutrients: ', response.data.nutrients);
      $scope.foodInfo = macroParser(response.data.nutrients);
      $scope.foodNetCals = calCalc(response.data.nutrients);
    });
  };

  food.eatTheFoods = function() {
    console.log("OM NOM NOM NOM");
    console.log($scope.$parent.remainingCals);
    console.log($scope.foodNetCals);
    $scope.$parent.remainingCals -= $scope.foodNetCals;
  };
});

var macroParser = function(nutrients) {
  var string = '';
  nutrients.forEach( (nutrient) => {
    // console.log(nutrient);
    // console.log(typeof nutrient.nutrient_id, nutrient.nutrient_id);
    if (nutrient.nutrient_id === '203') { //protein
      string += 'Protein: ' + nutrient.value + 'g  ';
    }
    if (nutrient.nutrient_id === '204') { //fat
      string += 'Fat: ' + nutrient.value + 'g  ';
    }
    if (nutrient.nutrient_id === '205') { // carb
      string += 'Carbs: ' + nutrient.value + 'g  ';
    }
  });
  return string;
}
var calCalc = function(nutrients) {
  var netCals = 0;
  nutrients.forEach( (nutrient) => {
    if (nutrient.nutrient_id === '203') { //protein
      netCals += parseInt(nutrient.value) * 4;
    }
    if (nutrient.nutrient_id === '204') { //fat
      netCals += parseInt(nutrient.value) * 9;
    }
    if (nutrient.nutrient_id === '205') { // carb
      netCals += parseInt(nutrient.value) * 4;
    }
  });
  console.log("calculated caloric value: ", netCals);
  return netCals;
}






















;
