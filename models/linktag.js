/**
 * Created by Дмитрий on 18.03.2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* linkTagSchema */
/* TODO узнать у Игоря, по какому полю можно раз и навсегда связать теги */
var linkTagSchema = new Schema({
    text : { type: String, required: true, unique: true},
    description : { type: String,  default : "Undescribed tag"},
    metadata : {},
    created_at : {type: Date},
    updated_at : {type: Date},
    nodes : []  //TODO решить где хранить
}, {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "item_link_tags"});

linkTagSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
linkTagSchema.methods.attachNodes = function(_nodes) {
    this.nodes = _nodes;
};


module.exports = mongoose.model('LinkTag',linkTagSchema);