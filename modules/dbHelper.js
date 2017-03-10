var mongoose = require('mongoose');
var fs = require('fs');

module.exports.initDB = function(init_callback) {
    mongoose.connect('mongodb://localhost/exampleDb');

    mongoose.connection.on('error', function (err) {
        console.error('db error:', err.message);
        init_callback(err)
    });
    module.exports.db = mongoose.connection.db;
    mongoose.connection.once('open', function callback () {
        console.log("Connected to DB!");
        //identifying attachments
        //аттачменты gridfs

        module.exports.gridfs = require('mongoose-gridfs')({
            collection:'attachments',
            model:'Attachment'
        });

        init_callback(null);

    });
};


/*mongoose.connect('mongodb://localhost/exampleDb');

mongoose.connection.on('error', function (err) {
    console.error('db error:', err.message);
    callback(err)
});

mongoose.connection.once('open', function callback () {
    console.log("Connected to DB!");
    //identifying attachments
    //аттачменты gridfs

    /*gridfs = require('mongoose-gridfs')({
        collection:'attachments',
        model:'Attachment'
    });
    Attachments = gridfs.model;
    Attachments.write({
            filename:'sample.txt',
            contentType:'text/plain'
        },
        fs.createReadStream('/tmp/nodejs.jpg'),
        function(err, createdFile) {
            if (err) {throw err}
            else console.log(createdFile)
        }
    );
    callback(null);




});*/

/*Attachments = gridfs.model;
 Attachments.write({
 filename:'sample.txt',
 contentType:'text/plain'
 },
 fs.createReadStream('/tmp/nodejs.jpg'),
 function(err, createdFile) {
 if (err) {throw err}
 else console.log(createdFile)
 }
 );*/



/*var fs = require('fs');

var Grid = require('gridfs-stream');
var GridFS = Grid(mongoose.connection.db, mongoose.mongo);

function putFile(path, name, callback) {
    var writestream = GridFS.createWriteStream({
        filename: name
    });
    writestream.on('close', function (file) {
        callback(null, file);
    });
    fs.createReadStream(path).pipe(writestream);
}


putFile('/tmp/nodejs.jpg', 'nodejs.jpg', function(err, file) {
    if (err) console.log(err.message);
    else console.log('file saved!');
});*/