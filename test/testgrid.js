/**
 * Created by Дмитрий on 12.12.2016.
 */
//mongoose connect
var schemas = require('./../models/core_schemas');
var dbWrapper = require('./../modules/db_wrapper');
var fs = require('fs');
//instantiate mongoose-gridfs


//obtain a model
dbWrapper.initDB(function(err) {
    //console.log('smth happening');
    if (err) {
        console.log(err);
        throw err;
    }
    Attachments = dbWrapper.Attachments;
    Attachments.write({
            filename:'sample.txt',
            contentType:'text/plain'
        },
        fs.createReadStream('/tmp/nodejs.jpg'),
        function(err, createdFile) {
            if (err) {throw err}
            else console.log('attachment is saved')
        });
});


//create or save a file


//for larger file size


//for smaller file size
//read a file and receive a buffer
