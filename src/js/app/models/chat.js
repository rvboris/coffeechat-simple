define(['libs/jquery', 'libs/knockout', 'app/utils', 'libs/jstorage', 'libs/hasher', 'libs/jquery.jgrowl', 'libs/jquery.scrollTo', 'libs/tinycon', 'models/message'],

function ($, ko, utils, jstorage, hasher, $jgrowl, $scrollTo, Tinycon, MessageModel) {
    var ChatModel = function(pubnubModel, userModel) {
        this.isReady = ko.observable(false);
        this.isActive = ko.observable(true);

        this.isReady.subscribe($.proxy(function(ready) {
            this.canSend(ready);
        }, this));

        this.scrollToBottom = function() {
            $scrollTo('#app .messages').scrollTo('max', 5, {
                queue: false,
                axis: 'y'
            });
        };

        this.online = ko.observable(0);

        this.usersOnline = ko.computed({
            write: function (value) {
                this.online(value);
            },
            read: function () {
                return 'онлайн ' + this.online().toString() + ' ' + utils.declOfNum(this.online(), ['пользователь', 'пользователя', 'пользователей']);
            },
            owner: this
        });

        this.messages = ko.observableArray();

        var unreadCounter = 0;

        this.messages.subscribe($.proxy(function () {
            if (!this.isActive()) {
                unreadCounter++;
            } else {
                unreadCounter = 0;
            }

            Tinycon.setBubble(unreadCounter);

            this.scrollToBottom();
        }, this));

        this.invite = function () {

        };
        
        this.exit = function () {
            jstorage.flush();

            hasher.changed.active = false;
            hasher.replaceHash('');
            hasher.changed.active = true;

            window.location.reload();
        };

        this.canSend = ko.observable(false);

        this.send = $.proxy(function (form) {
            var input = $(form).find('input');
            var value = input.val();

            if (utils.isEmpty(value)) {
                $jgrowl.jGrowl('Сообщение не может быть пустым', {
                    header: 'Ошибка',
                    lifetime: 3000
                });
                return input.addClass('border-color-red');
            }

            input.removeClass('border-color-red');

            value = $('<div/>').text(value).html();

            this.canSend(false);

            var message = new MessageModel();

            message.time(moment().toString());
            message.name(userModel.name());
            message.text(value);

            pubnubModel.pubnub.publish({
                channel: pubnubModel.channel(),
                message: ko.toJSON(message),
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