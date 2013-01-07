define(['libs/jquery', 'libs/knockout', 'libs/jquery.jeditable', 'libs/bootstrap.notify', 'app/utils'], function ($, ko, $jeditable, $notify, utils) {
    var jeditableElement;

    var userModel = new function () {
        this.defaultName = 'гость';

        this.id = ko.observable('');

        this.name = ko.observable(this.defaultName);
        this.nameEditable = ko.observable(false);
        this.nameEditableError = ko.observable(false);

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

    ko.bindingHandlers.jeditable = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            jeditableElement = element;

            var options = allBindingsAccessor().jeditableOptions || {};

            options.placeholder = 'Введите ваше имя';

            if (!options.onblur) {
                options.onblur = 'submit';
            }

            $jeditable(element).editable(function (value, params) {
            
                value = $.trim(value);

                if (value !== options.placeholder) {
                    if (utils.isEmpty(value) || !utils.isLength(value, 2, 20) || !utils.isAlphanumeric(value)) {
                        userModel.nameEditableError(true);

                        $notify('.notifications').notify({
                            type: 'warning',
                            fadeOut: { enabled: true, delay: 3000 },
                            message: { text: 'Имя введено не верно' }
                        }).show();
                        
                        return valueAccessor()();
                    }
                } else {
                    return valueAccessor()();
                }

                valueAccessor()(value);

                userModel.nameEditableError(false);
                userModel.nameEditable(false);

                return value;
            }, options);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $jeditable(element).editable('destroy');
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $jeditable(element).html(value);
        }
    };

    return userModel;
});