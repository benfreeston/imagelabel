# imagelabel
**Node app to help manually classify large image sets for machine learning tasks**

I can find a few tools that allow for image classification with bounding boxes etc that work locally. My requirements were for a simpler tool (just allowing training images to have a single classification) that allowed for collaboration (many hands make light work) and worked directly on my images in an S3 bucket.

### Setup and Usage

All configuration is in:

    /config/default.json
  
with documentation (Note. node-config allows for comments in JSON but github hates that so it's unreadble here!).

**main.js** will create a lightweight server that'll allow users to pull images from a list (defined in **images.csv** see config) and classify (into classes defined in config) them writing the image and class to **data.csv**.

**s3.js** is convenience utility to scan an S3 bucket and create **images.csv** from matching images. See config for details:

    {
        /*

            DEFAULT CONFIG

            All our run time configuration is defined here. This is a boilerplate and 
            needs modifying for your local environment before running. 

         ------------------------------------------------------------------------------------

            MAIN

            The main server will deliver your images for classification. 
         */
        "main" : {

            /* Root web domain. All images are served via the browser via http and
               this defines that web root (nb. needs trailing /). Boilerplate is for an 
               AWS bucket but it'll work with any domain.
             */
            "root" : "http://YOURBUCKET.s3.amazonaws.com/",

            /* Images CSV. This defines a local path to a CSV with a single column
               of remote image paths such that root + image_path is a full web route
               to your image.

               This image CSV can be created however you like, eg:

                    ls *.jpg > images.csv

               Or can be created by s3.js from an S3 bucket.  
             */
             "imagescsv": "images.csv",

             /* Data CSV. This is our local output from the classification process in the form
                of rows of 'local_image_path,classification_set'. This file will be created by main.js
                at runtime if it doesn't already exist.
              */
             "datacsv": "data.csv",

             /* Classes (or categories). Define a key and matching label here. Pressing this key will append the 
                KEYNAME to the data CSV. The labels are only for comprehension here, they're not used in the 
                data created.

                NB. I've found it useful to add a 'bad data' category that can be used as a skip if an image is malformed or 
                unidentifiable. These can be easily filtered from your data.csv later.
              */
             "classes" : {"0": "car",
                          "1": "cat",
                          "2": "dog",
                          "3": "boat",
                          "b": "baddata"}
        },

        /*
         -------------------------------------------------------------------------------------

            S3 AUTOMATION

            s3.js will automatically create the images csv given the details of a remote publicly accessible bucket.

            Boilerplate example will scan images that match:

                http://MYBUCKET.s3.amazonaws.com/MYFOLDER/*.jpg

         */
         "s3" : {

            /* Name of the S3 bucket to scan */
            "bucket" : "MYBUCKET",

            /* Prefix for the files within your bucket. Technically S3 doesn't support 'folders' but 
               it's pretty standard practise to split out your files with prefixes that look a lot like them, this 
               allows you to pick only images that use a particular prefix
             */
            "prefix" : "/MYFOLDER/",

            /* Wildcard string - only includes images in the given bucket with the given prefix that also contain this 
               wildcard. Useful for picking images from a structure with mixed assets (eg. '.jpg'). NB. there's no 
               support for excluding on this string or regular expressions. Hack s3.js for that.

               N.B. Leave empty string if not required
             */
            "wildcard" : ".jpg"
         }
    }

### Known Issues

* **Should** work with multiple simultaneous users. Each image will only get served once but there's no way to end a session so images not classified when a browser is closed will confuse the counter. Although each image will only be served once the order they're written back to **data.csv** will reflect the order they're classified not the order they're served. This shouldn't be an issue.
* Once the last image is processed the code errors. This should be prettier!
* There's no process for fixing an incorrectly classfied image save modifying the data in the output CSV
* Code is cheap and nasty! I've got no Node experience this was just something I needed done. Use at your own risk!

Please feel free to hit me with issues or pull request improvements if this is of any use.
