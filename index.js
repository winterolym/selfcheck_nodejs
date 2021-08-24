var express = require('express');
var methodOverride = require('method-override');
var util = require('./util');
var fs = require('fs');
var path = require("path");
var app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(util.logger);

app.get('/', function(req, res) {
  res.send('Hello World');
});
app.use('/api/run', require('./routes/run'));
app.use('/api/get', require('./routes/get'));

var port = process.env.PORT?? 3001;
app.listen(port, '0.0.0.0', function(){
  console.log(new Date().toISOString() + '[Selfcheck] Server listening on 0.0.0.0:' + port);
});