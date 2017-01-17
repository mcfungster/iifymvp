console.log('in server.js');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || 8000;
console.log("environment", process.env.PORT);

app.use(express.static('client'));
app.use(bodyParser.json());

// app.get('/', function(req, res) {
//   console.log("test");
//   res.send('IIFYM');
// });

app.post('/search', function(req, res) {
  // console.log('in /search route', req.body.data);
  var options = {
    url: 'http://api.nal.usda.gov/ndb/search',
    qs: {
      api_key: '2NvUKo0fX0jlycZTtGjJ4kuSJdPk8RmWMgZmxbb5', //REMOVE ME LATER
      q: req.body.data,
      max: 10,
    },
    headers: {
      'content-type': 'application/json'
    }
  };
  request.get(options, function(err, response, body) {
    if (err) {
      console.log("error?");
      // console.error(err);
      res.sendStatus(404)
    }
    var results = JSON.parse(body);
    // console.log(results);
    results = (results.errors)?
      [{'name': "No results found for" + req.body.data, 'error': true}]
      : results.list.item;

    res.send(results);
  });
});

app.post('/food', function(req, res) {
  console.log('in /food route', req.body.data);
  var options = {
    url: 'http://api.nal.usda.gov/ndb/reports',
    qs: {
      api_key: '2NvUKo0fX0jlycZTtGjJ4kuSJdPk8RmWMgZmxbb5', //REMOVE ME LATER
      ndbno: req.body.data //REMOVE ME LATER - BIG MACS
    },
    headers: {
      'content-type': 'application/json'
    }
  };

  request.get(options, function(err, response, body) {
    if (err) console.error(err);
    var results = JSON.parse(body).report;
    // console.log(Object.keys(results));
    // console.log(Object.keys(results.food));
    console.log(results);
    console.log(results.food.nutrients);
    res.send(results.food);
  });
});

app.listen(port, function() {
  console.log("Server listening in on port " + port);
});
