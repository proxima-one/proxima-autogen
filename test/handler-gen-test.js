var assert = require("assert");
const autogen = require("../src/index.js");
var srcDir = "./test/data/schema/";
var destDir = "./test/handler_test";
const process = require("process");
const testHandlerProjectPath = "./test/data/Test_Project";
const fs = require("fs-extra");
const yaml = require("js-yaml");

//var abi file folders
//var test folders
//write handlers for each of the functions

async function handlerGenSetup() {
  fs.ensureDirSync(destDir);
  fs.copySync(testHandlerProjectPath, destDir);
  let config = yaml.safeLoad(fs.readFileSync(destDir + "/app-config.yml"));
  let schema_file = "schema.graphql";
  //await autogen.processSchema({}, destDir + "/schema/" + schema_file);
  process.chdir(destDir);

  return config;
}

function cleanup(testDir) {
  //go back to the regular stuff
  process.chdir("../../.");
  fs.removeSync(testDir);
}

describe("Handlers", async function() {
  afterEach(function() {
    // runs each test in this block
    cleanup(destDir);
  });

  // it("should be able to generate typescript functions from contracts", async function() {
  //   //this.timeout(30000);
  //   //let config = await handlerGenSetup();
  //   //process.chdir("../../.");
  //   //let resp = await autogen.generateEthereumTypescriptTemplates(config); //
  //   //find event hames and check in abi
  //   //generate typescript clients
  //   //assert  generated folder contracts
  //   //assert(fs.pathExistsSync(destDir+ "/handlers/blockchain-handlers.js"), true)
  //   //asert that this is not empty
  //   // let contractsExist = fs.pathExistsSync(
  //   //   "./DataAggregator/generated/contracts"
  //   // );
  //   // //cleanup(destDir);
  //   // assert.equal(contractsExist, true);
  // });

  it("should be able to generate typescript from schema", async function() {
    this.timeout(35000);
    let config = await handlerGenSetup();
    let resp = await autogen.generateSchemaTypescriptTemplates(config);
    let modelExists = fs.pathExistsSync("./DataAggregator/generated/models");
    let fileExists = fs.pathExistsSync(
      "./DataAggregator/generated/models/models.ts"
    );
    //assert(, true);
    //cleanup(destDir);
    assert.equal(modelExists, true);
    assert.equal(fileExists, true);
  });
});
