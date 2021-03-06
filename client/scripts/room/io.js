define([
	'lodash',
	'socketio'
], function (_, socketio) {
	'use strict';

	function Io(onConnectCallback, onRoomStateCallback, onRoomErrorCallback) {
		console.log('IO | init');
		var self = this;
		this.socket = socketio.connect();
		this._onConnectCallback = onConnectCallback;
		this._onRoomStateCallback = onRoomStateCallback;
		this._onRoomErrorCallback = onRoomErrorCallback;
		this.socket.on('connect', function () {
			setTimeout(function () {
				self._onConnect();
			}, 1000);
		});
	}

	Io.prototype._onConnect = function () {
		console.log('IO | connect');
		var self = this;
		this._onConnectCallback();
		var url = document.URL;
		var roomId = url.substring(url.lastIndexOf('/') + 1);
		console.log('IO | connect | session id %s', self.socket.sessionid);
		console.log('IO | connect | room id %s', roomId);
		this.socket.emit('room', roomId);
		this._isConnected = true;
		this._hasSynched = false;
		this.socket.on('room-state', function (roomState) {
			setTimeout(function () {
				self._onRoomState(roomState);
			}, 1000);
		});
		this.socket.on('room-error', function (roomError) {
			self._onRoomError(roomError);
		});
	};

	Io.prototype._onRoomState = function (roomState) {
		console.log('IO | room state');
		console.log(roomState);
		this._onRoomStateCallback(roomState);
		this._hasSynched = true;
	};

	Io.prototype._onRoomError = function (roomError) {
		console.log('IO | room error');
		console.error(roomError);
		this._onRoomErrorCallback(roomError);
	};

	Io.prototype.isConnected = function () {
		return this._isConnected || false;
	};

	Io.prototype.hasSynched = function () {
		return this._hasSynched || false;
	};

	return Io;

});
