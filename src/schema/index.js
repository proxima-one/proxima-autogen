'use strict';

const fs = require('fs-extra');
const processer = require('./schemaProcesser.js')


function processSchema(config, file = "") {
  let schemaFile = file
  if (schemaFile == "") {
    schemaFile = config.schema.file
  }
  processer.processSchema(schemaFile)
  //return the config file
}

function createTestStructs(config, outputFileName = "", outputDir = "./test/") {
  let schemaFile = file
  if (schemaFile == "") {
    schemaFile = config.schema.file
  }

  let outputJSONFileName = outputDir + config.name + "_test.json"
  if outputDir != "" {
    fs.ensureDirSync(outputDir)
  }
  processer.createTestStructs(schemaFile, outputJSON)
}


function getSchemaDir(config) {
  //search the schema directory
  //replace the config
}

module.exports = {processSchema: processSchema, createTestStructs: processer.createTestStructs};
