/**
 * Created by Дмитрий on 18.03.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 схема "конструктора" контента. Конструктор связан с "типом" источника
 */
var tutorClientSchema = new Schema({
    tutor_client_name : { type: String, required: true, unique: true },
    source_description : String,
    created_at : {type: Date},
    updated_at : {type: Date},
    metadata : {}
} , {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "tutor_clients"});

tutorClientSchema.methods.attachMetadata = function(_metadata) {
    this.metadata = _metadata;
};

module.exports = mongoose.model('TutorClient',tutorClientSchema);