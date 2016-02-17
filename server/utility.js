exports.createSession = function(req, user) {
  // use getter
  return req.session.regenerate(function(err){
    req.session.username = user.firstname;
  });
  // this works without regenerate, with just an unwrapped:
  //  req.session.username = user.get('username');

  //req.session.cookie.maxAge = 3600000
  //req.session.cookie.expires = new Date(Date.now() + hour)
  
};

exports.isLoggedIn = function(request, response, callback){
  if(request.session.username){
    callback(response);
  } else {
    response.redirect("/login");
  }
};