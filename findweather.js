const express = require('express');
const request = require('request');
var path = require('path');
const geocode = require('./gmaps');

var location = 'vancouver';
var lng1 = 0;
var lat1 = 0;
var summary = '';


var app = express();
var weather = ''; //variable to hold the weather info

app.use(express.static(__dirname + '/public'));

// here add routes

app.get('/', (request, response) => {
	//response.send('<h1>Hello Express!</h1>');

	response.send(' <h1>Main Page</h1> <p></p> <a href = "/about.html"> About me page </a> <p> </p> <a href = "/weather"> weather page </a>');

})


app.get('/weather', function(req, res) {
  	res.send("<h1> Weather in " + location + "today is </h1> <br>" + "The longitude and latitude is = "+ lng1 + " "+ lat1+ 
  		"	<br>Temperature in "+ location+ " is " +temperature + "c" + 
  		"	<br>Summary "+ summary);

   
});

    

//});

app.listen(8080, () => {
    console.log('Server is up on the port 8080');
    // here add the logic to return the weather and save it inside the weather variable

    request({
		url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAVpYDKYA_q9EugvOpwha3JnigP9ykiepU&address=vancouver',
		json: true
	}, (error, response, body) => {
		if(error){
			callback('cannot connect to google maps');
			//console.log('cannot connect to google maps')
		}else if(body.status == 'ZERO_RESULTS'){
			callback('cannot find requested address');
			//console.log('Cannot find requested address')
		}else if(body.status =='OK'){

			lat1 = (JSON.stringify(body.results[0].geometry.location.lat))
			lng1 = (JSON.stringify(body.results[0].geometry.location.lng))
			console.log(lat1, lng1)

				request({
					url: 'https://api.darksky.net/forecast/4982cd0ffcc16b2bd023c513f458f171/' + lat1 + ',' + lng1,
					json: true
				}, (error, response, body) => {
					if(error){
						console.log("can't connect");
						callback('cannot connect to dark sky');
					}else{
						console.log('dark skying')
						temperature = JSON.stringify(body.currently.temperature);
						summary = JSON.stringify(body.currently.summary)
						console.log('Temperature: '+ (temperature));
						console.log('Summary: '+ (summary));
					
				}
		});
			
		}

	});
});