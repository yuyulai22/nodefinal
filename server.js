const express = require('express');
const request = require('request');

var app = express();
var weather = '';

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.send('<h1>Hello Express!</h1>' +
        '<a href="/about.html">About me</a>' +
        '<p></p>' +
        '<a href="/weather">Weather</a>');
});

app.get('/weather', (request, response) => {
    console.log("getting weather");
    response.send(weather);
    console.log("done getting weather");

});

app.listen(8080, () => {
    console.log('Server is up on the port 8080');
    request({
        url: 'http://maps.googleapis.com/maps/api/geocode/json' +
            '?address=Leszczynowka',
        json: true
    }, (error, response, body) => {
        if (error) {
           console.log('Cannot connect to Google Maps');
        } else if (body.status === 'ZERO_RESULTS') {
            console.log('Cannot find requested address');
        } else if (body.status === 'OK') {
            var latitude = body.results[0].geometry.location.lat;
            var longitude = body.results[0].geometry.location.lng;
            request({
                url: `https://api.darksky.net/forecast/a05801ddfd47bee6dbc2b05a8877b901/${latitude},${longitude}`,
                json: true
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    weather = `The temperature in Folwark Leszczynowka is ${body.currently.temperature} and is ${ body.currently.summary}`;
                } else {
                    console.log(body.error);
                };
            });
        }
    });
});