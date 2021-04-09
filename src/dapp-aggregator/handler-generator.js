//
"use strict";
const fs = require("fs-extra");
const {
  EthereumSmartContractInterpreter,
} = require("./interpreters/ethereumSmartContractInterpreter.js");

const testBodyFile = require.resolve("./templates/testBodyTemplate.ts");
const handlerStaticImports = fs
  .readFileSync(require.resolve("./templates/handlersImportTemplate.ts"))
  .toString();

function generateHandlerHead(name, entities, contracts, events, args = {}) {
  let genGQLTypescript = "./generated/models/";
  let genContractTypescript = "./generated/contracts/";

  let staticImports = handlerStaticImports;

  // let eventImports = "import { $events } from '../generated/contracts/$name.d.ts'"
  //   .split("$name")
  //   .join(name)
  //   .split("$events")
  //   .join(events.join(", "));
  //let eventImports = ""

  let contractImports = "";
  //contracts is a list or map
  //console.log(contracts);
  for (var contract of contracts) {
    //console.log(contract);
    let contractName = contract.name.toString();
    let contractText = "import {$name} from '../generated/contracts/$name' \n"
      .split("$name")
      .join(contractName);
    contractImports += contractText;
  }

  let modelNames = entities.filter(function (e) {
    return (
      e != "Proof" && e != "Query" && e != "Mutation" && e != "Subscription"
    );
  });

  let modelImports = "import { $models } from '../generated/models/models'"
    .split("$models")
    .join(modelNames.join(", "));
  return staticImports + "\n" + contractImports + "\n" + modelImports + "\n";
}

function generateHandlers(abi, outputFolder, config = {}) {
  let interpreter = new EthereumSmartContractInterpreter(abi, outputFolder);
  let resp = interpreter.generateHandlers();

  let events = interpreter
    .getEvents()
    .map((contractEvent) => contractEvent.name); //interpreter get
  let name = config.name;
  let contracts = config.contracts;
  let entities = config.entities;

  let importText = generateHandlerHead(name, entities, contracts, events);
  let handlersText = importText + resp.eventHandlers;

  fs.outputFileSync(outputFolder + ".ts", handlersText);
  //fs.writeFileSync(
  //  outputFolder + "/transactionHandler.js",
  //  transactionHandlerTemplate
  //);
  //fs.writeFileSync(outputFolder + "/index.js", mainHandlerTemplate);
  let handlers = {
    main: outputFolder + ".ts",
  };
  return handlers;
}

function generateTestHandlers(abi, outputFolder, config = {}) {
  let testHandlerBody = fs.readFileSync(testBodyFile).toString();
  let interpreter = new EthereumSmartContractInterpreter(abi, outputFolder);
  let resp = interpreter.generateHandlers(testHandlerBody);

  let events = interpreter
    .getEvents()
    .map((contractEvent) => contractEvent.name); //interpreter get
  let name = config.name;
  let contracts = config.contracts;
  let entities = config.entities;

  let importText = generateHandlerHead(name, entities, contracts, events);
  let handlersText = importText + resp.eventHandlers;

  fs.outputFileSync(outputFolder + ".ts", handlersText);
  //fs.writeFileSync(
  //  outputFolder + "/transactionHandler.js",
  //  transactionHandlerTemplate
  //);
  //fs.writeFileSync(outputFolder + "/index.js", mainHandlerTemplate);
  let handlers = {
    main: outputFolder + ".ts",
  };
  return handlers;
}

module.exports = { generateHandlers, generateTestHandlers };

// require("graphql/language");
//
// const chalk = require('chalk');
// const fs = require('fs-extra');
// const yaml = require('js-yaml')
// const dockerFileTemplate = require('./dockerfile')
// // const gql = require('graphql-tag');
