console.log('in server.js');

var express = require('express');
var request = require('request');

var app = express();

var port = process.env.PORT || 8000;
console.log("environment", process.env.PORT);

app.use(express.static('client'));

// app.get('/', function(req, res) {
//   // res.send('IIFYM');
// });

app.get('/search', function(req, res) {
  var options = {
    url: 'http://api.nal.usda.gov/ndb/search',
    qs: {
      api_key: '2NvUKo0fX0jlycZTtGjJ4kuSJdPk8RmWMgZmxbb5', //REMOVE ME LATER
      q: 'big mac' //REMOVE ME LATER
    },
    headers: {
      'content-type': 'application/json'
    }
  };

  request.get(options, function(err, response, body) {
    if (err) console.error(err);
    var results = JSON.parse(body).list.item
    res.send(results);
  });
});

app.get('/food', function(req, res) {
  var options = {
    url: 'http://api.nal.usda.gov/ndb/reports',
    qs: {
      api_key: '2NvUKo0fX0jlycZTtGjJ4kuSJdPk8RmWMgZmxbb5', //REMOVE ME LATER
      ndbno: '21237' //REMOVE ME LATER - BIG MACS
    },
    headers: {
      'content-type': 'application/json'
    }
  };

  request.get(options, function(err, response, body) {
    if (err) console.error(err);
    var results = JSON.parse(body).report;
    res.send(results);
  });
});

app.listen(port, function() {
  console.log("Server listening in on port " + port);
});
