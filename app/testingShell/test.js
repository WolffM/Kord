//Example for reference from learn-mocha github:
// var assert = require("assert"); // node.js core module

// describe('Array', function(){
//   describe('#indexOf()', function(){
//     it('should return -1 when the value is not present', function(){
//       assert.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so indexOf returns -1
//     })
//   })
// })

//use npm get -g mocha
//or mocha.js, mocha.css

//Db testing
var db = require("../lib/db/db.js");
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');


//Setup required for
var mocha = new Mocha;

fs.readdirSync('../lib').filter(function(file){
    return file.substr(-3) === '.js';
}).forEach(function(file){
    mocha.addFile(
        path.join('../lib', file)
    );
});


describe('')


// db.createUser('joe@placebetter', 'userpass', 1,
// 	function (error, user) {
// 		console.log('create user:');
// 		printresult(error, user);
// 	}
// );

// db.createUser('joe' + Math.random(), 'userpass' + Math.random(), 1,
// 	function (error, user) {
// 		console.log('create user:');
// 		printresult(error, user);
// 	}
// );

// db.readUser(1,
// 	function (error, user) {
// 		console.log('read user:');
// 		printresult(error, user);

// 		user.userpass = 'betterpass';

// 		db.updateUser(user,
// 			function (error, user) {
// 				console.log('update user:');
// 				printresult(error, user);
// 			}
// 		);
// 	}
// );

// db.readModeratorsFor(1,
// 	function (error, users) {
// 		console.log('read moderators for:');
// 		printresults(error, users);
// 	}
// );

// db.readMembersFor(2,
// 	function (error, users) {
// 		console.log('read members for:');
// 		printresults(error, users);
// 	}
// );

// db.destroyUser(4,
// 	function (error, user) {
// 		console.log('destroy user:');
// 		printresult(error, user);
// 	}
// );


// var joe = db.createUser('joe' + Math.random(), 'userpass' + Math.random(), 1,
// 	function (error, user) {
// 		console.log('create user:');
// 		printresult(error, user);

// 		db.createRoom('http://' + Math.random(), 'bestpass' + Math.random(), user.userid,
// 			function (error, room) {
// 				console.log('create room:');
// 				printresult(error, room);
// 			}
// 		);
// 	}
// );

// db.readRoom(1,
// 	function (error, room) {
// 		console.log('read room:');
// 		printresult(error, room);
// 	}
// );

// db.readRoomsFor(7,
// 	function (error, rooms) {
// 		console.log('read rooms for:');
// 		printresults(error, rooms);
// 	}
// );

// db.authenticateUser('user1@place.com', 'pass1',
// 	function (error, result) {
// 		console.log('authenticate user:');
// 		printresult(error, result);
// 	}
// );

// db.authenticateUser('user2place.com', 'pass2',
// 	function (error, result) {
// 	if (error) console.log('didnt authenticate invalid username');
// 		else{
// 			console.log('authenticated invalid username :');
// 			printresult(error,result):
// 		}
// 	}
// );

// db.authenticateUser('user3@place.com', 'pass3toolongoffpasswordtoolongoffpasswordtoolongoffpassword',
// 	function (error, result) {
// 	if (error) console.log('didnt authenticate too long password');
// 		else{
// 			console.log('authenticated too long password :');
// 			printresult(error,result):
// 		}
// 	}
// );

// db.authenticateUser('user4@place.com', 'pass4_+*&?"|><>~~`)',
// 	function (error, result) {
// 	if (error) console.log('didnt authenticate invalid password');
// 		else{
// 			console.log('authenticated invalid password :');
// 			printresult(error,result):
// 		}
// 	}
// );
///////Chat testing

//placeholder for future

///////Other testing

//placeholder for future