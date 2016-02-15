var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

///////// DB ///
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:mvp';
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', function(){
  console.log('Error with DB connection');
});
db.once('open', function() {
  console.log('DB connection open');
});
////////

var app = express();
app.use(morgan('dev'));
// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session
// app.use(session({
//   secret : 'mySecret',// should be unique and long, see ruby doc
//   // forces a session to be saved back to the session store:
//   resave: false,
//   saveUninitialized: false
// }));

app.get('/', 
  function(req, res) {
    res.send('hello world');
});

var port = process.env.PORT || 2000;

app.listen(port);

console.log('Server now listening on port ' + port);
