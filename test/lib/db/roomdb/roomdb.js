var db = require('../db');
var chatdb = require('../chatdb');

exports.create = function (roomid, url, roompass, chat) {
	return new Room(roomid, url, roompass, chat);
};

exports.createRoom = createRoom;
exports.joinRoomModerator = joinRoomModerator;
exports.joinRoomMember = joinRoomMember;
exports.readRoom = readRoom;
exports.readRoomsFor = readRoomsFor;
exports.readEntireRoom = readEntireRoom;
exports.updateRoom = updateRoom;
exports.destroyRoom = destroyRoom;

exports.authenticateMember = authenticateMember;

var TABLE = 'rooms';
var ID = 'roomid';

/*
 * constructor
 * */

function Room(roomid, url, roompass, chat) {
	this.roomid = roomid;
	this.url = url;
	this.roompass = roompass;
	this.chat = chat;
}

/*
 * create functions
 * */

function createRoom(url, roompass, userid, callback) {
	var chat = chatdb.create();
	var data = [];
	data[data.length] = db.nextID(TABLE, ID);
	data[data.length] = url;
	data[data.length] = roompass;
	data[data.length] = chat;
	db.createObject(TABLE, data, ID,
		function (error, result) {
			if (error) return callback(error);

			var roomid = result;
			db.createBoard(roomid,
				function (error, result) {
					if (error) return callback(error);

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
									var room = new Room(roomid, url, roompass, chat);
									return callback(db.SUCCESS, room);
								}
							);
						}
					);
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

/*
 * read functions
 * */

function readRoom(roomid, callback) {
	db.readObject(TABLE, ID, roomid,
		function (error, result) {
			if (error) return callback(error);

			var url = result['url'];
			var roompass = result['roompass'];
			var chat = result['chat'];
			var room = new Room(roomid, url, roompass, chat);
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
							readBoardsFor(roomid,
								function (error, result) {
									if (error) return callback(error);

									room['boards'] = result;
									return room;
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