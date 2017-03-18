/**
 * Created by Дмитрий on 18.03.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sourceSchema = new Schema({
    url : { type: String, required: true, unique: true},
    type : {type: String, required: true},
    name : {type: String, required: true, default : "Unnamed source"},
    description : {type: String, default : "Undiscribed source"},
    added_by_user : {type: String, required: true, default : "Kostyl"}, //TODO имя или id пользователя (переделать, когда появится аутентификация)
    created_at : {type: Date},
    parse_state : {type : String, required: true, enum : ['pending', 'parsed', 'parse_not_possible'], default : 'pending'},
    updated_at : {type: Date},
    extras : {},
    metadata : {}
} , {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "sources"});

sourceSchema.methods.attachExtras = function(_extras) {
    this.extras = _extras;
};
sourceSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};

module.exports = mongoose.model('Source', sourceSchema);