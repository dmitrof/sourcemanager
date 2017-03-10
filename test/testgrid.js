/**
 * Created by Дмитрий on 12.12.2016.
 */
var fs = require('fs');
var mongoose = require('mongoose');

//mongoose connect
mongoose.connect('mongodb://localhost/sourcemanager');

//instantiate mongoose-gridfs
var gridfs = require('mongoose-gridfs')({
    collection:'attachments',
    model:'Attachment'
});

//obtain a model
Attachment = gridfs.model;

//create or save a file
Attachment.write({
        filename:'sample.txt',
        contentType:'text/plain'
    },
    fs.createReadStream('/tmp/nodejs.jpg'),
    function(err, createdFile) {
        if (err) {throw err}
        else console.log('attachment is saved')
    });

//for larger file size


//for smaller file size
//read a file and receive a buffer
