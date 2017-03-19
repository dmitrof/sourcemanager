/**
 * Created by Дмитрий on 18.03.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* типы парсеров */
var parsersSchema = new Schema({
    name : { type: String, required: true, unique: true},
    description : {type: String, default : "Undescribed parser"},
    saves_attachments : { type: Boolean, required: true, default : false},   //сохраняет ли парсер аттачменты? (для больших файлов)
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
    load : function(_id) {
        return this.findOne({ _id }).exec();
    },
    loadByName : function(_name) {
        console.log("called loadbyname");
        return this.findOne({ name : _name }).exec();
    }

};





module.exports = mongoose.model('Parser',parsersSchema);