define(['libs/jquery', 'libs/knockout', 'app/utils', 'libs/jstorage', 'libs/fineuploader/jquery-plugin', 'libs/hasher', 'libs/bootstrap', 'libs/bootstrap.notify', 'libs/jquery.scrollTo', 'libs/tinycon', 'libs/buzz', 'models/message'],

function ($, ko, utils, jstorage, $uploader, hasher, $bootstrap, $notify, $scrollTo, Tinycon, Buzz, MessageModel) {
    var unreadCounter = 0;
    var lastTypeCheck = 0;

    var incomingMessageSound = new Buzz.sound('media/incoming-message', {
        formats: ['ogg', 'mp3']
    });

    var exitTimeout;

    var ChatModel = function(pubnubModel, userModel) {
        this.isReady = ko.observable(false);
        this.isActive = ko.observable(true);
        this.messages = ko.observableArray();
        this.lastMessage = ko.observable();
        this.lastSystemMessage = ko.observable();
        this.online = ko.observable(0);
        this.users = ko.observableArray();
        this.canSend = ko.observable(false);
        this.pictureLoading = ko.observable(false);

        this.canSendPicture = ko.computed($.proxy(function() {
            return window.File && window.FileReader && window.FileList && window.Blob && this.canSend() && !this.pictureLoading();
        }, this));


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
                exitTimeout = setTimeout($.proxy(function() {
                    if (userModel.paramExit()) {
                        this.exit();
                    }
                }, this), 900000); // 15 min
            } else {
                unreadCounter = 0;
                Tinycon.setBubble(unreadCounter);
                clearTimeout(exitTimeout);
            }
        }, this));

        this.messages.subscribe($.proxy(function () {
            if (!this.isActive()) {
                unreadCounter++;

                if (userModel.paramAudio()) {
                    incomingMessageSound.play();
                }
            } else {
                unreadCounter = 0;
            }
            
            Tinycon.setBubble(unreadCounter);
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
            message.text(value + '|text');

            message = utils.prepareMessage(ko.toJS(message));

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

        this.typingUsers = ko.observableArray();

        this.typing = $.proxy(function(MasterModel, event) {
            if (new Date().getTime() - lastTypeCheck > 1000) {
                lastTypeCheck = new Date().getTime();

                var message = new MessageModel();

                message.time(moment().unix());
                message.name(userModel.name());
                message.text(JSON.stringify({
                    cmd: 'typing',
                    args: null
                }) + '|system');

                message = utils.prepareMessage(ko.toJS(message));
                this.lastSystemMessage(message);

                pubnubModel.pubnub.publish({
                    channel: pubnubModel.channel(),
                    message: JSON.stringify(message)
                });
            }

            return true;
        }, this);

        this.uploadImage = $.proxy(function(e) {
            return !$('.picture').hasClass('disabled');
        }, this);
    };

    return function(pubnubModel, userModel) {
        return new ChatModel(pubnubModel, userModel);
    };
});