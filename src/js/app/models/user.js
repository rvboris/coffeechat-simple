define(['libs/jquery', 'libs/knockout'], function ($, ko) {
    var userModel = new function () {
        this.defaultName = 'гость';

        this.id = ko.observable('');
        this.name = ko.observable(this.defaultName);

        this.paramAudio = ko.observable(true);
        this.paramAudioText = ko.observable(this.paramAudio() ? 'выкл' : 'вкл');

        this.toogleAudio = $.proxy(function() {
            this.paramAudio(!this.paramAudio());
        }, this);

        this.toogleNameEditable = $.proxy(function() {
            this.nameEditable(true);
            this.nameEditableError(false);
        }, this);
    };

    return userModel;
});