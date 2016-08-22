var express = require('express');
var passport = require('passport');
var DB = require('../userModels/DB');
var User = require('../userModels/userSchema');
var exec = require('exec');
var router = express.Router();

function isAuth (req, res, next) {  //middleware to check if the user is logged in, if not redirect to login
	if (req.user) {
		next();
  }
  else {
    res.redirect('/');
	}
}

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log(req.user);
    res.send('hello world');
});

//create a user route
router.get('/register', function onRegister (req, res, next) {
  res.render('register');
});

/*router.get('/userdata', function(req, res, next) {
  var command = 'mongoexport --host localhost --db mvjsa --collection users --csv  --fields fname,lname,email,phone,sid,gender --out data.csv';
  if(process.env.OPENSHIFT_MONGODB_DB_HOST)
    command = 'mongoexport --host $OPENSHIFT_MONGODB_DB_HOST --username $OPENSHIFT_MONGODB_DB_USERNAME --password $OPENSHIFT_MONGODB_DB_PASSWORD --db mvjsa --collection users --csv  --fields fname,lname,email,phone,sid,gender --out data.csv';
  exec(command, function(err, stdout, stderr) {
    if(err) {
      res.send(err);
    }
    res.sendFile(path.join(__dirname,'..', 'data.csv'));
  });
});*/

//send new credentials to server
router.post('/register', function whenRegister(req, res, next) {
  DB.createUser(req.body.pass, req.body.fname, req.body.lname, req.body.sid, req.body.em, req.body.mf, req.body.bday, req.body.gday, req.body.stat, req.body.cnum, req.body.text, req.body.shirt, req.body.pfn, req.body.pln, req.body.r, req.body.pm, req.body.pp, req.body.udate, req.body.addr, req.body.zcode);
  sendmail(req.body.em);
  console.log("user registering with"+req.body);
  //res.redirect('/')
});

//logout session kill route
router.get('/logout', function atLogout (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});


//GET home page. 
router.get('/', function atHome (req, res, next) {
  if (req.user) {
    res.render('index', {"loggedIn": true, "username" : req.user.firstname});
  }
  else {
    res.render('index', {"loggedIn": false, "username" : "null"});
  }
});

router.get('/bbc', function atHome (req, res, next) {
    res.sendFile(__dirname +'bbc/index.html');
});

router.get('/community', function onCommunity (req, res, next) {
    if (req.user) {
    res.render('community', {"loggedIn": true, "username" : req.user.firstname});
  }
  else {
    res.render('community', {"loggedIn": false, "username" : "null"});
  }
});

router.get('/competitions', function onCommunity (req, res, next) {
    if (req.user) {
    res.render('competitions', {"loggedIn": true, "username" : req.user.firstname});
  }
  else {
    res.render('competitions', {"loggedIn": false, "username" : "null"});
  }
});

router.get('/events', function onCommunity (req, res, next) {
    if (req.user) {
    res.render('events', {"loggedIn": true, "username" : req.user.firstname});
  }
  else {
    res.render('events', {"loggedIn": false, "username" : "null"});
  }
});

router.get('/about', function onCommunity (req, res, next) {
    if (req.user) {
    res.render('about', {"loggedIn": true, "username" : req.user.firstname});
  }
  else {
    res.render('about', {"loggedIn": false, "username" : "null"});
  }
});

router.get('/profile', function onCommunity (req, res, next) {
  console.log(req.user.username)
  if (req.user) {
    res.render('profile', {"loggedIn": true, "username" : req.user.firstname, "user": req.user});
  }
  else {
    res.render('profile', {"loggedIn": false, "username" : "null"});
  }
});

function sendEmail (emailID) {
  var options = {
    auth: {
      api_user: 'mvdeca',
      api_key: 'num1world'
    }
  }

  var client = nodemailer.createTransport(sgTransport(options));
    var email = {
      from: 'infotech@mvdeca.org',
      to: 'sahasd@gmail.com',
      subject: 'Change Password',
      text: 'Hello world',
      html: '<b>Hello world</b>'
    };

    client.sendMail(email, function(err, info){
        if (err ){
          console.log(error);
        }
        else {
          console.log('Message sent: ' + info.response);
        }
    });
}

function sendmail (emailID) {
  var options = {
    auth: {
      api_user: 'mvdeca',
      api_key: 'num1world'
    }
  }

  var client = nodemailer.createTransport(sgTransport(options));
    var email = {
      from: 'infotech@mvdeca.org',
      to: emailID,
      subject: 'MVDECA Confirmation',
      text: 'Congrats you are now a member of MVDECA. If you are having any issues logging in, contact an officer',
      html: '<b>Congrats you are now a member of MVDECA. If you are having any issues logging in, contact an officer</b>'
    };

    client.sendMail(email, function(err, info){
        if (err ){
          console.log(error);
        }
        else {
          console.log('Message sent: ' + info.response);
        }
    });
}

  

module.exports = router;
