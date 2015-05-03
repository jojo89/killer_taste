var express = require('express');
var app = express();
var logger = require('./logger');
var only_get = require('./only_get.js');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
app.use(logger);
// app.use(only_get);
app.use(express.static('public'));

var cities = {
  'Lotopia': 'Rough and mountainous',
  'Caspiana': 'Sky-top island',
  'Indigo': 'Vibrant and thriving',
  'Paradise': 'Lush, green plantation',
  'Flotilla': 'Bustling urban oasis'
};

var citiesYear = {
  5000: 'Lotopia',
  5100: 'Caspiana',
  5105: 'Indigo',
  6000: 'Paradise',
  7000: 'Flotilla'
};

app.param('name', function (request, response, next) {
  request.cityName = parseCityName(request.params.name);
  next();
});

app.param('year', function(request, response, next) {
  if(isYearFormat(request.params.year)) {
    next();
  } else {
    console.log(request.params.year)
    response.status(400).json('Invalid Format for Year');
  }
});

app.get('/cities/year/:year', function(request, response) {
  var year = request.params.year;
  var city = citiesYear[year];
  if(!city) {
    response.status(404).json("No City found for given year");
  } else {
    response.json("In " + year + ", " + city + " is created.");
  }
});

app.get('/citays', function(request, response) {
  if(request.query.search){
    response.json(citySearch(request.query.search));
   }
  response.send(cities);
});

app.get('/cities/:name', function (request, response) {
  var cityName = parseCityName(request.cityName);
  var cityInfo = cities[cityName];
  if(cityInfo) {
    response.json(cityInfo);
  } else {
    response.status(404).json('City not found');
  }
});


app.get('/cities', function (request, response) {
  response.json(cities);
});

app.get('/locations', function (request, response) {
  response.redirect(301, '/cities');
});

app.post('/cities', parseUrlencoded, function (request, response) {
  if(request.body.description.length > 4){
    var cities = createCity(request.body.name, request.body.description);
    response.status(201).json(cities);
  }else{
    response.status(400).json('Invalid City');
  }
});

app.delete('/cities/:name', function (request, response) {
  if(cities[request.cityName]){
    delete cities[request.cityName];
    response.sendStatus(200);
  }else{
    response.sendStatus(404);
  }
});

var createCity = function(name, description){
  cities[name] = description;
  return cities; 
};

function isYearFormat(value) {
  var regexp = RegExp(/^\d{4}$/);
  return regexp.test(value);
}

function parseCityName(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}

function citySearch (keyword) {
  var regexp = RegExp(keyword, 'i');
  var result = cities.filter(function (city) {
    return city.match(regexp);
  });

  return result;
}
  

app.listen(3001, function(){
  console.log("Running Express");
});