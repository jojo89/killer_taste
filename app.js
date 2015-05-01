var express = require('express');
var app = express();
var logger = require('./logger');
var only_get = require('./only_get.js');
app.use(logger);
app.use(only_get);
app.use(express.static('public'));

var cities = ['Caspiana', 'Indigo', 'Paradise'];

app.get('/cities', function(request, response) {
    response.send(cities);
  });

  
  app.get('/locations', function (request, response) {
    response.redirect(301, '/cities');
  });
  

app.listen(3001, function(){
  console.log("Running Express");
});