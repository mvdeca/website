var mongoose = require('mongoose');
var userSchema = require('./userSchema.js');
var passport = require('passport');
var bcrypt = require('bcryptjs');


function createHash(password){
    console.log("THE PASSWORDIS :"+ password);
	return bcrypt.hashSync(password, 8);
}


exports.createUser = function (pass, fname, lname, sid, em, mf, bday, gday, stat, cnum, text, shirt, pfn, pln, r, pm, pp, udate, addr, zcode) {
	return userSchema.count({email: em}, function whenCounted(err, count) {
		if (err) {
			throw err;
		}
		if (count > 0) {
			console.log("Can't create another user with same email");
			return false;
		}
		bcrypt.genSalt(8, function(err, salt) {
		    bcrypt.hash(pass, salt, function(err, hash) {
				var user = new userSchema({
				    password: hash,
				    firstname: fname,
				    lastname: lname,
				    student_id: sid,
				    email: em,
				    gender: mf,
				    birthday: bday,
				    gradYear: gday, 
				    status: stat,
				    cell: cnum,
				    canText: text,
				    tshirt : shirt,
				    pfname: pfn,
				    plname: pln,
				    relation: r,
				    pmail: pm,
				    pphone: pp,
				    updates: udate,
				    address: addr,
				    zipcode: zcode,
				    hours: 0
				});
				user.save(function(err) {
					if (err) {
						console.log(err);
						throw err;
					}
					console.log('user: '+ fname +' created!');
				});
		    });
		});
		return true;
	});
}

exports.updateHours = function (id, numHours) {
	return userSchema.findOne({student_id: id}, function (err,user){
		if (err) console.log("something went wrong when finding the user");
		if (user == null || user === null) return "non-existant user";
		user.hours += numHours;
		user.save(function (err){
			if (err) console.log("something went wrong when saving the user");
			console.log("The amount of hours the user has is " + user.hours);
			console.log("--------------------------------------------------");
		});
		return user.hours+"is how many hours "+user.student_id+ " or " +user.firstname+" "+user.lastname + "has";
	});
}



