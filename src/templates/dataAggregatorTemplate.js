'use strict'

const fs = require('fs-extra');

const yaml = require('js-yaml');

function init_datasource(datasource_config, clients, vertexClient) {
  var datasource;
  var type;
  let name = datasource_config.name
  let contracts = {}
  for (const contract of datasource_config.contracts) {
    contracts[contract.name] = fs.readFileSync(contract.file)
  }
  let abi = contracts[datasource_config.source.abi];
  let mainHandlers = require(datasource_config.handlers.main);
  let handlers = {}
  for (const [name, handler] of Object.entries(datasource_config.handlers)) {
    if (mainHandlers[name] != null) {
      handlers[key] = handler
    }
  }

  let client = clients.get(datasource_config.client.name, datasource_config.client.network)
  if (datasource_config.source.address) {
    let address = datasource_config.source.address;
    return {"datasource" : new Datasource(name, address, abi, contracts, handlers, client, vertexClient)}
  } else {
    return {"template": new DatasourceTemplate(name, abi, contracts, handlers, client, vertexClient)}
  }
}

function main() {
  let config = yaml.safeLoad(fs.readFileSync('./app-config.yml'));
  const generatedVertexClient = require('./proxima-sdk-vertex-client/index.js');
  const generatedBlockchainClients = require('./blockchain-clients/index.js');
  let name = config.name;
  let vertexClient = generatedVertexClient.init(); //vertex
  let clients = generatedBlockchainClients.init(); //clients config

  let templates = {}
  let datasources = {}

  for (var datasource of config.datasources) {
    let datasource_config = datasource;
    let resp = init_datasource(datasource_config, clients, vertexClient);
    if (resp.datasource) {
      datasources[datasource_config.name] = resp.datasource
    } else {
      templates[datasource_config.name] = resp.template
    }
  }
  aggregator.init(name, blockchainClients, datasources, templates, vertexClient, config);
}
