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
app.use(express.static(__dirname + '/../client'));

// session
// app.use(session({
//   secret : 'mySecret',// should be unique and long, see ruby doc
//   // forces a session to be saved back to the session store:
//   resave: false,
//   saveUninitialized: false
// }));

// app.get('/links', util.checkUser, handler.fetchLinks);
// app.post('/links', handler.saveLink);

// exports.fetchLinks = function(req, res) {
//   // video 1hr
//   Link.find({}).exec(function(err, links) {
//     if(err) {
//       console.log(err);
//       res.send(500);
//       return;
//     }
//     res.send(200, links);
//   })
// };

// exports.saveLink = function(req, res) {
//   var uri = req.body.url;

//   if (!util.isValidUrl(uri)) {
//     console.log('Not a valid url: ', uri);
//     return res.send(404);
//   }

//   Link.findOne({ url: uri }).exec(function(err, found) {
//     if (found) {
//       res.send(200, found);
//     } else {
//       util.getUrlTitle(uri, function(err, title) {
//         if (err) {
//           console.log('Error reading URL heading: ', err);
//           return res.send(404);
//         }

//         var link = new Link({
//           url: uri,
//           title: title,
//           base_url: req.headers.origin,
//           visits: 0
//         });

//         link.save(function(err, newLink) {
//           if(err) {
//             res.send(500);
//           } else {
//             res.send(200, newLink);
//           }
//         });
//       });
//     }
//   });
// };




// app.get('/', 
//   function(req, res) {
//     //res.redirect('hello world');
// });

var port = process.env.PORT || 2000;

app.listen(port);

console.log('Server now listening on port ' + port);
