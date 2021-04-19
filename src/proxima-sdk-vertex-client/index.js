"use strict";

const vertex = require("./proximaClientGenerator.js");
const { exec } = require("child_process");
const fs = require("fs-extra");
//IMPORTS
const {
  schemaTypescriptGenerator,
  ethTypescriptGenerator,
} = require("./typescriptGenerators.js");

async function generateEthereumTypescriptTemplates(app_config = {}) {
  let abiPath = "./abi";
  let typescriptOutputPath = "./DataAggregator/generated/contracts";
  let schemaFile = app_config.schema.file;
  let resp = await runEthereumCommand(
    abiPath,
    typescriptOutputPath,
    app_config
  );

  ethTypescriptGenerator.updateEthereumTypescriptTypes(
    schemaFile,
    typescriptOutputPath
  );
}

async function runCommandLineArgs(commandList) {
  //for each in commandLine, run the argument, check for errors, print args
  let commandLineText = commandList.join(" && "); //map to add " && " between values join
  //console.log(commandLineText);
  let resp = await new Promise((resolve, reject) => {
    exec(commandLineText, function (error, stdout, stderr) {
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);
      if (error !== null) {
        console.log("exec error: " + error);
        // Reject if there is an error:
        return reject(error);
      }
      // Otherwise resolve the promise:
      resolve();
    });
  }, 1000);
  return resp;
}

async function runEthereumCommand(
  abiPath,
  typescriptOutputPath,
  targetVersion = "ethers-v5"
) {
  let installArgs = [
    //"npm i  --save-dev typescript",
    //"npm install --save-dev typechain",
    "npm i  --save-dev ethers",
    "npm i @typechain/ethers-v5",
    //@typechain/truffle-v5 @typechain/web3-v1 @typechain/truffle-v4 @typechain/hardhat",
  ];
  //targetVersion = "../../node_modules/@typechain/ethers-v5";
  targetVersion = "ethers-v5";
  let res = await runCommandLineArgs(installArgs);
  let genArg =
    "typechain --target $targetVersion --outDir '$typescriptOutputPath' '$abiPath/*.json'";
  genArg = genArg
    .replace("$abiPath", abiPath)
    .replace("$typescriptOutputPath", typescriptOutputPath)
    .replace("$targetVersion", targetVersion);
  let resp = await runCommandLineArgs([genArg]);
}

async function generateSchemaTypescriptTemplates(app_config = {}) {
  //console.log(app_config);
  let schemaFile = app_config.schema.file;
  let outputConfigGenFile = "./codegen.yml";
  //here
  let typescriptOutputPath = "./DataAggregator/generated/models";
  //typescriptOutputPath + "/models.ts"
  fs.ensureDirSync(typescriptOutputPath);

  schemaTypescriptGenerator.updateTypescriptGenConfiguration(
    schemaFile,
    typescriptOutputPath,
    outputConfigGenFile
  );

  let resp = await runSchemaCommand(schemaFile, typescriptOutputPath);
  //console.log(app_config);
  schemaTypescriptGenerator.updateSchemaTypescriptTypes(
    schemaFile,
    typescriptOutputPath
  );
}

async function runSchemaCommand(schemaFile, typescriptOutputPath) {
  let installArgs = [
    "npm install --save graphql",
    "npm install --save @graphql-codegen/cli",
    "npm install --save @graphql-codegen/typescript",
    "npm install --save @graphql-codegen/typescript-operations",
    "npm install --save @graphql-codegen/typed-document-node",
    //"npm install --save @graphql-codegen/typescript-mock-data",
    //"npm install --save @graphql-codegen/typescript-react-apollo",
    "npm install --save-dev graphql-codegen-typescript-mock-data",
  ];

  //let res = await runCommandLineArgs(installArgs);

  let genArg = "npx graphql-codegen --config ./codegen.yml";
  let resp = await runCommandLineArgs([genArg]);
}

//utils
function generateProximaSDKVertexClient(config) {
  let vertexConfig = {};
  vertexConfig.name = config.name;
  vertexConfig.schemaFile = config.schema.file;
  vertex.generateVertexClient(vertexConfig);
}

module.exports = {
  generateProximaSDKVertexClient,
  generateEthereumTypescriptTemplates,
  generateSchemaTypescriptTemplates,
};
