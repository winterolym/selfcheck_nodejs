var express = require('express');
var methodOverride = require('method-override');
var app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/execute', require('./routes/execute'));
app.use('/api/get', require('./routes/get'));

var port = 3001;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});