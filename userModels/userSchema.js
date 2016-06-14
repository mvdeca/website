var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema; 
var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}
var connect = function () {
    mongoose.connect(url);
};
connect();
var db = mongoose.connection;
db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});
db.on('disconnected', connect);

var UserSchema = new Schema ({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    firstname: {type: String},
    lastname: {type: String},
    student_id: { type: String },
    email: {type: String},
    gender: {type: String},
    birthday: {type: String},
    gradYear: {type: String}, 
    status: {type: String},
    cell: {type: String},
    canText: {type: String},
    tshirt : {type: String},
    pfname: {type: String},
    plname: {type: String},
    relation: {type: String},
    pmail: {type: String},
    pphone: {type: String},
    updates: {type: String},
    address: {type: String},
    zipcode: {type: String},
    hours: {type: Number},
    testing: {}
});

UserSchema.pre('save', function beforeSave (next) {
	//setting the user to this object
	var user = this; 
	//only if the password has been modified/new
	if (!user.isModified('password')) { 
		return next();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function whenSalted (err, salt) {
        if (err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function whenHashed(err, hash) {
            if (err) return next(err);
            // override the plain password with the hashed one
            user.password = hash;
            next();
        });
    });
});

//verifies if password matches one in db
UserSchema.methods.comparePassword = 
function isSamePassword (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, 
    function whenCompared (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch); // if match -> true, else -> false
    });
};

var user = mongoose.model('users', UserSchema); 
module.exports = user;