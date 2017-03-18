/**
 * Created by Дмитрий on 18.03.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* типы парсеров */
var parsersSchema = new Schema({
    name : { type: String, required: true, unique: true},
    source_type : {type: String, required: true, unique : true},
    saves_attachments : { type: Boolean, required: true, default : true},   //сохраняет ли парсер аттачменты? (для больших файлов)
    standalone : { type: Boolean, required: true, default : false},     //указывает на то, является ли парсер автономным приложением
    metadata : {},
    created_at : {type: Date},
    updated_at : {type: Date}
}, {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "parsers"});
parsersSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};

module.exports = mongoose.model('Parser',parsersSchema);