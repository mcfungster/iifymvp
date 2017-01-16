var request = require('request');



var router = function(req, res, next) {
  console.log('in routes.js: request routed!');
  console.log('req: ', Object.keys(req));

  request.get('', function(req, res) {


  });



  next();
}

exports.router = router;
console.log('router loaded');
