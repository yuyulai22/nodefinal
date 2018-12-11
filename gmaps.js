const express = require('express');
const request = require('request');
var path = require('path');
const geocode = require('./gmaps');

var app = express();
const bodyParser = require('body-parser');

const hbs = require('hbs');
const fs = require('fs');
var app = express();

const port = process.env.PORT || 8080;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('message', (text) => {
	console.log(text)
})

var location = 'vancouver';
var lng1 = 0;
var lat1 = 0;
var summary = '';

var weather = ''; //variable to hold the weather info

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
	//response.send('<h1>Hello Express!</h1>');

	response.send(' <h1>Main Page</h1> <p></p> <a href = "/about"> Image page </a> <p> </p> <a href = "/weather"> weather page </a>');

})

app.get('/about', function(req, res) {
  	// res.send("<h1> Weather in " + location + "today is </h1> <br>" + "The longitude and latitude is = "+ lng1 + " "+ lat1+ 
  	// 	"	<br>Temperature in "+ location+ " is " +temperature + "c" + 
  	// 	"	<br>Summary "+ summary);
  	res.render('about.hbs');
   
});
app.get('/weather', function(req, res) {
  	// res.send("<h1> Weather in " + location + "today is </h1> <br>" + "The longitude and latitude is = "+ lng1 + " "+ lat1+ 
  	// 	"	<br>Temperature in "+ location+ " is " +temperature + "c" + 
  	// 	"	<br>Summary "+ summary);
  	res.render('weather.hbs');
   
});


app.post('/gallery', function(req,res) {
	console.log('entered keyword for images is ',  req.body.image);
	imagereq = req.body.image;
	request({
		url: 'https://pixabay.com/api/?key=10969602-1b28e896afe3ba7c21f021d3e&q=' + 'yellow+flowers' +'&image_type=photo',
		json: true
	}, (error, response, body) => {
			body1 = body.hits;
			var keys = Object.keys(body1);

			var len = keys.length
			console.log(len)
			var i;
			for (i = 0; i < len; i++) { 
				console.log(body1[i].largeImageURL);
				urlreq = body1[i].largeImageURL;

			// 		request({
			// 		url: urlreq,
			// 		json: true
			// 		})

			// 		 res.render('info', {
			// 		     info  : {
			// 		        header : "View Title"
			// 		     },
			// 		     query : req.query
			// 		  }
			// }
		}
			console.log('done');
	});

}) 

var inputlocation = "";

app.post('/find', function(req, res) {
    var location = req.body.location;
    inputlocation= location;
    console.log(inputlocation);
    request({
		url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAVpYDKYA_q9EugvOpwha3JnigP9ykiepU&address=' + inputlocation ,
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

//});

app.listen(8080, () => {
    console.log('Server is up on the port 8080');
    // here add the logic to return the weather and save it inside the weather variable

 //    request({
	// 	url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAVpYDKYA_q9EugvOpwha3JnigP9ykiepU&address=seattle' ,
	// 	json: true
	// }, (error, response, body) => {
	// 	if(error){
	// 		callback('cannot connect to google maps');
	// 		//console.log('cannot connect to google maps')
	// 	}else if(body.status == 'ZERO_RESULTS'){
	// 		callback('cannot find requested address');
	// 		//console.log('Cannot find requested address')
	// 	}else if(body.status =='OK'){

	// 		lat1 = (JSON.stringify(body.results[0].geometry.location.lat))
	// 		lng1 = (JSON.stringify(body.results[0].geometry.location.lng))
	// 		console.log(lat1, lng1)

	// 			request({
	// 				url: 'https://api.darksky.net/forecast/4982cd0ffcc16b2bd023c513f458f171/' + lat1 + ',' + lng1,
	// 				json: true
	// 			}, (error, response, body) => {
	// 				if(error){
	// 					console.log("can't connect");
	// 					callback('cannot connect to dark sky');
	// 				}else{
	// 					console.log('dark skying')
	// 					temperature = JSON.stringify(body.currently.temperature);
	// 					summary = JSON.stringify(body.currently.summary)
	// 					console.log('Temperature: '+ (temperature));
	// 					console.log('Summary: '+ (summary));
					
	// 			}
	// 	});
			
	// 	}

	// });
});