define(['libs/jquery', 'libs/knockout'], function ($, ko) {
    var userModel = new function () {
        this.defaultName = 'гость';

        this.id = ko.observable('');
        this.name = ko.observable(this.defaultName);

        this.paramAudio = ko.observable(true);
        this.paramExit = ko.observable(true);

        this.paramSwitcher = function(value) {
            return value ? 'выкл' : 'вкл';
        };

        this.toogleParam = $.proxy(function(paramName) {
            return $.proxy(function() {
                if (!this[paramName]) {
                    return;
                }

                this[paramName](!this[paramName]());
            }, this);
        }, this);
    };

    return userModel;
});