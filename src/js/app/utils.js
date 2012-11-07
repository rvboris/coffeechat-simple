define([], function () {
    return {
        randomString: function (n) {
            if (!n) {
                n = 32;
            }

            var text = '';
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < n; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        },
        declOfNum: function (number, titles) {
            var cases = [2, 0, 1, 1, 1, 2];
            return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
        },
        simpleHash: function (src) {
            var hash = 0;

            if (src.length === 0) {
                return hash;
            }

            for (var i = 0; i < src.length; i++) {
                var char = src.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }

            return hash;
        },
        isEmpty: function (str) {
            return (!str || str.length === 0 || /^\s*$/.test(str));
        },
        isLength: function (str, min, max) {
            return str.length >= min && str.length <= max;
        },
        isAlphanumeric: function (str) {
            return (/^[a-zа-я0-9\s]+$/i).test(str);
        }
    };
});