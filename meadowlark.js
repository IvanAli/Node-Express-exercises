var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();

var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.use(function(request, response, next) {
    response.locals.showTests = app.get('env') !== 'production' && request.query.test === '1';
    next();
});

app.get('/', function(request, response) {
    response.render('home');
});

app.get('/about', function(request, response) {
    var randFortune = fortune.getFortune();
    response.render('about', {
        fortune: randFortune,
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(request, response) {
    response.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function(request, response) {
    response.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function(request, response) {
    response.render('tours/request-group-rate');
});

app.use(function(request, response) {
    response.status(404);
    response.render('404');
});

app.use(function(error, request, response, next) {
    console.error(error.stack);
    response.status(500);
    response.render('500');
});

app.listen(app.get('port'), function() {
    console.log("Express started on http://localhost:" + app.get('port') + '; press Ctrl + C' +
    ' to terminate');
});
