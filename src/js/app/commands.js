define(['libs/knockout', 'libs/jquery', 'app/utils', 'libs/moment', 'models/message'], function(ko, $, utils, moment, MessageModel) {
	return function(chatModel, userModel, pubnubModel) {

		var typingInterval;

		var commands = {
			typing: function(name, time) {
				var foundUser = utils.findUserByName(chatModel.typingUsers(), name);

				if (foundUser < 0) {
					chatModel.typingUsers.push({
						name: name,
						time: time
					});
				} else {
					chatModel.typingUsers()[foundUser].time = moment();
				}

				if (chatModel.typingUsers().length > 0 && !typingInterval) {
					typingInterval = setInterval(function() {
						chatModel.typingUsers.remove(function(typingUser) {
							return moment().diff(typingUser.time) > 2000;
						});

						if (chatModel.typingUsers().length === 0) {
							clearInterval(typingInterval);
							typingInterval = null;
						}
					}, 1000);
				}

				return true;
			},
			setName: function(name, time, uuid) {
				var userInList = utils.findUserByUuid(chatModel.users(), uuid);

				if (userInList >= 0) {
					chatModel.users()[userInList].name = name;
				} else {
					userInList = chatModel.users.push({
						name: name,
						uuid: uuid
					});
				}

				chatModel.messages.push(new MessageModel().type('text').data('вошел в чат').name(name).time(time));
			},
			replaceName: function(name, time, uuid) {
				var userInList = utils.findUserByUuid(chatModel.users(), uuid);

				if (userInList >= 0) {
					if (chatModel.users()[userInList].name !== name) {
						chatModel.messages.push(new MessageModel().type('text').data('изменил имя').name(name).time(time));
						chatModel.users()[userInList].name = name;
					}
				} else {
					userInList = chatModel.users.push({
						name: name,
						uuid: uuid
					});
					chatModel.messages.push(new MessageModel().type('text').data('вошел в чат').name(name).time(time));
				}
			},
			getName: function(name, time, uuid) {
				if (uuid !== userModel.id()) {
					return;
				}

				var message = new MessageModel();

				message.time(moment().unix());
                message.name(userModel.name());
                message.text(JSON.stringify({
                    cmd: 'setName',
                    args: [ userModel.id() ]
                }) + '|system');

                message = utils.prepareMessage(ko.toJS(message));
                chatModel.lastSystemMessage(message);

                pubnubModel.pubnub.publish({
                    channel: pubnubModel.channel(),
                    message: JSON.stringify(message)
                });
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