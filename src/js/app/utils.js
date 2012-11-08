define([], function () {
    return {
        randomString: function () {
            return Math.random().toString(36).substring(7);
        },
        declOfNum: function (number, titles) {
            var cases = [2, 0, 1, 1, 1, 2];
            return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
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