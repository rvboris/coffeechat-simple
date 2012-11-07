define(['libs/knockout', 'libs/jquery.jeditable', 'libs/jquery.jgrowl', 'app/utils'], function (ko, $jeditable, $jgrowl, utils) {
    ko.bindingHandlers.jeditable = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().jeditableOptions || {};

            options.placeholder = 'Нажмите чтобы редактировать';

            if (!options.onblur) {
                options.onblur = 'submit';
            }

            $jeditable(element).editable(function (value, params) {
                value = $.trim(value);

                if (value !== options.placeholder) {
                    if (utils.isEmpty(value) || !utils.isLength(value, 2, 20) || !utils.isAlphanumeric(value)) {
                        $jeditable(element).addClass('error');
                        $jgrowl.jGrowl('Имя введено не верно', {
                            header: 'Ошибка',
                            lifetime: 3000
                        });
                        return valueAccessor()();
                    }
                } else {
                    return valueAccessor()();
                }

                valueAccessor()(value);
                $jeditable(element).removeClass('error');

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

    return new function () {
        this.id = ko.observable('');
        this.defaultName = 'гость';
        this.name = ko.observable(this.defaultName);
    };
});