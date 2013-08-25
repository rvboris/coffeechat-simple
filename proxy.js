var opter = require('opter'),
    options = opter({
        port: {
			character: 'p',
			argument: 'number',
			defaultValue: 3010,
			description: 'App listen port',
			required: false,
			type: Number
		}
    }, '1');

require('http-proxy').createServer(80, 'imm.io').listen(options.port);