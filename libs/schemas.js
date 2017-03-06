/**
 * Created by Дмитрий on 12.12.2016.
 * здесь будут все схемы. Необходимо переделать dbHelper (или обойтись без него)
 */
var mongoose = require('mongoose');
var dbHelper = require('./dbHelper');
var fs = require('fs');
var mongoose_attachments = require('mongoose-attachments-aws2js');
var Schema = mongoose.Schema;
//аттачменты gridfs
var gridfs = dbHelper.gridfs;
//source Schema - модель источника данных
var sourceSchema = new Schema({
    source_url : { type: String, required: true, unique: true },
    source_type : {type: String, required: true},
    source_description : String,
    parser_available : Boolean,
    owner : String,
    created_at : Date,
    updated_at : Date,
    extras : {}
} , {collection : "sources"});


//метод для добавления дополнительных полей
sourceSchema.methods.attachExtras = function(_extras) {
    // add some stuff to the users name
    this.extras = _extras;

    return this.name;
};


var itemLinkSchema = new Schema({
    item_id : { type: String, unique: true, required: true }, //id единицы контента
    node_id : { type: String, unique: true, required: true },
    source_url : { type: String, required: true, unique: true },
    state : {type: String, required: true}, //состояние связи
    author : { type: String, unique: true, required: true }, //указывает на login того, кто залинковал
    created_at : Date,
    updated_at : Date,
    extras : {}
}, {collection : "itemlinks"});


//item schema - модель единицы учебного контента
var itemSchema = new Schema({
    item_id : { type: String, unique: true, required: true }, //id генерируется парсером на основе uri айтема или его содержимого
    source_url : { type: String, required: true },    //ссылается на source_url SourceSchema
    item_type : {type: String, required: true},
    item_description : String,
    created_at : Date,
    updated_at : Date,
    extras : {}, //в этом поле может храниться дополнительная инфа
    attachment_id : {},
    body : {} //в этом поле (если не в аттачменте) может храниться сам контент
} , {collection : "items"});
//метод для добавления дополнительных полей. Будет вызываться после парсинга
itemSchema.methods.attachExtras = function(_extras) {
    // add some stuff to the users name
    this.extras = _extras;

    return this.extras;
};

itemSchema.methods.setAttachment = function(_attachment_id) {
    // add some stuff to the users name
    this.attachment_id = _attachment_id;

    return this.extras;
};

itemSchema.methods.attachBody = function(_body) {
    // add some stuff to the users name
    this.extras = _body;

    return this.body;
};

var AttachmentSchema = gridfs.schema;

Attachments = mongoose.model('Attachment', AttachmentSchema);


var Source = mongoose.model('Source', sourceSchema);
var Item = mongoose.model('Item', sourceSchema);
var ItemLink = mongoose.model('ItemLink', itemLinkSchema);

// make this available to our users in our Node applications
module.exports.Source = Source;
module.exports.Item = Item;
module.exports.ItemLink = ItemLink;
module.exports.Attachment = Attachments; //mongoose.model('Attachment', AttachmentSchema);
console.log('schemas created!')

