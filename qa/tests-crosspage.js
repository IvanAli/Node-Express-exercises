var Browser = require('zombie'), assert = require('chai').assert;
var browser;

suite('Cross-Page Tests', function() {
    setup(function() {
        browser = new Browser();
    });

    test('Requesting a group rate quote from the hood river '
     + 'tour page should populate the hidden referrer field', function(done) {
         var referrer = 'http://localhost:3000/tours/hood-river';
         browser.visit(referrer, function() {
             browser.clickLink('.requestGroupRate', function() {
                 console.log("Value: " + browser.field('referrer').value);
                 assert(browser.field('referrer').value === referrer);
                 done();
             });
         });
    });

    test('Requesting a group rate quote from the oregon coast tour ' +
    'page should populate the hidden referrer field', function(done) {
        var referrer = 'http://localhost:3000/tours/oregon-coast';
        browser.visit(referrer, function() {
            browser.clickLink('.requestGroupRate', function() {
                assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    })

    test('Visiting the "request group rate" page directly should ' +
    'return in an empty referrer field', function(done) {
        var link = 'http://localhost:3000/tours/request-group-rate';
        browser.visit(link, function() {
            assert(browser.field('referrer').value === '');
            done();
        });
    });
});
