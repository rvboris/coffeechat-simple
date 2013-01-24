define(['libs/knockout', 'libs/moment', 'libs/jquery', 'app/utils'], function (ko, moment, $, utils) {
    return function () {
        this.type = ko.observable();
        this.data = ko.observable();

        this.text = ko.computed({
            read: function () {
                return (this.type() === 'system' ? JSON.stringify(this.data()) : this.data()) + '|' + this.type();
            },
            write: function (value) {
                var arr = value.split('|');

                this.type(arr[arr.length - 1]);
                arr.length = arr.length - 1;

                this.data('');

                $.each(arr, $.proxy(function(idx, value) {
                    this.data(this.data() + value);
                }, this));

                if (this.type() === 'system') {
                    try {
                        this.data(JSON.parse(this.data()));
                    } catch (e) {
                        return;
                    }
                }
            },
            owner: this
        });

        this.time = ko.observable();
        this.name = ko.observable();

        this.repeatName = '...';

        this.getText = ko.computed($.proxy(function() {
            var parsedText = this.data();

            if (!utils.isEmpty(parsedText)) {
                parsedText = utils.parseUrl(parsedText);
            }

            return parsedText;
        }, this));

        this.formattedTime = ko.computed($.proxy(function () {
            return '[' + (moment.isMoment(this.time()) ? this.time().format('HH:mm:ss Z') : '...') + ']';
        }, this));

        this.formattedName = ko.computed($.proxy(function () {
            return this.name() === this.repeatName ? this.name() : this.name() + ':';
        }, this));
    };
});