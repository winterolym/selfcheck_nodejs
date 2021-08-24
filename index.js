var express = require('express');
var methodOverride = require('method-override');
var util = require('./util');
// var https = require('https');
var fs = require('fs');
var path = require("path");
var app = express();

// const httpsServer = https.createServer({
//   key: fs.readFileSync(path.join(process.env.SSLPATH,'fullchain.cer')),
//   cert: fs.readFileSync(path.join(process.env.SSLPATH,'hahah.tech.key')),
// }, app);

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(util.logger);

app.get('/', function(req, res) {
  res.send('Hello World');
});
app.use('/api/run', require('./routes/run'));
app.use('/api/get', require('./routes/get'));

// httpsServer.listen(3001, () => {
//   console.log('HTTPS Server running on port 3001');
// });

// var http = require('http');

// var server = http.createServer(function(request, response) {});


// server.listen(process.env.PORT||3000, "0.0.0.0", function() {
//   console.log('HTTPS Server running on port 3001');
// });
var port = process.env.PORT?? 3001;
app.listen(port, '0.0.0.0', function(){
  console.log(new Date().toISOString() + '[Selfcheck] Server listening on 0.0.0.0:' + port);
});