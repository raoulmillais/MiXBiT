define([
	'lodash',
	'room/ui',
	'room/io',
	'room/player',
	'room/playlist'
], function (_, Ui, Io, Player, Playlist) {
	'use strict';

	var Room = (function () {

		function Room() {
			console.log('Room | init');
			var self = this;
			this.player = new Player(
				function stateChanged() {
					console.log('Main | player state changed');
					self.ui.update();
				}
			);
			this.ui = new Ui(this);
			this.io = new Io(
				function onConnect() {
					console.log('Main | io connected');
					self.ui.connected();
				},
				function onQueue(queue) {
					console.log('Main | io queue');
					var playlist = new Playlist();
					self.player.setPlaylist(playlist);
					self.player.play();
					self.ui.setPlaylist(playlist);
					self.ui.update();
				}
			);
		}

		return Room;

	})();

	var room = new Room();

});
