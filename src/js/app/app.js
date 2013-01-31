define(['compiled/templates', 'libs/modernizr', 'libs/bootstrap', 'libs/bootstrap.clickover', 'libs/bootstrap.notify', 'libs/bootbox', 'libs/bootstrap.editable', 'libs/jquery', 'libs/jquery.spin', 'libs/knockout', 'libs/hasher', 'libs/jstorage', 'libs/moment', 'app/utils', 'app/commands', 'models/pubnub', 'libs/visibility', 'models/chat', 'models/hash', 'models/user', 'models/message'],

function (Templates, modernizr, $bootstrap, $clickover, $notify, bootbox, $editable, $, $spin, ko, hasher, jstorage, moment, utils, commands, pubnub, Visibility, chatModel, hashModel, userModel, MessageModel) {
    'use strict';

    $('#loader').spin();

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
        var time = moment.unix(jsonMessage.time);

        if (time.isValid()) {
            message.time(time);
        }

        message.text(jsonMessage.text);

        if (utils.isEmpty(jsonMessage.name)) {
            jsonMessage.name = 'Неизвестный';
        }

        if (message.type() === 'system') {
            if (utils.objectEquals(jsonMessage, chatModel.lastSystemMessage())) {
                return;
            }
            
            message.name(jsonMessage.name);
            callback(message);
            return;
        }

        if (utils.objectEquals(jsonMessage, chatModel.lastMessage())) {
            message.name(message.repeatName);
        } else {
            message.name(jsonMessage.name);
        }

        callback(message);
    };

    var pubnubDispatcher = {
        callback: function (jsonMessage) {
            parseMessage(jsonMessage, function (message) {
                if (message.type() === 'text' || message.type() === 'images') {
                    chatModel.messages.push(message);
                    chatModel.scrollToBottom();
                    chatModel.typingUsers.remove(function(typingUser) {
                        return typingUser.name === message.name();
                    });

                    return;
                }

                if (message.type() === 'system') {
                    commands(message.data().cmd, message.data().args, message);
                }
            });
        },
        disconnect: function () {
            chatModel.isReady(false);
            pubnubModel.joined(false);
        },
        reconnect: function () {
            if (!chatModel.isReady()) {
                chatModel.isReady(true);
            }
        },
        connect: function () {
            pubnubModel.pubnub.history({
                channel: pubnubModel.channel(),
                limit: 100,
                error: function() {
                    if (console) {
                        console.log('history error');
                    }
                }
            }, pubnubModel.historyHandler(function(message) {
                parseMessage(message, function (message) {
                    if (message.type() !== 'text' || message.type() !== 'images') {
                        return;
                    }

                    chatModel.messages.push(message);
                    chatModel.scrollToBottom();       
                });
            }));

            pubnubModel.pubnub.here_now({
                channel: pubnubModel.channel(),
                callback: function(event) {
                    $.each(event.uuids, function(uuid) {
                        chatModel.users.push({
                            name: null,
                            uuid: uuid
                        });
                    });

                    if (userModel.name() !== userModel.defaultName) {
                        return;
                    }

                    var defaultName = userModel.defaultName + ' ' + ((event.occupancy === 0) ? 1 : (pubnubModel.joined()) ? event.occupancy : event.occupancy + 1).toString();

                    userModel.name(defaultName);

                    bootbox.prompt('Как вас зовут?', 'Позднее', 'Продолжить', function(name) {
                        if (name === null) {
                            return;
                        }

                        var nameValidation = utils.validateUserName(utils, name);
                        
                        if (nameValidation) {
                            $notify('.notifications').notify({
                                type: 'warning',
                                fadeOut: { enabled: true, delay: 3000 },
                                message: { text: nameValidation }
                            }).show();
                        } else {
                            userModel.name(name);
                        }
                    }, defaultName);
                }
            });

            chatModel.isReady(true);
        },
        presence: function (event) {
            var userInList = utils.findUserByUuid(chatModel.users(), event.uuid);

            if (event.action === 'join') {
                if (userInList < 0) {
                    chatModel.users.push({
                        name: null,
                        uuid: event.uuid
                    });

                    if (event.uuid !== userModel.id()) {
                        var message = new MessageModel();

                        message.time(moment().unix());
                        message.name(userModel.name());
                        message.text(JSON.stringify({
                            cmd: 'getName',
                            args: [ event.uuid ]
                        }) + '|system');

                        message = utils.prepareMessage(ko.toJS(message));
                        chatModel.lastSystemMessage(message);

                        pubnubModel.pubnub.publish({
                            channel: pubnubModel.channel(),
                            message: JSON.stringify(message)
                        });
                    }
                } else if (event.uuid === userModel.id()) {
                    chatModel.users()[userInList].name = userModel.name();
                }

                if (event.uuid === userModel.id()) {
                    pubnubModel.joined(true);
                }
            } else if (event.action === 'leave') {
                if (userInList >= 0) {
                    if (chatModel.users()[userInList].name !== null) {
                        chatModel.messages.push(new MessageModel().type('text').data('вышел из чата').name(chatModel.users()[userInList].name).time(moment()));
                    }

                    chatModel.users.remove(function(user) {
                        return user.uuid === event.uuid;
                    });
                }
            }

            chatModel.usersOnline(event.occupancy);
        }
    };

    var pubnubModel = pubnub(pubnubParams, pubnubDispatcher);

    chatModel = chatModel(pubnubModel, userModel);
    commands = commands(chatModel, userModel, pubnubModel);

    hashModel.userId.subscribe(function (newId) {
        userModel.id(newId.toString());
    });

    hashModel.channelId.subscribe(function (newChannel) {
        pubnubModel.channel(newChannel.toString());
    });

    userModel.name.subscribe(function (name) {
        utils.saveUserChannel(hashModel, userModel);

        if (!pubnubModel.pubnub) {
            return;
        }

        var message = new MessageModel();

        message.time(moment().unix());
        message.name(userModel.name());
        message.text(JSON.stringify({
            cmd: 'replaceName',
            args: [ userModel.id() ]
        }) + '|system');

        message = utils.prepareMessage(ko.toJS(message));
        chatModel.lastSystemMessage(message);

        pubnubModel.pubnub.publish({
            channel: pubnubModel.channel(),
            message: JSON.stringify(message)
        });
    });

    userModel.paramAudio.subscribe(function () {
        utils.saveUserChannel(hashModel, userModel);
    });

    userModel.paramExit.subscribe(function () {
        utils.saveUserChannel(hashModel, userModel);
    });

    hasher.prependHash = '';

    hasher.initialized.add(function (currentHash) {
        var savedChannel;

        if (currentHash !== '') {
            hashModel.fullHash(currentHash);

            savedChannel = jstorage.get(hashModel.channelId());

            if (userModel.id() === '') {
                if (savedChannel && savedChannel.user) {
                    hashModel.userId(savedChannel.user.id);
                } else {
                    hashModel.userId(utils.randomString());
                }
            }
        } else {
            hashModel.userId(utils.randomString());
            hashModel.channelId(utils.randomString());
        }

        if (savedChannel && savedChannel.user) {
            userModel.name(savedChannel.user.name);
            userModel.paramAudio(savedChannel.user.paramAudio);
            userModel.paramExit(savedChannel.user.paramExit);
        }
    });

    hasher.init(userModel);
    hasher.replaceHash(hashModel.fullHash());

    utils.saveUserChannel(hashModel, userModel);

    pubnubModel.init(userModel);
    pubnubModel.subscribe();

    $(document).ready(function () {
        var MasterModel = function () {
            this.chatModel = chatModel;
            this.userModel = userModel;
        };

        var heightControl = function (currentHeight) {
            var heightOffset = $('.messagebox').outerHeight(true) - $('.messagebox').height() + $('.typing').outerHeight();
            var rows = $('.row-fluid');

            var complete = function(height) {
                if (height > 350) {
                    height = 350;
                }

                chatModel.style({ height: height + 'px' });
            };

            rows.each(function(idx, element) {
                if ($(element).children('.messagebox').length > 0) {
                    return;
                }

                utils.deferChecker(function (height) {
                    heightOffset += height;

                    if (idx === rows.length - 1) {
                        complete(currentHeight - heightOffset);
                    }
                }, function() {
                    var height = $(element).outerHeight(true);
                    return height > 0 ? height : false;
                });
            });
        };

        $(window).resize(function() {
            if (chatModel.isActive()) {
                heightControl($(window).height());
            }
        });

        Visibility.change(function (e, state) {
            if (state === 'hidden') {
                return chatModel.isActive(false);
            }

            if (state === 'visible') {
                return chatModel.isActive(true);
            }
        });

        chatModel.isReady.subscribe(function(isReady) {
            if (isReady) {
                heightControl($(window).height());
            }
        });

        $editable('.username a').editable({
            type: 'text',
            title: 'Ваше имя',
            placement: 'right',
            send: 'never',
            value: userModel.name(),
            validate: function(value) {
                return utils.validateUserName(utils, value);
            },
            clear: false
        }).on('save', function(e, params) {
            userModel.name(params.newValue);
        });

        $clickover('.main-buttons .invite').clickover({
            trigger: 'manual',
            placement: 'bottom',
            html: true,
            title: 'Пригласить участника',
            content: Templates.invite({ link: hashModel.getLink() })
        });

        $('.main-buttons')
            .on('focus', '.share-link', function() {
                $(this).select();
            })
            .on('mouseup', '.share-link', function(e) {
                e.preventDefault();
            })
            .on('click', '.input-append', function(e) {
                $(e.currentTarget).find('input').select();
            });

        $bootstrap('.username h2').tooltip();

        $('.upload input').on('change', function(e) {
            var responses = [];

            var readyToSend = function() {
                if (responses.length < e.target.files.length) {
                    return;
                }

                responses = $.grep(responses, function(img) {
                    return img !== null;
                });

                var message = new MessageModel();

                message.time(moment().unix());
                message.name(userModel.name());
                message.text(JSON.stringify(responses) + '|images');

                message = utils.prepareMessage(ko.toJS(message));

                this.lastMessage(message);

                chatModel.canSend(false);

                pubnubModel.pubnub.publish({
                    channel: pubnubModel.channel(),
                    message: JSON.stringify(message),
                    callback: $.proxy(function () {
                        chatModel.canSend(true);
                    }, this)
                });
            };

            $.each(e.target.files, function() {
                var reader = new FileReader();

                reader.onloadend = (function(file) {
                    return function(e) {
                        $.post('/proxy', {
                            image: e.target.result,
                            name: file.name
                        }).done(function(result) {
                            if (result.success === true) {
                                responses.push({
                                    img: result.uri,
                                    w: result.width,
                                    h: result.height
                                });
                            } else {
                                responses.push(null);
                            }

                            readyToSend();   
                        }).error(function() {
                            responses.push(null);
                            readyToSend();
                        });
                    };
                })(this);

                reader.readAsDataURL(this);
            });
        });

        ko.applyBindings(new MasterModel(), $('body').get(0));
    });
});