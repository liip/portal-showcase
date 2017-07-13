var http = require('http');

// simple page that acts as the OAuth endpoint
http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<html><head><title>Portal Showcase</title></head>');
    response.write('<body><h1>Test heading</h1>');
    response.write('<p>Test content</p>');
    response.end('</body></html>');
}).listen(process.env.PORT || 5000);
