define(['libs/knockout'], function(ko) {
	var TypingUser = function() {
		this.name = ko.observable();
		this.time = ko.observable();
	};

	return TypingUser;
});