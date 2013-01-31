var http = require('http'),
    httpProxy = require('http-proxy');

    var options = {
  router: {
    'coffeechat.ru/proxy': 'imm.io/store'
  }
};

httpProxy.createServer(80, 'imm.io').listen(3535);