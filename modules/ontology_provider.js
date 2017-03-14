/**
 * Created by Дмитрий on 11.03.2017.
 * точка входа для модуля управления онтологиями
 */
/*TODO объединить с модулем Игоря */
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
var requestOntology = function(params) {
    return new Promise((resolve, reject) => {
        var res = {}; var nodes = [];
        for (var i = 1; i <= 10; i++) {
            nodes.push({node_id : i, node_name : 'node_'.concat(i), node_description: 'node_description_'.concat(i)});
        }
        res.status = 'ok'; res.nodes = nodes;
        resolve(res);
    });
};
module.exports.requestOntology = requestOntology;

//requestOntology(['adad', 'awdafa']).then(nodeids => console.log(nodeids));