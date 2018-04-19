/**
 * Created by Дмитрий on 18.03.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* типы парсеров */
var parsersSchema = new Schema({
    uri: { type: String, required:true, unique: true},
    name : { type: String, required: true, unique: true},
    description : {type: String, default : "Undescribed parser"},
    url : {type: String, default: "No url"}, //url, по которому необходимо обращаться к standalone парсеру
    saves_attachments : { type: Boolean, required: true, default : false},   //сохраняет ли парсер аттачменты? (для больших файлов)
    user_id: {type: String, required:true, default: "Kostyl"},
    standalone : { type: Boolean, required: true, default : false},     //указывает на то, является ли парсер автономным приложением
    metadata : {},
    created_at : {type: Date},
    updated_at : {type: Date}
}, {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "parsers"});

parsersSchema.methods = {
    attachMetadata : function(_metadata) {
        this.metadata = _metadata;
    }
};

parsersSchema.statics = {
    getByUri : function(uri) {
        return this.findOne({ uri : uri }).exec();
    },
    load : function(_id) {
        return this.findOne({ _id }).exec();
    }


};

module.exports = mongoose.model('Parser',parsersSchema);