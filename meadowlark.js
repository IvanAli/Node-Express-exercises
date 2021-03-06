var express = require('express');
var fortune = require('./lib/fortune.js');
var weather = require('./lib/weatherdata.js');
var credentials = require('./credentials.js');
var formidable = require('formidable');
var app = express();

var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.set('port', process.env.PORT || 3000);

app.use(function(request, response, next) {
    response.locals.flash = request.session.flash;
    delete request.session.flash;
    next();
});

app.use(function(request, response, next) {
    response.locals.showTests = app.get('env') !== 'production' && request.query.test === '1';
    next();
});

app.get('/', function(request, response) {
    response.cookie('monster', 'nom nom');
    response.cookie('signed_monster', 'nom nom', { signed: true });
    response.render('home');
});

app.get('/about', function(request, response) {
    var randFortune = fortune.getFortune();
    response.render('about', {
        fortune: randFortune,
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/handlebars', function(request, response) {
    response.render('handlebars', {
        currency: {
            name: 'United States dollars',
            abbrev: 'USD',
        },
        tours: [
            { name: 'Hood River', price: '$99.95' },
            { name: 'Oregon Coast', price: '$159.95' },
        ],
        specialsUrl: '/january-specials',
        currencies: [ 'USD', 'GBP', 'BTC' ],
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

app.get('/headers', function(request, response) {
    response.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in request.headers) s += name + ': ' + request.headers[name] + '\n';
    response.send(s);
});

app.get('/nursery-rhyme', function(request, response) {
    response.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(request, response) {
    response.json({
        animal: 'cat',
        bodyPart: 'tail',
        adjective: 'interesting',
        noun: 'me'
    });
});

app.get('/newsletter', function(request, response) {
    response.render('newsletter', {csrf: 'temp value'});
});

app.get('/contest/vacation-photo', function(request, response) {
    var now = new Date();
    response.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month', function(request, response) {
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
        if (error) return response.redirect(303, '/error');
        console.log('Fields', fields);
        console.log('Files', files);
        response.redirect(303, '/thank-you');
    });
});

app.post('/process', function(request, response) {
    if (request.xhr || request.accepts('json,html') === 'json') {
        request.session.flash = {
            type: 'success',
            intro: 'Thank you',
            message: 'You are now signed up'
        }
        response.send({success: true});
    }
    else {
        response.redirect(303, '/thank-you');
    }
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

app.use(function(request, response, next) {
    if (!response.locals.partials) response.locals.partials = {};
    response.locals.partials.weather = weather.getWeatherData();
    next(); // I don't know what this is for yet
});

app.listen(app.get('port'), function() {
    console.log("Express started on http://localhost:" + app.get('port') + '; press Ctrl + C' +
    ' to terminate');
});
