"use strict";

const fs = require("fs-extra");
const processer = require("./schemaProcesser.js");
const docGen = require("./documentEntityGenerator.js");

function processSchema(config, file = "") {
  let schemaFile = file;
  if (schemaFile == "") {
    schemaFile = config.schema.file;
  }
  processer.processSchema(schemaFile);
  docGen.generateEntityGQLDocuments(schemaFile);
}

function createTestEntities(config, sFile = "", outFile = "") {
  let outputFile = outFile;
  let schemaFile = sFile;
  if (schemaFile == "") {
    schemaFile = config.schema.file;
  }
  if (outputFile == "") {
    outputFile = "./utils/testdata/vertex_entities.json";
  }
  processer.createTestEntities(schemaFile, outputFile);
}

function createTestQueries(config, sFile = "", outFile = "") {
  let outputFile = outFile;
  let schemaFile = sFile;
  if (schemaFile == "") {
    schemaFile = config.schema.file;
  }
  if (outputFile == "") {
    outputFile = "./utils/testdata/vertex_queries.json";
  }
  processer.createTestQueries(schemaFile, outputFile);
}

function getSchemaDir(config) {
  //search the schema directory
  //replace the config
}

module.exports = {
  processSchema: processSchema,
  createTestEntities: createTestEntities,
  createTestQueries: createTestQueries,
  getEntities: processer.getEntities,
  getEntityObjects: processer.getEntityObjects,
};
