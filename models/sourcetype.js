/**
 * Created by Дмитрий on 18.03.2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* типы источников. Может содержать неявную ссылку на tutorClient*/
var sourceTypesSchema = new Schema({
    type : { type: String, required: true, unique: true},
    description : { type: String,  default : "Undescribed source"},
    metadata : {},
    created_at : {type: Date},
    updated_at : {type: Date}
}, {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "source_types"});
sourceTypesSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};


module.exports = mongoose.model('SourceType',sourceTypesSchema);