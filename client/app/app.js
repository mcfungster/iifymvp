var DEBUG = true;
if (DEBUG) console.log("app.js loaded");

angular.module('iifyMVP', [])
.factory('macroTracker', () => {
  var userCals = 0;
  var macros = {
    protein: 0,
    fat: 0,
    carb: 0
  };

  var setCals = function(cals) {
    userCals = cals;
    calsRemaining = cals;
    return userCals;
  }

  return {
    userCals: userCals,
    macros: macros,
  }
})
.controller('CalorieController', function($scope, $rootScope, macroTracker) {
  var calories = this;

  calories.setCalories = function() {
    macroTracker.userCals = $scope.totalCals;
    $rootScope.globalRemain =  $scope.totalCals;
  };
})
.controller('MacroController', function($scope, macroTracker) {
  var macros = this;
  $scope.gramProtein = "";
  $scope.gramFat = "";
  $scope.gramCarb = "";

  macros.macroCalc = () => {
    var warning = "submit a calorie target!"
    if (DEBUG) console.log("macro percents submitted!");

    macroTracker.macros.protein =
      ~~($scope.macroProtein / 400 * macroTracker.userCals);

    macroTracker.macros.fat =
      ~~($scope.macroFat / 900 * macroTracker.userCals);

    macroTracker.macros.carb =
      ~~($scope.macroCarb / 400 * macroTracker.userCals);
    if (DEBUG) console.log("macros: ", macroTracker.macros);

    $scope.gramProtein =
      "Goal: " + macroTracker.macros.protein + " grams" || warning;
    $scope.gramFat =
      "Goal: " + macroTracker.macros.fat + " grams" || warning;
    $scope.gramCarb =
      "Goal: " + macroTracker.macros.carb + " grams" || warning;

  }
  if (DEBUG) console.log("MacroController $scope: ", $scope);
})
.controller('SearchController', function($scope, $http, macroTracker) {
  if (DEBUG) console.log('SearchController scope: ', $scope);
  var search = this;

  $scope.gramProtein = macroTracker.macros.protein;
  $scope.gramFat = macroTracker.macros.fat;
  $scope.gramCarb = macroTracker.macros.carb;

  search.getFoods = function(query) {
    console.log("SEARCHING", $scope.query);
    $http.post('/search', {data: $scope.query})
      .then(function(response) {
        $scope.searchResults = response.data;
        $scope.error = response.data[0].error;
      });
  }
})
.controller('FoodController', function($scope, $http, $rootScope, macroTracker) {
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
    $rootScope.globalRemain -= $scope.foodNetCals;
  };
});

var macroParser = function(nutrients) {
  var macros = macroGenerator(nutrients);
  var string = '';
  string += 'Protein: ' + macros.protein + 'g\t';
  string += 'Fat: ' + macros.fat + 'g\t';
  string += 'Carbs: ' + macros.carb + 'g\t';
  string += 'Total Calories: ' + calCalc(nutrients);

  return string;
}

var calCalc = function(nutrients) {
  var macros = macroGenerator(nutrients);
  return macros.protein * 4 + macros.fat * 9 + macros.carb * 4;
}

var macroGenerator = function(nutrients) {
  var macros = {
    protein: 0,
    fat: 0,
    carb: 0
  };

  nutrients.forEach( (nutrient) => {
    if (nutrient.nutrient_id === '203') { //protein
      macros.protein = trueValue(nutrient);
    }
    if (nutrient.nutrient_id === '204') { //fat
      macros.fat = trueValue(nutrient);
    }
    if (nutrient.nutrient_id === '205') { // carb
      macros.carb = trueValue(nutrient);
    }
  });

  console.log("generated macro: ", macros);
  return macros;
}

var trueValue = function(nutrient) {
  var val1 = parseInt(nutrient.measures[0].value);
  var val2 = parseInt(nutrient.value);

  return (val1 > val2)? val1 : val2;
}









;
