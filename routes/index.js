var express = require('express');
var passport = require('passport');
var DB = require('../userModels/DB');
var User = require('../userModels/userSchema');
var router = express.Router();

function isAuth (req, res, next) {  //middleware to check if the user is logged in, if not redirect to login
	if (req.user) {
		next();
  }
  else {
    res.redirect('/login');
	}
}

//GET home page. 
router.get('/', function atHome (req, res, next) {
  if (req.user) {
    res.render('index', {"loggedIn": true, "username" : req.user});
  }
  else {
	  res.render('index', {"loggedIn": false, "username" : "null"});
  }
});


//login web page route
router.get('/login', function atLogin (req, res, next) {
  	res.render('login');
});

//login verification route
router.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login'
}));

//create a user route
router.get('/register', function onRegister (req, res, next) {
  res.render('register');
});

//send new credentials to server
router.post('/register', function whenRegister(req, res, next) {
  DB.createUser(req.body.uname, req.body.pass, req.body.fname, req.body.lname, req.body.sid, req.body.em, req.body.mf, req.body.bday, req.body.gday, req.body.stat, req.body.cnum, req.body.text, req.body.shirt, req.body.pfn, req.body.pln, req.body.r, req.body.pm, req.body.pp, req.body.udate, req.body.addr, req.body.zcode);
  next();
}, function afterRegistration(req, res) {
  res.redirect('/login');
});

//logout session kill route
router.get('/logout', function atLogout (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/login');
  });
});

router.get('/community', function onCommunity (req, res, next) {
    if (req.user) {
    res.render('community', {"loggedIn": true, "username" : req.user});
  }
  else {
    res.render('community', {"loggedIn": false, "username" : "null"});
  }
});

router.get('/competitions', function onCommunity (req, res, next) {
    if (req.user) {
    res.render('competitions', {"loggedIn": true, "username" : req.user});
  }
  else {
    res.render('competitions', {"loggedIn": false, "username" : "null"});
  }
});

router.get('/about', function onCommunity (req, res, next) {
    if (req.user) {
    res.render('about', {"loggedIn": true, "username" : req.user});
  }
  else {
    res.render('about', {"loggedIn": false, "username" : "null"});
  }
});



module.exports = router;