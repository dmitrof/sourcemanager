/*Класс, оборачивающий соединение с БД */

var mongoose = require('mongoose');
var fs = require('fs');

module.exports.initDB = function() {
    return new Promise(function(resolve, reject) {
        mongoose.connect('mongodb://localhost/sourcemanager');
        mongoose.connection.on('error', function (err) {
            console.error('db error:', err.message);
            reject(err);
        });
        module.exports.db = mongoose.connection.db;
        mongoose.connection.once('open', function callback () {
            //console.log("Connected to DB!");
            var gridfs = require('mongoose-gridfs')({
                collection:'attachments',
                model:'Attachment'
            });
            var AttachmentSchema = gridfs.schema;
            module.exports.Attachments = mongoose.model('Attachment', AttachmentSchema);
            mongoose.Promise = global.Promise;
            resolve("Connected to DB!");
        });
    });
};


module.exports.closeConnection = function() {
    mongoose.connection.close();
    console.log("mongoose connection closed");
};


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