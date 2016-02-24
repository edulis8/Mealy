var express = require('express');
var mongoose = require('mongoose');//need?
var morgan = require('morgan');
var bodyParser = require('body-parser');
var util = require('./utility.js');


var db = require('./db.js');

var app = express();
app.use(morgan('dev'));
// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

// session
// app.use(session({
//   secret : 'fdskljkjdfsdsfjk',// should be unique and long, see ruby doc
//   // forces a session to be saved back to the session store:
//   resave: false,
//   saveUninitialized: false
// }));

// app.get('/links', util.checkUser, handler.fetchLinks);
// app.post('/links', handler.saveLink);

app.get('/api/meals', function(req, res){
  db.Meal.find({}).exec(function(err, meals){
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
  var meal = new db.Meal({
    menu: incoming.menu,
    veg: incoming.veg,
    glut: incoming.glut,
    cookname: incoming.cookname,
    date: incoming.date,
    eaters: incoming.eaters
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


app.post('/api/eaters', function(req, res){
  console.log('api/meals', req.body);
  var incoming = req.body;

  db.Meal.findOne({ _id : incoming._id }).exec(function(err, match){
    if(err){
      console.log('error api/eaters saving');
      res.send(500);
    } 
    if(match){
      console.log('before',match.eaters);
      console.log('incoming eaters', incoming.eaters);
      match.eaters = incoming.eaters;
      match.save(function(err, newEaters){
        if(err){console.log('error saving new eaters'); res.send(500);}
        else{
          console.log('success saving new eaters')
          console.log('after saving success',match.eaters);
          res.sendStatus(201, 'yo');
        }
      });
    } 
  });

});

app.get('/api/getprofile', function(req, res){
  console.log('ping')
  console.log(req.body.sessionID)
  var id = req.body.sessionID;
  console.log(id)
});

app.post('/api/profiles', function(req, res){
  console.log('api/profiles', req.body);
  var incoming = req.body;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;


  db.User.findOne({ lastname : lastname, firstname: firstname})
    .exec(function(err, user){
      if(err){res.sendStatus(500); return;}
      console.log('user', user);
      if(!user){
        console.log('!user', !user);

        var newUser = new db.User(req.body);
        newUser.save(function(err, newUser){
          if(err){res.sendStatus(500); return;}
          console.log('success saving a user')
          // create session
          //util.createSession(req, newUser);
          res.send(newUser._id);
        });
      // if user exists
      // TODO: make this an else if ? and then add other else?
      } else {
        console.log('If on signup: Account already exists for that name. Go to login.');
        //create session with user
        if(incoming.password === user.password){
          console.log(user.password, incoming.password)
          res.send(user._id);
        }
        //util.createSession(req, newUser);

        //res.send('/login');
      }
    });
});
 
var port = process.env.PORT || 8000;

app.listen(port);

console.log('Server now listening on port ' + port);

  // meal.save(function(err, newMeal){
  //   if(err){
  //     console.log('error saving');
  //     res.send(500);
  //   } else {
  //     console.log('success saving?')
  //     console.log('Meal', meal.menu, meal.veg)
  //     res.send(200, newMeal);
  //   }
  // });
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


