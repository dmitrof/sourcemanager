/**
 * Created by Дмитрий on 18.03.2017.
 */
/*
 item schema - модель единицы учебного контента
 документы этого типа будут меняться чаще всего. При повторном парсинге ресурса, будет добавляться новый
 документ, старый документ удаляться не будет.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema( {
    name : { type: String, required: true }, //name - НЕ уникальный id генерируется парсером на основе uri айтема или его содержимого
    title : String,
    type : { type: String, required: true, default : "Unidentified item type"},
    source_url : { type: String, required: true },    //ссылается на source_url SourceSchema
    has_attachment : { type: Boolean, required: true, default : false},
    //item_type : {type: String, required: true},
    item_description : {type: String, default : "Undiscribed item"},
    created_at : {type: Date},
    updated_at : {type: Date},
    metadata : {}

} , {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "items"});
//метод для добавления дополнительных полей. Будет вызываться после парсинга
itemSchema.methods.attachExtras = function(_extras) {
    this.extras = _extras;
};
itemSchema.methods.attachBody = function(_body) {
    this.body = _body;
};
itemSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
itemSchema.methods.setAttachments = function(_attachments) {
    this.attachments = _attachments;
};

module.exports = mongoose.model('Item',itemSchema);