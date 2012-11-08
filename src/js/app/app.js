define(['libs/jquery', 'libs/knockout', 'libs/hasher', 'libs/jstorage', 'libs/moment', 'libs/jquery.jgrowl', 'app/utils', 'models/pubnub', 'models/chat', 'models/hash', 'models/user', 'models/message'],

function ($, ko, hasher, jstorage, moment, $jgrowl, utils, pubnub, chatModel, hashModel, userModel, MessageModel) {
    'use strict';

    var pubnubParams = {
        restore: false,
        pubkey: 'pub-6cabf426-7367-47cc-b60c-0fc6c67d2665',
        subkey: 'sub-f0a158e6-0e58-11e2-8231-7fb88e9a4259',
        ssl: true
    };

    var parseMessage = function (jsonMessage, callback) {
        try {
            jsonMessage = JSON.parse(jsonMessage);
        } catch (e) {
            return;
        }

        if (!jsonMessage.time || !jsonMessage.text || !jsonMessage.name) {
            return;
        }

        if (utils.isEmpty(jsonMessage.text)) {
            return;
        }

        var message = new MessageModel();
        var time = moment(jsonMessage.time);

        if (time.isValid()) {
            message.time(time);
        }

        if (utils.isEmpty(jsonMessage.name)) {
            jsonMessage.name = 'Неизвестный';
        }

        if (jsonMessage.name === userModel.name()) {
            message.name('Я');
        } else {
            message.name(jsonMessage.name);
        }

        message.text(jsonMessage.text);

        callback(message);
    };

    var pubnubDispatcher = {
        callback: function (jsonMessage) {
            parseMessage(jsonMessage, function (message) {
                chatModel.messages.push(message);
            });
        },
        disconnect: function () {
            chatModel.isReady(false);
        },
        reconnect: function () {
            if (!chatModel.isReady()) {
                chatModel.isReady(true);
            }
        },
        connect: function () {
            pubnubModel.pubnub.here_now({
                channel: pubnubModel.channel(),
                callback: function (event) {
                    chatModel.usersOnline(event.occupancy);

                    if (userModel.name() === userModel.defaultName) {
                        userModel.name(userModel.defaultName + ' ' + chatModel.online().toString());
                    }
                }
            });

            pubnubModel.pubnub.history({
                channel: pubnubModel.channel(),
                limit: 100
            }, pubnubModel.historyHandler(function(message) {
                parseMessage(message, function (message) {
                    chatModel.messages.push(message);
                });
            }));

            chatModel.isReady(true);
        },
        presence: function (event) {
            chatModel.usersOnline(event.occupancy);
        }
    };

    var pubnubModel = pubnub(pubnubParams, pubnubDispatcher);

    chatModel = chatModel(pubnubModel, userModel);

    hashModel.userId.subscribe(function (newId) {
        userModel.id(newId.toString());
    });

    hashModel.channelId.subscribe(function (newChannel) {
        pubnubModel.channel(newChannel.toString());
    });

    userModel.name.subscribe(function (newId) {
        jstorage.set('user', ko.toJSON(userModel));
    });

    hasher.initialized.add(function (currentHash) {
        var savedUser = jstorage.get('user');

        if (savedUser) {
            try {
                savedUser = JSON.parse(savedUser);
            } catch (e) {
                savedUser = null;
                jstorage.flush();
            }
        }
        
        if (currentHash !== '') {
            hashModel.fullHash(currentHash);
            if (userModel.id() === '') {
                if (savedUser) {
                    hashModel.userId(savedUser.id);
                } else {
                    hashModel.userId(utils.randomString());
                }
            }
        } else {
            if (savedUser) {
                hashModel.userId(savedUser.id);
                hashModel.channelId(utils.randomString());
            } else {
                hashModel.userId(utils.randomString());
                hashModel.channelId(utils.randomString());
            }
        }

        if (savedUser) {
            userModel.id(savedUser.id);
            userModel.name(savedUser.name);
        }
    });

    hasher.init();
    hasher.replaceHash(hashModel.fullHash());

    jstorage.set('user', ko.toJSON(userModel));

    pubnubModel.init();
    pubnubModel.subscribe();

    $(document).ready(function () {
        var MasterModel = function () {
            this.chatModel = chatModel;
            this.userModel = userModel;
        };

        var heightControl = function (currentHeight) {
            var heightOffset = 250;
            $('#app .messages').css('height', (currentHeight - heightOffset) + 'px');
        };

        $(window).hover(function(e) {
            if (e.fromElement) {
                chatModel.isActive(false);
            } else {
                chatModel.isActive(true);
            }
        });

        $(window).resize(function() {
            heightControl($(window).height());
            chatModel.scrollToBottom();
        });

        heightControl($(window).height());

        ko.applyBindings(new MasterModel(), $('body').get(0));
    });
});