var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(request, response) {
    response.type('text/plain');
    response.send('Meadowlark Travel');
});

app.get('/about', function(request, response) {
    response.type('text/plain');
    response.send('About Meadowlark Travel');
});

app.use(function(request, response) {
    response.type('text/plain');
    response.status(404);
    response.send('404 - Not found');
});

app.use(function(error, request, response, next) {
    console.error(error.stack);
    response.type('text/plain');
    response.status(500);
    response.send('500 - Server error');
});

app.listen(app.get('port'), function() {
    console.log("Express started on http://localhost:" + app.get('port') + '; press Ctrl + C' +
    ' to terminate');
});
