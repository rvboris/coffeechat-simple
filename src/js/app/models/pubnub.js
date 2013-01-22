define(['libs/jquery', 'libs/knockout', 'libs/pubnub', 'libs/gibberish-aes'], function ($, ko, pubnub, gibberish) {
    return function (params, dispatcher) {
        return new function () {
            this.pubnub = null;

            this.channel = ko.observable();
            this.joined = ko.observable(false);

            this.init = $.proxy(function (userModel) {
                this.pubnub = pubnub.init({
                    publish_key: params.pubkey,
                    subscribe_key: params.subkey,
                    ssl: params.ssl,
                    uuid: userModel.id()
                });

                this.pubnub._publish = this.pubnub.publish;

                this.pubnub.publish = $.proxy(function (args) {
                    if (args && args.message) {
                        args.message = gibberish.enc(args.message, this.channel);
                    }

                    this._publish(args);
                }, this.pubnub);

                this.pubnub.ready();
            }, this);

            this.historyHandler = $.proxy(function(callback) {
                return $.proxy(function(messages) {
                    if (!messages[0]) {
                        return;
                    }
                    
                    $.each(messages[0], function (idx, jsonMessage) {
                        callback(gibberish.dec(jsonMessage, this.channel));
                    });
                }, this);
            }, this);

            this.subscribe = $.proxy(function () {
                this.pubnub.subscribe({
                    channel: this.channel(),
                    restore: params.restore,
                    callback: function (message) {
                        try {
                            message = gibberish.dec(message, this.channel);
                        } catch (e) {
                            return;
                        }

                        dispatcher.callback(message)
                    },
                    disconnect: dispatcher.disconnect,
                    reconnect: dispatcher.reconnect,
                    connect: dispatcher.connect,
                    presence: dispatcher.presence
                });
            }, this);
        };
    }
});