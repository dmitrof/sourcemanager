/**
 * Created by Дмитрий on 11.03.2017.
 * точка входа для модуля управления онтологиями
 */
/* Компонент для доступа к онтологиям*/
var requestService = require('alslibs').requestService;
const config = require('./../config');

const HOST = 'localhost';
const PORT = '3001';

var requestNodesData = function (node_ids) {
    return new Promise((resolve, reject) => {
        //let response = { nodes : []};
        var nodes = [];
        node_ids.forEach(function (node_id, i, node_ids) {
            let node_name = 'node_'.concat(i);
            let node_description = 'node_description_i';
            let node_info = {node_id: node_id, node_name: node_name, node_description: node_description};
            nodes.push(node_info);
        });
        let response = {nodes: nodes, status: 'ok'};
        resolve(response);
    });
};
module.exports.requestNodesData = requestNodesData;

/*вот это будет понятно как делать, когда Игорь подключится */
var getOntology = async function (domain_uri) {
    console.log("quering ontologyservice for domain: " + domain_uri);
    var options = {
        host: config.ontologyservice.host,
        port: config.ontologyservice.port,
        path: '/api/trees/' + domain_uri,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        let result = await requestService(options);
        return {success: true, message: 'Получена онтология по запросу', data: result.data};
    }
    catch (e) {
        return {};
    }
};

var getDomains = async function()
{
    console.log("quering ontologyservice for domains list ");
    var options = {
        host: config.ontologyservice.host,
        port: config.ontologyservice.port,
        path: '/api/trees/',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    let result = await requestService(options);
    return {success: result.success, message: result.message, data: result};
};


module.exports.requestOntology = getOntology;

module.exports.getDomains = getDomains;

//requestOntology(['adad', 'awdafa']).then(nodeids => console.log(nodeids));