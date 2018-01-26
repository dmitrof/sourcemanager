/**
 * Created by Дмитрий on 18.03.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const sourceStates = {
    PENDING: 'PENDING',
    PARSED: 'PARSED',
    PARSING_FAILED: 'PARSING_FAILED'
}

var sourceSchema = new Schema({
    url : { type: String, required: true, unique: true},
    type : {type: String, required: true},
    name : {type: String, required: true},
    description : {type: String, default : "Undiscribed source"},
    user_id : {type: String, required: true, default : "Kostyl"}, //TODO имя или id пользователя (переделать, когда появится аутентификация)
    created_at : {type: Date},
    state : {type : String, required: true, enum : [sourceStates.PENDING, sourceStates.PARSED, sourceStates.PARSING_FAILED], default : sourceStates.PENDING},
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