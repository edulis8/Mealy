///////// DB ///
var mongoose = require('mongoose');


var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:mvp';

console.log('mongoURI', mongoURI);

mongoose.connect(mongoURI);

var db = mongoose.connection;

db.on('error', function(){
  console.log('Error with DB connection');
});
db.once('open', function() {
  console.log('DB connection open');
});

/////////
// Schemas
/////////

var mealsSchema = mongoose.Schema ({
    menu: String,
    veg: String,
    glut: String,
    cookname: String,
    date: Date
  });


var Meal = mongoose.model('Meal', mealsSchema);

module.exports = Meal;
