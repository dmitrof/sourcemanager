/**
 * Created by Дмитрий on 18.03.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sourceSchema = new Schema({
    url : { type: String, required: true, unique: true},
    type : {type: String, required: true},
    name : {type: String, required: true},
    description : {type: String, default : "Undiscribed source"},
    added_by_user : {type: String, required: true, default : "Kostyl"}, //TODO имя или id пользователя (переделать, когда появится аутентификация)
    created_at : {type: Date},
    parse_state : {type : String, required: true, enum : ['pending', 'parsed', 'parse_not_possible'], default : 'pending'},
    updated_at : {type: Date},
    metadata : {},
    features : {}
} , {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "sources"});

sourceSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
sourceSchema.methods.attachFeatures = function(_features) {
    this.features = _features;
};


module.exports = mongoose.model('Source', sourceSchema);