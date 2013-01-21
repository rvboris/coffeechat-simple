define(['libs/jquery', 'app/utils', 'libs/moment', 'models/typing-user'], function($, utils, moment, TypingUser) {
	return function(chatModel, userModel) {

		var typingInterval;

		var commands = {
			typing: function(name, time) {
				var foundUser = utils.findTypingUser(chatModel.typingUsers(), name);

				if (foundUser < 0) {
					chatModel.typingUsers.push(new TypingUser().name(name).time(time));
				} else {
					chatModel.typingUsers()[foundUser].time(moment());
				}

				if (chatModel.typingUsers().length > 0 && !typingInterval) {
					typingInterval = setInterval(function() {
						chatModel.typingUsers.remove(function(typingUser) {
							return moment().diff(typingUser.time()) > 2000;
						});

						if (chatModel.typingUsers().length === 0) {
							clearInterval(typingInterval);
							typingInterval = null;
						}
					}, 1000);
				}

				return true;
			}
		};

		return $.proxy(function(command, params, message) {
			if (!commands[command]) {
				return false;
			} else {
				if (params) {
					params.unshift(message.name(), message.time());
				} else {
					params = [message.name(), message.time()];
				}
				return commands[command].apply(this, params);
			}
		}, this);
	};
});