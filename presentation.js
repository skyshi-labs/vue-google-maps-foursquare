var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');
var servePath = path.resolve(__dirname, 'presentation');

connect()
  .use(serveStatic(servePath))
  .listen(9090, function(){
    console.log('Server running on 9090...');
});
