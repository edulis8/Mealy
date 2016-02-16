var express = require('express');
var mongoose = require('mongoose');//need?
var morgan = require('morgan');
var bodyParser = require('body-parser');

var Meal = require('./db.js')

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

app.get('/api/meals', function(req, res){
  Meal.find({}).exec(function(err, meals){
    if(err){
      console.log(err);
      res.send(500);
      return;
    }
    res.send(200, meals);
  });
});

app.post('/api/meals', function(req, res){
  console.log('ping', req.body);
  var incoming = req.body;
  var meal = new Meal({
    menu: incoming.menu,
    veg: incoming.veg,
    glut: incoming.glut,
    cookname: incoming.cookname,
    date: incoming.date
  });

  meal.save(function(err, newMeal){
    if(err){
      console.log('error saving');
      res.send(500);
    } else {
      console.log('success saving?')
      console.log('Meal', meal.menu, meal.veg)
      res.send(200, newMeal);
    }
  });
});
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

var port = process.env.PORT || 8000;

app.listen(port);

console.log('Server now listening on port ' + port);
