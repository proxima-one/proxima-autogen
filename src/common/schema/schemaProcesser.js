'use strict';

const { parse, visit, print } = require("graphql/language");

var mutations = {}
var queries = {}
var entityStrings = {}
var entities = {}

function schemaProcessing() {
  //
  //
  //
  return "";
}

async function readSchema(fileName) {
  let schema = await fs.readFile(fileName)
  return schema
}

function parseSchema(schema) {
  return parse(schema)
}

async function writeSchema(fileName, value) {
  let fileLocation = "./db/config/"+config.name+".yaml";
  await fs.writeFile(fileLocation, newSchemaText);
}

module.exports = {}
