# imagelabel
**Node app to help manually classify large image sets for machine learning tasks**

I can find a few tools that allow for image classification with bounding boxes etc that work locally. My requirements were for a simpler tool (just allowing training images to have a single classification) that allowed for collaboration (many hands make light work) and worked directly on my images in an S3 bucket.

### Setup and Usage

All configuration is in:

    /config/default.json
  
with documentation (Note. node-config allows for comments in JSON but github hates that so it's unreadble here!).

**main.js** will create a lightweight server that'll allow users to pull images from a list (defined in **images.csv** see config) and classify (into classes defined in config) them writing the image and class to **data.csv**.

**s3.js** is convenience utility to scan an S3 bucket and create **images.csv** from matching images. See config for details.

### Known Issues

* **Should** work with multiple simultaneous users. Each image will only get served once but there's no way to end a session so images not classified when a browser is closed will confuse the counter. Although each image will only be served once the order they're written back to **data.csv** will reflect the order they're classified not the order they're served. This shouldn't be an issue.
* Once the last image is processed the code errors. This should be prettier!
* There's no process for fixing an incorrectly classfied image save modifying the data in the output CSV
* Code is cheap and nasty! I've got no Node experience this was just something I needed done. Use at your own risk!

Please feel free to hit me with issues or pull request improvements if this is of any use.
