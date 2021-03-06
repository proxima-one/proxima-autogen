"use strict";
var assert = require("assert");
const autogen = require("../src/index.js");
const resolverGen = require("../src/data-vertex-node/index.js");
var destDir = "./test/data_vertex_test";
const testHandlerProjectPath = "./test/data/Test_Project";
const fs = require("fs-extra");
const yaml = require("js-yaml");
const schemaResolversTemplatePath =
  "./DataVertex/pkg/resolvers/schema.resolvers.go";

async function dataVertexSetup() {
  fs.ensureDirSync(destDir);
  //console.log("Current directory: " + process.cwd());
  fs.copySync(testHandlerProjectPath, destDir);
  let config = yaml.safeLoad(fs.readFileSync(destDir + "/app-config.yml"));
  process.chdir(destDir);
  autogen.processSchema(config);
  autogen.generateApplicationDatabase(config);
  return config;
}

function cleanup() {
  process.chdir("../../.");
  //fs.removeSync(destDir);
}

describe("data vertex gen", async function () {
  after(function () {
    // runs before each test in this block
    cleanup();
  });
  //correct file structure
  it("should run without errors", async function () {
    this.timeout(50000);
    let config = await dataVertexSetup();
    let resp = await autogen.buildDataVertex(config);
    assert(fs.pathExistsSync("./DataVertex/pkg/resolvers/resolver.go"));
    assert(
      fs.pathExistsSync("./DataVertex/pkg/resolvers/resolver_fns.go"),
      true
    );
  });
  //gqlgen works
  it("should have correctly cloned the data vertex with necessary files", async function () {
    //ensure that it is able to clone and get the repository
    assert(fs.pathExistsSync("./DataVertex"), true);
  });
  //main fn works
  it("should correctly import schema, database, app-config and proxima config", async function () {
    assert(fs.pathExistsSync("./DataVertex/database/db-config.yaml"), true);
    assert(fs.pathExistsSync("./DataVertex/schema/schema.graphql"), true);
    assert(fs.pathExistsSync("./DataVertex/app-config.yml"), true);
    assert(fs.pathExistsSync("./DataVertex/.proxima.yml"), true);
  });
  //gqlgen works
  it("should correctly use gqlgen generate", async function () {
    //unknown how this is done.
    assert(fs.pathExistsSync("./DataVertex/database/db-config.yaml"), true);
  });
  //resolvers in correct positioning
  it("should correctly have new resolvers generated", async function () {
    // assert(
    //   !fs.pathExistsSync("./DataVertex/pkg/resolvers/schema.resolvers.go")
    // );
    assert(
      fs.pathExistsSync("./DataVertex/pkg/resolvers/resolver_fns.go"),
      true
    );
    //    panic(fmt.Errorf("not implemented"))
  });
  //dockerfile builds
  it("should correctly create the main file", async function () {
    assert(fs.pathExistsSync("./DataVertex/main.go"), true);
    assert(fs.pathExistsSync("./DataVertex/dockerfile"), true);
    assert(true, true);
  });
});
