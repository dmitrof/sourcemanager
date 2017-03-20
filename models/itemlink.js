/**
 * Created by Дмитрий on 18.03.2017.
 */
/*ItemLinkSchema
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var itemLinkSchema = new Schema({
    item_name : { type: String,  required: true }, //name единицы контента
    node_id : { type: String,  required: true },
    source_url : { type: String },
    node_name : { type: String, required: true, default : "Unnamed node"},
    node_description : { type: String},
    coef : {type : Number, default : 1},
    state : {type : String, required: true, enum : ['active', 'inactive'], default : 'active'},
    item_link_author : { type: String,  required: true , default : 'Kostyl user'}, //указывает на login того, кто залинковал
    created_at : {type: Date},
    updated_at : {type: Date},
    metadata : {}
}, {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "item_links"});

itemLinkSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};

//перед сохранением производится проверка на уникальное сочетание контента и узла.
itemLinkSchema.statics.getItemNodeLinks = function(_item_name, _node_id) {
    return this.find({item_name : _item_name, node_id : _node_id}).exec();
};

module.exports = mongoose.model('ItemLink',itemLinkSchema);

