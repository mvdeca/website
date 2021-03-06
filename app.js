var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var routes = require('./routes/index');
var DB = require('./userModels/userSchema');
var sgTransport = require('nodemailer-sendgrid-transport');
var bcrypt = require('bcryptjs');


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
      html: '<b>Congrats you are now a member of MVDECA. If you are having any issues logging in, contact an officer.</b>'
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

//sendmail("sahasd@gmail.com")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'mvdeca' })); // session secret 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function (username, password, done) {
    process.nextTick( function afterTick() {
      DB.findOne({'email':username}, function whenFound (err, user) {
        if (err) { 
          return done(err); 
        }
        if (!user) { 
          return done(null, false); 
        }
    bcrypt.compare(password, user.password, function(err, res) {
        if (res == true) {
          return done(null, user);
        }
        else {
          return done(null,false);
        }
    });



        /*user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user); 
          }
          else {
            return done(null, false);
          }
        });*/
      });
    });
  }
));

passport.serializeUser( function whenSerialized(user, done) {
  done(null, user);
});
passport.deserializeUser( function whenDeserialized(user, done) {
  done(null, user);
});

function isValidPassword(user, password){
  return bcrypt.compareSync(password, user.password);
}

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stack trace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
