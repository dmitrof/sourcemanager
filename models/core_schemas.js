/**
 * Created by Дмитрий on 12.12.2016.
 * здесь будут все схемы. Необходимо переделать dbHelper (или обойтись без него)
 */
var mongoose = require('mongoose');
var dbHelper = require('./../modules/db_wrapper');
var fs = require('fs');
var mongoose_attachments = require('mongoose-attachments-aws2js');
var Schema = mongoose.Schema;
//аттачменты gridfs

/* типы источников. Может содержать неявную ссылку на tutorClient*/
var sourceTypesSchema = new Schema({
    type : { type: String, required: true, unique: true},
    description : { type: String,  default : "Undescribed source"},
    metadata : {}
}, {collection : "source_types"});
sourceTypesSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
/* типы парсеров */
var parsersSchema = new Schema({
    name : { type: String, required: true, unique: true},
    source_type : {type: String, required: true, unique : true},
    metadata : {}
}, {collection : "parsers"});
parsersSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
/*source Schema - модель источника данных
    содержит данные, необходимые для управления источником, сбором материала
 */
var sourceSchema = new Schema({
    url : { type: String, required: true, unique: true},
    type : {type: String, required: true},
    name : {type: String, required: true, default : "Unnamed source"},
    description : String,
    author : String,            //данные об авторае ресурса?
    added_by_user : {type: String, required: true, default : "Kostyl"}, //TODO имя или id пользователя (переделать, когда появится аутентификация)
    creation_time : Date,       //время создания ресурса (если имеется)
    save_time : {type: Date, required: true},
    update_time : {type: Date, required: true},
    last_parsing_time : {type: Date},
    extras : {},
    metadata : {}
} , {collection : "sources"});

sourceSchema.methods.attachExtras = function(_extras) {
    this.extras = _extras;
};
sourceSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
/*
схема "конструктора" контента. Конструктор связан с "типом" источника
 */
var tutorClientSchema = new Schema({
    tutor_client_name : { type: String, required: true, unique: true },
    source_description : String,
    metadata : {}
} , {collection : "tutor_clients"});

tutorClientSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
/*
item schema - модель единицы учебного контента
 */
var itemSchema = new Schema( {
    item_id : { type: String, unique: true, required: true }, //id генерируется парсером на основе uri айтема или его содержимого
    source_url : { type: String, required: true },    //ссылается на source_url SourceSchema
    parsed : { type: Boolean, required: true, default : true},
    has_attachment : { type: Boolean, required: true, default : false},
    item_type : {type: String, required: true},
    item_description : String,
    created_at : Date,
    updated_at : Date,
    metadata : {},
    extras : {}, //в этом поле может храниться дополнительная инфа
    attachment_id : {},
    body : {} //в этом поле (если не в аттачменте) может храниться сам контент
} , {collection : "items"});
//метод для добавления дополнительных полей. Будет вызываться после парсинга
itemSchema.methods.attachExtras = function(_extras) {
    this.extras = _extras;
};
itemSchema.methods.attachBody = function(_body) {
    this.extras = _body;
};
itemSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
itemSchema.methods.setAttachment = function(_attachment_id) {
    this.attachment_id = _attachment_id;
};

/*ItemLinkSchema
 */
var itemLinkSchema = new Schema({
    item_id : { type: String, unique: true, required: true }, //id единицы контента
    node_id : { type: String, unique: true, required: true },
    source_url : { type: String, required: true, unique: true },
    state : {type: String, required: true}, //состояние связи
    item_link_author : { type: String, unique: true, required: true }, //указывает на login того, кто залинковал
    created_at : Date,
    updated_at : Date,
    metadata : {}
}, {collection : "item_links"});

itemLinkSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};

/* linkTagSchema */
var linkTagSchema = new Schema({
    text : { type: String, required: true, unique: true},
    description : { type: String,  default : "Undescribed tag"},
    metadata : {},
    nodes : {}  //TODO решить где хранить
}, {collection : "source_types"});

linkTagSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};
linkTagSchema.methods.attachNodes = function(_nodes) {
    this.nodes = _nodes;
};
//var AttachmentSchema = gridfs.model;

//Attachments = mongoose.model('Attachment', AttachmentSchema);
module.exports.Source = mongoose.model('Source', sourceSchema);
module.exports.SourceType = mongoose.model('SourceType', sourceTypesSchema);
module.exports.Item = mongoose.model('Item', sourceSchema);
module.exports.ItemLink = mongoose.model('ItemLink', itemLinkSchema);
module.exports.TutorClientDoc = mongoose.model('TutorClientDoc', tutorClientSchema);
module.exports.Parser = mongoose.model('Parser', parsersSchema);
module.exports.LinkTag = mongoose.model('LinkTag', linkTagSchema);

//

//module.exports.Attachment = Attachments; //mongoose.model('Attachment', AttachmentSchema);
console.log('core_schemas created!');

