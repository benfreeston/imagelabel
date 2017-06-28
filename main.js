/*
	Image Label

	Simple node server to present images from a CSV of paths to users who classify with a keypress.
	Resulting image paths with classification labels are written to a data csv.

	Configuration all in /config/default.json

 */
var express = require('express');
var exphbs  = require('express-handlebars');
var fs = require('fs');

var config = require('config');
var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// See config/default.json for configuration information
var IMAGE_ROOT = config.get("main.root");
var CATEGORIES = config.get("main.classes");

// A pointer that'll keep track of where we are in the data set
var count;

var error;

/*
	Read the data array. If it doesn't yet exist we can start at row zero of our image array,
	if it does already exist we want to skip the images we've already tagged.
*/
require("csv-to-array")({
   file: config.get("main.datacsv"),
   columns: ["image", "category"]
}, function (err, data) {
	if (err){
		/* The most likely error is that the file doesn't exist. We could add handling for 
		   other potential issues but right now we're simply going to set the pointer to the 
		   start of the images set if this is the case. The CSV append below will create a new
		   file if needed
		 */
		count = 0;
	}
	else{
		// Start processing new rows on the assumption that rows in the data.csv are sequential
		count = data.length
	}

	/* Now read the images CSV so we can start looping through the process of show and identify
	 */
	require("csv-to-array")({
	   file: config.get("main.imagescsv"),
	   columns: ["image"]
	}, function (err, images) {

		// Define the main and only view
		app.get('/', function (req, res) {
			if (req.query.count){
				// Does this key stroke exist?
				if(CATEGORIES[req.query.set]){
					// Append synchronously to the data CSV. This will create the CSV if it doesn't exist
					fs.appendFileSync('data.csv', images[req.query.count].image+","+req.query.set+"\n");
					error = "";
				}
				else{
					error = "Bad Category";
					count--;
				}
			}
			
		    res.render('home',{img: IMAGE_ROOT + images[count].image, count: count, size: images.length, error: error});
		    count++;
		});

		app.listen(3000)
	});
});