var db = require('../db');
var chatdb = require('../chatdb');
var userdb = require('../userdb');
var boarddb = require('../boarddb');

exports.create = function (roomid, roomurl, roompass, chat) {
	return new Room(roomid, roomurl, roompass, chat);
};

exports.createRoom = createRoom;
exports.joinRoomModerator = joinRoomModerator;
exports.joinRoomMember = joinRoomMember;
exports.readRoom = readRoom;
exports.readRoomByUrl = readRoomByUrl;
exports.readRoomsFor = readRoomsFor;
exports.readModeratorsFor = readModeratorsFor;
exports.readMembersFor = readMembersFor;
exports.readEntireRoom = readEntireRoom;
exports.updateRoom = updateRoom;
exports.destroyRoom = destroyRoom;
exports.unjoinRoomModerator = unjoinRoomModerator;
exports.unjoinRoomMember = unjoinRoomMember;

exports.authenticateMember = authenticateMember;

exports.MAX_ROOMS = 5;

var TABLE = 'rooms';
var ID = 'roomid';

/*
 * constructor
 * */

function Room(roomid, roomurl, roompass, chat) {
	this.roomid = roomid;
	this.roomurl = roomurl;
	this.roompass = roompass;
	this.chat = chat;
}

/*
 * create functions
 * */

function createRoom(roomurl, roompass, userid, callback) {
	var chat = chatdb.create();
	var data = [];
	data[data.length] = db.nextID(TABLE, ID);
	data[data.length] = roomurl;
	data[data.length] = roompass;
	data[data.length] = chat;
	db.createObject(TABLE, data, ID,
		function (error, result) {
			if (error) return callback(error);

			var roomid = result;
			db.createBoard(roomid,
				function (error, result) {
					if (error) return callback(error);

					if(userid) {
						joinRoomModerator(roomid, userid,
							function (error, result) {
								if (error) {
									uncreateRoom(roomid, error,
										function (error, result) {
											return callback(error);
										}
									);
								}

								joinRoomMember(roomid, userid,
									function (error, result) {
										if (error) {
											uncreateRoom(roomid, error,
												function (error, result) {
													return callback(error);
												}
											);
										}
										var room = new Room(roomid, roomurl, roompass, chat);
										return callback(db.SUCCESS, room);
									}
								);
							}
						);
					} else {
						var room = new Room(roomid, roomurl, roompass, chat);
						return callback(db.SUCCESS, room);
					}
				}
			);
		}
	);
}

function joinRoomModerator(roomid, userid, callback) {
	db.joinObjects(TABLE, 'moderators', roomid, userid,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}

function joinRoomMember(roomid, userid, callback) {
	db.joinObjects(TABLE, 'members', roomid, userid,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}

function unjoinRoomModerator(roomid, userid, callback) {
	db.unjoinObject('rooms_moderators', 'roomid', roomid, 'userid', userid,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}

// should also remove from moderators
function unjoinRoomMember(roomid, userid, callback) {
	db.unjoinObject('rooms_members', 'roomid', roomid, 'userid', userid,
		function (error, result) {
			if (error) return callback(error);

			unjoinRoomModerator(roomid, userid,
				function (error, result) {
					if (error) return callback(error);
					return callback(db.SUCCESS, userid);
				}
			);
		}
	);
}

/*
 * read functions
 * */

function readRoom(roomid, callback) {
	db.readObject(TABLE, ID, roomid,
		function (error, result) {
			if (error) return callback(error);

			// var room = new Room(undefined, undefined, undefined, undefined);
			// for (var prop in result) {
			// 	room[prop] = result[prop];
			// }

			var roomurl = result['roomurl'];
			var roompass = result['roompass'];
			var chat = result['chat'];
			var room = new Room(roomid, roomurl, roompass, chat);
			return callback(db.SUCCESS, room);
		}
	);
}

function readRoomByUrl(roomurl, callback) {
	db.readObject(TABLE, 'roomurl', roomurl,
		function (error, result) {
			if (error) return callback(error);

			var roomid = result['roomid'];
			var roompass = result['roompass'];
			var chat = result['chat'];
			var room = new Room(roomid, roomurl, roompass, chat);
			return callback(db.SUCCESS, room);
		}
	);
}

function readRoomsFor(userid, callback) {
	db.readObjectsFor('rooms_members', ID, 'userid', userid, readRoom,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}

function readModeratorsFor(roomid, callback) {
	db.readObjectsFor('rooms_moderators', userdb.ID, 'roomid', roomid, userdb.readUser,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}

function readMembersFor(roomid, callback) {
	db.readObjectsFor('rooms_members', userdb.ID, 'roomid', roomid, userdb.readUser,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}

function readEntireRoom(roomid, callback) {
	readRoom(roomid,
		function (error, result) {
			if (error) return callback(error);

			var room = result;
			readModeratorsFor(roomid,
				function (error, result) {
					if (error) return callback(error);

					room['moderators'] = result;
					readMembersFor(roomid,
						function (error, result) {
							if (error) return callback(error);

							room['members'] = result;
							boarddb.readBoardsFor(roomid,
								function (error, result) {
									if (error) return callback(error);

									room['boards'] = result;
									return callback(undefined, room);
								}
							);
						}
					);
				}
			);
		}
	);
}

/*
 * update functions
 * */

function updateRoom(room, callback) {
	db.updateObject(TABLE, ID, room,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}

/*
 * destroy functions
 * */

function destroyRoom(roomid, callback) {
	db.destroyObject(TABLE, ID, roomid,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}

function uncreateRoom(roomid, uncreate, callback) {
	destroyRoom(roomid,
		function (error, result) {
			if (error) return callback(uncreate + '; ' + error);
			return callback(uncreate);
		}
	);
}

function authenticateMember(roomid, roompass, callback) {
	db.authenticate(TABLE, ID, 'roomid', roomid, 'roompass', roompass,
		function (error, result) {
			if (error) return callback(error);
			return callback(db.SUCCESS, result);
		}
	);
}
