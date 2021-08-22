var express = require('express');
var methodOverride = require('method-override');
var https = require('https');
var fs = require('fs');
var app = express();

const httpsServer = https.createServer({
  key: fs.readFileSync('${process.env.SSLPATH}fullchain.cer'),
  cert: fs.readFileSync('/home/ubuntu/.acme.sh/hahah.tech/hahah.tech.key'),
}, app);

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', function(req, res) {
  res.send('Hello World');
});
app.use('/api/execute', require('./routes/execute'));
app.use('/api/get', require('./routes/get'));

httpsServer.listen(3001, () => {
  console.log('HTTPS Server running on port 3001');
});

// var port = 3001;
// app.listen(port, function(){
//   console.log('server on! http://localhost:'+port);
// });