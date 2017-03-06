/**
 * Created by Дмитрий on 12.12.2016.
 */
//var dbHelper = require('./dbHelper');
var schemas = require('./schemas');
var Attachments = schemas.Attachment;
var fs = require('fs');
//var Grid = require('gridfs-stream');
/*var source = new schemas.Source({
    source_url : "www.http" + Math.random() * 10,

    source_type : "source_type"
});

extras = { extra1 : 'extra1', extra2 : 'extra2'};

source.attachExtras(extras);

source.save(function(err) {
    if (err) throw err;
});



var item = new schemas.Item({
    source_url : "www.http" + Math.random() * 10,

    item_type : "source_type"
});*/



Attachments.write({
    filename:'sample.txt',
    contentType:'text/plain'
    },
    fs.createReadStream('/tmp/nodejs.jpg'),
    function(err, createdFile) {
        if (err) {throw err}
        else console.log('attachment is saved')
    }
);


