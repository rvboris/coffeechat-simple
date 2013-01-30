define(['libs/knockout'], function (ko) {
    return new function () {
        this.userId = ko.observable();

        this.channelId = ko.observable();

        this.fullHash = ko.computed({
            read: function () {
                return this.userId() + ':' + this.channelId();
            },
            write: function (value) {
                var arr = value.split(':');

                if (arr.length === 1) {
                    this.channelId(arr[0]);
                } else {
                    this.userId(arr[0]);
                    this.channelId(arr[1]);
                }
            },
            owner: this
        });

        this.getLink = ko.computed($.proxy(function () {
            return window.location.protocol + '//' + window.location.host + '/#' + this.channelId();
        }, this));
    };
});