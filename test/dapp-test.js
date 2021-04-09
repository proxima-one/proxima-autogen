"use strict";
var assert = require("assert");
const autogen = require("../src/index.js");
var srcDir = "./test/data/schema/";
var destDir = "./test/data_aggregator_test";
const testHandlerProjectPath = "./test/data/Test_Project";
const fs = require("fs-extra");
const yaml = require("js-yaml");

async function dataAggregatorSetup() {
  fs.ensureDirSync(destDir);
  fs.copySync(testHandlerProjectPath, destDir);
  // fs.outputFileSync(
  //   destDir + "/proxima-sdk-vertex-client/index.js",
  //   "proxima sdk vertex client"
  // );
  // fs.outputFileSync(
  //   destDir + "/blockchain-clients/index.js",
  //   "blockchain client"
  // );
  let config = yaml.safeLoad(fs.readFileSync(destDir + "/app-config.yml"));
  process.chdir(destDir);
  return config;
}

function cleanup() {
  process.chdir("../../.");
  //fs.removeSync(destDir);
}

describe("dapp aggregator gen", async function () {
  after(function () {
    // runs before each test in this block
    cleanup();
  });
  //correct file structure
  it("should run correctly", async function () {
    this.timeout(50000);
    let config = await dataAggregatorSetup();
    let resp = await autogen.buildDataAggregator(config);
    assert.equal(true, true);
  });
  //finds the blockchain client (autogen) ? if not already there
  it("should have the abi and schema", function () {
    //assert(fs.pathExistsSync("./DataAggregator/schema"), true)
    assert(fs.pathExistsSync("./DataAggregator/abi"), true);
  });
  //abi code import
  it("should have function handlers", function () {
    assert(fs.pathExistsSync("./DataAggregator/handlers"), true);
  });
  //uses the interpreters for the smart contracts (autogen)
  it("should have blockchain client and vertex client", function () {
    assert(fs.pathExistsSync("./DataAggregator/generated/"), true);
    assert(fs.pathExistsSync("./DataAggregator/generated/models/"), true);
    assert(
      fs.pathExistsSync("./DataAggregator/generated/models/models.ts"),
      true
    );
    assert(fs.pathExistsSync("./DataAggregator/generated/contracts/"), true);
  });
  //correctly adds
  it("should have the dockerfile", function () {
    assert(fs.pathExistsSync("./DataAggregator/Dockerfile"), true);
    assert(fs.pathExistsSync("./DataAggregator/package.json"), true);
  });
});
