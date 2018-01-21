/**
 * Created by Дмитрий on 11.03.2017.
 * точка входа для модуля управления онтологиями
 */
/* Компонент для доступа к онтологиям
* */
var http = require("http");
var https = require("https");
var sampleTree = require('./../modules/sample_tree.json');
var requestService = require('alslibs').requestService;

const HOST = 'localhost';
const PORT = '3001';

var requestNodesData = function(node_ids) {
  return new Promise((resolve, reject) => {
      //let response = { nodes : []};
      var nodes = [];
      node_ids.forEach(function(node_id, i, node_ids) {
          let node_name = 'node_'.concat(i);
          let node_description ='node_description_i';
          let node_info = {node_id : node_id, node_name : node_name, node_description : node_description};
          nodes.push(node_info);
      });
      let response = { nodes : nodes, status :'ok'};
      resolve(response);
  });
};
module.exports.requestNodesData = requestNodesData;

/*вот это будет понятно как делать, когда Игорь подключится */
var getOntology = function(domain_uri) {
    return new Promise((resolve, reject) => {
        console.log("quering ontologyservice for domain: " + domain_uri);
        var options = {
            host: HOST,
            port: PORT,
            path: '/api/trees/' + domain_uri,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        var req = http.request(options, function(res)
        {
            var output = '';
            console.log(options.host + ':' + res.statusCode);
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', function() {
                var obj = JSON.parse(output);
                resolve({success: true, message:'Получена онтология по запросу', data:obj});
            });
        });

        req.on('error', function(err) {
            reject({success: false, message:'Request error', data:output})
        });
        req.end();
    });
};
module.exports.requestOntology = getOntology;

//requestOntology(['adad', 'awdafa']).then(nodeids => console.log(nodeids));