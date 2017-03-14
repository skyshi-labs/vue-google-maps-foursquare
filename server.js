var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');
var servePath = path.resolve(__dirname,'dist');

connect()
  .use(serveStatic(servePath))
  .listen(8080, function(){
    console.log('Server running on 8080...');
});
