/**
 * Created by Дмитрий on 12.12.2016.
 */
//var dbHelper = require('./dbHelper');
var schemas = require('./../models/core_schemas');
var Attachments = schemas.Attachments;
var fs = require('fs');
//var Grid = require('gridfs-stream');
//testing attached methods
var sourceType = new schemas.SourceType({
    type : "YouTube",
    description : "YouTube channel or playlist"
});
var sourceType2 = new schemas.SourceType({
    type : "YouTube",
    description : "YouTube channel or playlist"
});

metadata = { extra1 : 'extra1', extra2 : 'extra2'};
metadata2 = { extra : 'metadata', meta : 'metadata'};
sourceType.attachMetadata(metadata);
sourceType2.attachMetadata(metadata2);
sourceType.save(function(err) {
    if (err) throw err;
});
sourceType2.save(function(err) {
    if (err) throw err;
});


/*
var item = new schemas.Item({
    source_url : "www.http" + Math.random() * 10,

    item_type : "source_type"
});



Attachments.write({
    filename:'sample.txt',
    contentType:'text/plain'
    },
    fs.createReadStream('/tmp/nodejs.jpg'),
    function(err, createdFile) {
        if (err) {throw err}
        else console.log('attachment is saved')
    }
);*/


