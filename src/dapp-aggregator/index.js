"use strict";

const fs = require("fs-extra");
const yaml = require("js-yaml");

const handlerGen = require("./handler-generator.js");
const clientGen = require("../proxima-sdk-vertex-client/index.js");
const schemaProcesser = require("../schema/index.js");
const { exec } = require("child_process");
////////////////////////////////////////////////////////////////////////
const dockerFileTemplate = fs
  .readFileSync(require.resolve("./templates/Dockerfile"))
  .toString();
const packageTemplate = JSON.parse(
  fs
    .readFileSync(require.resolve("./templates/packageTemplate.json"))
    .toString()
);

const aggregatorTemplate = fs
  .readFileSync(
    require.resolve("./templates/dataAggregatorTypescriptTemplate.ts")
  )
  .toString();

function generateHandlers(config, testGen = true) {
  fs.ensureDirSync("./handlers");
  let mainHandlerTemplate = "";
  //entities
  let entitiesDict = schemaProcesser.getEntities(config);
  let entities = Object.keys(entitiesDict);
  for (var datasource of config.datasources) {
    let outputFolder = "./handlers/" + datasource.name;
    let abi = getABI(datasource.source.abi, datasource.contracts);
    if (!datasource.entities) {
      datasource.entities = entities;
    }
    let handlers = handlerGen.generateHandlers(abi, outputFolder, datasource);

    if (testGen) {
      let testOutputFolder = "./handlers/" + datasource.name + "_Test";
      let testHandlers = handlerGen.generateTestHandlers(
        abi,
        outputFolder,
        datasource
      );
    }

    datasource.handlers = handlers;
  }
  //
  let configText = yaml.safeDump(config);
  fs.writeFileSync("./app-config.yml", configText);
}

function getABI(abiName, contracts) {
  for (var contract of contracts) {
    if (contract.name == abiName) {
      return JSON.parse(fs.readFileSync(contract.file, "utf8").toString());
    }
  }
}

async function buildDataAggregator(app_config = {}) {
  let config = app_config;
  if (config == {}) {
    config = yaml.safeLoad(fs.readFileSync("./app-config.yml"));
  }

  fs.ensureDirSync("./DataAggregator");
  fs.copySync("./abi", "./DataAggregator/abi");
  fs.copySync("./app-config.yml", "./DataAggregator/app-config.yml");
  fs.writeFileSync("./DataAggregator/dockerfile", dockerFileTemplate);
  generateDataAggregatorMain();
  packageTemplate.name = config.name;
  packageTemplate.version = config.versions;
  fs.outputFileSync(
    "./DataAggregator/package.json",
    JSON.stringify(packageTemplate)
  );

  let proximaConfig = yaml.safeLoad(fs.readFileSync("./.proxima.yml"));
  proximaConfig.data_aggregator = "./DataAggregator";
  let proximaConfigText = yaml.safeDump(proximaConfig);
  fs.writeFileSync("./.proxima.yml", proximaConfigText);

  if (!fs.pathExistsSync("./handlers/") || true) {
    generateHandlers(config, true);
  }

  fs.copySync("./handlers/", "./DataAggregator/handlers/");

  let genContractTypescript = "../generated/contracts/";
  await clientGen.generateEthereumTypescriptTemplates(config); //then
  //fs.ensureDirSync("./DataAggregator/generated/contracts");
  //fs.copySync(genContractTypescript, "./DataAggregator/generated/contracts/");

  let genGQLTypescript = "../generated/models/";
  await clientGen.generateSchemaTypescriptTemplates(config);
  //fs.ensureDirSync("./DataAggregator/generated/models");
  //fs.copySync(genGQLTypescript, "./DataAggregator/generated/models/");

  //shell exec in different folders
  //exec("npm install")
}

function generateDataAggregatorMain() {
  fs.outputFileSync("./DataAggregator/index.js", aggregatorTemplate);
  //update
}

module.exports = { buildDataAggregator, generateHandlers };
