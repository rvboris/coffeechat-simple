define(['libs/knockout', 'libs/moment'], function (ko, moment) {
    return function () {
        this.time = ko.observable();
        this.text = ko.observable();
        this.name = ko.observable();

        this.repeatName = '...';

        this.formattedTime = ko.computed($.proxy(function () {
            return '[' + (moment.isMoment(this.time()) ? this.time().format('HH:mm:ss Z') : '...') + ']';
        }, this));

        this.formattedName = ko.computed($.proxy(function () {
            return this.name() === this.repeatName ? this.name() : this.name() + ':';
        }, this));
    };
});