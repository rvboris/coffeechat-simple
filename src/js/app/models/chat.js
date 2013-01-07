define(['libs/jquery', 'libs/knockout', 'app/utils', 'libs/jstorage', 'libs/hasher', 'libs/bootstrap', 'libs/bootstrap.notify', 'libs/jquery.scrollTo', 'libs/tinycon', 'libs/buzz', 'models/message'],

function ($, ko, utils, jstorage, hasher, $bootstrap, $notify, $scrollTo, Tinycon, Buzz, MessageModel) {
    var unreadCounter = 0;

    var incomingMessageSound = new Buzz.sound('media/incoming-message', {
        formats: ['ogg', 'mp3']
    });

    var exitTimeout;

    var ChatModel = function(pubnubModel, userModel) {
        this.isReady = ko.observable(false);
        this.isActive = ko.observable(true);
        this.messages = ko.observableArray();
        this.lastMessage = ko.observable();
        this.online = ko.observable(0);
        this.canSend = ko.observable(false);

        this.style = ko.observable({
            height: '0px'
        });

        this.usersOnline = ko.computed({
            write: function (value) {
                this.online(value);
            },
            read: function () {
                return 'онлайн ' + this.online().toString() + ' ' + utils.declOfNum(this.online(), ['пользователь', 'пользователя', 'пользователей']);
            },
            owner: this
        });

        this.isReady.subscribe($.proxy(function(ready) {
            this.canSend(ready);
        }, this));

        this.isActive.subscribe($.proxy(function(active) {
            if (!active) {
                Tinycon.reset();

                exitTimeout = setTimeout($.proxy(function() {
                    this.exit();
                }, this), 900000); // 15 min
            } else {
                clearTimeout(exitTimeout);
            }
        }, this));

        this.messages.subscribe($.proxy(function () {
            if (!this.isActive()) {
                unreadCounter++;

                if (userModel.paramsAudio()) {
                    incomingMessageSound.play();
                }
            } else {
                unreadCounter = 0;
            }

            Tinycon.setBubble(unreadCounter);
            Tinycon.setOptions({
                fallback: true
            });

            this.scrollToBottom();
        }, this));

        this.style.subscribe($.proxy(function () {
            this.scrollToBottom();
        }, this));

        this.invite = function (data, event) {
            $bootstrap(event.currentTarget).popover('toggle');
            $('#share-link').focus();
        };
        
        this.exit = function () {
            jstorage.flush();

            hasher.changed.active = false;
            hasher.replaceHash('');
            hasher.changed.active = true;

            window.location.reload();
        };

        this.scrollToBottom = function() {
            $scrollTo('#app .messages').scrollTo('max', 5, {
                queue: false,
                axis: 'y'
            });
        };

        this.send = $.proxy(function (form) {
            var input = $(form).find('input');
            var value = input.val();

            if (utils.isEmpty(value)) {
                $notify('.notifications').notify({
                    type: 'warning',
                    fadeOut: { enabled: true, delay: 3000 },
                    message: { text: 'Сообщение не может быть пустым' }
                }).show();

                return input.addClass('border-color-red');
            }

            input.removeClass('border-color-red');

            value = $('<div/>').text(value).html();

            this.canSend(false);

            var message = new MessageModel();

            message.time(moment().unix());
            message.name(userModel.name());
            message.text(value);

            delete message.repeatName;
            delete message.formattedTime;
            delete message.formattedName;

            message = ko.toJS(message);

            this.lastMessage(message);

            pubnubModel.pubnub.publish({
                channel: pubnubModel.channel(),
                message: JSON.stringify(message),
                callback: $.proxy(function (info) {
                    this.canSend(true);

                    if (info && info[0]) {
                        input.val('');
                    }
                }, this)
            });
        }, this);
    };

    return function(pubnubModel, userModel) {
        return new ChatModel(pubnubModel, userModel);
    };
});