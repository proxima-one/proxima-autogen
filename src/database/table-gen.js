//generates the tables from the entities (so that they can be called)
//schema is taken, entities are taken from the schema and write a table
'use strict';

const fs = require('fs-extra');
const { parse, visit, print } = require("graphql/language");

function generateApplicationDatabase(appConfig, schemaFile, config_outputFile) {
  let schema = fs.readFileSync(schemaFile)
  let tables = parseSchema(schema.toString());

  let fileString = generate(appConfig, tables);

  fs.outputFileSync(config_outputFile, fileString);
}

function generate(appConfig, tables) {
  let config = defaultConfig(appConfig)
  let fileString = application(config.dbName, config)
  for (let i = 0; i < tables.length; i++)  {
      fileString += table(config.dbName, tables[i])
  }
  return fileString
}

function parseSchema(schema) {
  let tables = []
  parse(schema).definitions.forEach(ast => {
    if (ast.kind == 'ObjectTypeDefinition' && ast.name.value != "Query" && ast.name.value != "Mutation") {
    tables.push(ast.name.value + "s")
  }
  });
  return tables;
}

function application(dbName, config) {
  let appString = "name: " + dbName +"\n" +
    "id: " + config.id + "  \n" +
    "owner: " + config.owner + "\n" +
    "version: " + config.version + "\n" +
    "config:\n" +
      " cache: " + config.cache + "\n" +
      " compression: " + config.compression + "\n" +
      " batching: " + config.batching + "\n" +
      " sleep: " + config.sleep + "\n" +
    "tables:\n";
    return appString;
}

function defaultConfig(config) {
  let newConfig = {}
  newConfig.name = config.name || "Default"
  newConfig.dbName = config.dbName || "DefaultDB"
  newConfig.id = config.id || "DefaultID"
  newConfig.owner = config.owner || "None"
  newConfig.version = config.version || "0.0.0"
  //default values
  let cache = "5m"
  let sleep = "10m"
  let compression = "36h"
  let batching = "5s"
  let header = ""
  let blockNum = "0"
  let version = "0.0.0"
  newConfig.config = config.config || {cache: cache, sleep: sleep, compression: compression, batching: batching}
  return newConfig
}

function table(dbName, tableName, cacheExpiration = "5m") {
  let cache = "5m"
  let sleep = "10m"
  let compression = "36h"
  let batching = "5s"
  let header = "Root"
  let blockNum = "0"
  let version = "0.0.0"
  return
  "  - name: " + tableName + "\n" +
  "    id: " + dbName +"-"+ tableName + " \n" +
  "    version: " +  version + " \n" +
  "    blockNum: " +  blockNum + " \n" +
  "    header: " +  header + " \n" +
  "    compression: " +  compression + " \n" +
  "    batching: " +  batching + " \n" +
  "    sleep: " +  sleep + " \n" +
  "    cacheExpiration: " +  cacheExpiration + " \n"
}

module.exports = {generateApplicationDatabase}
