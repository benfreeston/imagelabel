/* 
 	S3 Automation

 	Tool to scan an s3 bucket and create a CSV of relevant image assets. S3 has a 1000
 	file limit per request so we'll use recursion to scan the whole bucket. Take care
 	to get your Prefix and Wildcard settings right (see config) if you've a large bucket
 	and don't want this to take a while.

 */

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var handlebars = require('handlebars');
var fs = require('fs');

var config = require('config');

var csv = "";

BUCKET = config.get("s3.bucket")
PREFIX = config.get("s3.prefix")

WILDCARD = config.get("s3.wildcard")

s3.listObjects({Bucket: BUCKET, Prefix: PREFIX}).
on('success', function handlePage(r) {

	for (i=0; i<r.data.Contents.length; i++){
		if (r.data.Contents[i].Key.includes(WILDCARD)){
			csv = csv + r.data.Contents[i].Key + "\n";
		}
	}

    if(r.hasNextPage()) {
    	console.log(".")
        r.nextPage().on('success', handlePage).send();
    } else {
    	var fs = require('fs');

		fs.writeFile(config.get("main.imagescsv"), csv, 'utf8', function (err) {
		  if (err) {
		    console.log('File error.');
		  } else{
		    console.log('CSV Saved');
		  }
		});
    }
}).
on('error', function(r) {
    // Error!
}).
send();