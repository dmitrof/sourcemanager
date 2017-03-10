/**
 * Created by Дмитрий on 12.12.2016.
 */
//mongoose connect
var schemas = require('./../models/core_schemas');
//instantiate mongoose-gridfs


//obtain a model
var Attachments = schemas.Attachments;

//create or save a file
Attachments.write({
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
