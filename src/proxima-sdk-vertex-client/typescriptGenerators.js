"use strict";
//imports
//path to config templates
const yaml = require("js-yaml");
const fs = require("fs-extra");

const schemaGenConfigTemplateFilePath = require.resolve(
  "./schemaGenConfigTemplate.yml"
);
const dataloaderGen = require("../data-vertex-node/index.js");

//schemaEntityTemplate //template
const schemaTypescriptTemplate = fs.readFileSync(
  require.resolve("./schemaTypescriptTemplates.ts")
);

const ethereumTypescriptTemplate = fs.readFileSync(
  require.resolve("./ethereumTypescriptTemplates.ts")
);

function getEvents(fileText) {
  let eventSet = new Set();
  let newStr = fileText;
  let start = 'getEvent(nameOrSignatureOrTopic: "';
  let end = '"): EventFragment;';
  while (newStr != "" && newStr.includes(start)) {
    newStr = newStr.substring(newStr.indexOf(start));
    newStr = newStr.replace(start, "");

    let eventStr = newStr.substring(0, newStr.indexOf(end));
    eventSet.add(eventStr);
  }
  return Array.from(eventSet);
}

function updateEthereumTypescriptTypes(schemaFile, typescriptOutputPath) {
  let templateFile = ethereumTypescriptTemplate;
  let files = fs.readdirSync(typescriptOutputPath); //get files from typescriptOutputPath?

  for (const f of files) {
    let file = typescriptOutputPath + "/" + f.toString();
    if (fs.pathExistsSync(file) && file.toString().includes(".d.ts")) {
      let fileText = fs.readFileSync(file).toString();
      let events = getEvents(fileText);
      let newFileText = processEthereumTypescriptTemplate(
        file,
        templateFile,
        fileText,
        events
      );
      fs.outputFileSync(file, newFileText);
    }
  }
}

function processEthereumTypescriptTemplate(
  file,
  templateString,
  fileText,
  events
) {
  // let oldStr = "attach(addressOrName: string): this;";
  //get the events, string
  let temp = file.split("/");

  let name = temp[temp.length - 1].replace(".d.ts", "");

  let placementString =
    'import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";\n\n';
  let newStr = "";
  let eStr = "export type $eventname = $entityName.$eventname\n";
  for (var e of events) {
    //  let e = events[i];
    //console.log(i);
    //console.log(e);
    newStr += eStr.split("$eventname").join(e);
  }
  newStr = newStr.split("$entityName").join(name);
  newStr += "\n" + placementString;
  return fileText; //fileText.split(placementString).join(newStr);
}

function updateSchemaTypescriptTypes(schemaFile, typescriptOutputPath) {
  if (!typescriptOutputPath.includes(".ts")) {
    typescriptOutputPath += "/models.ts";
  }
  //export type Scalars = {
  let fileText = fs.readFileSync(typescriptOutputPath).toString();

  let templateFile = schemaTypescriptTemplate;
  let processedFileText = processSchemaTypescriptTemplate(
    schemaFile,
    templateFile,
    fileText
  );
  fs.outputFileSync(typescriptOutputPath, processedFileText);
}

function processSchemaTypescriptTemplate(schemaFile, entityTemplate, fileText) {
  let entities = dataloaderGen.getDataloaders({}, schemaFile);
  let processedText = fileText;
  //console.log(fileText);
  let templateList = entityTemplate.toString().split("####");
  let entityTemplateImports = templateList[0];
  let entityFnTemplate = templateList[1];
  let entityGeneralTemplate = templateList[2];
  for (const [name, entity] of Object.entries(entities)) {
    let eOldStr = "typename?: '$EntityName';\n"
      .split("$EntityName")
      .join(entity.entityName);

    let entityNewStr = entityFnTemplate;

    let processedTextList = processedText.split(eOldStr);

    processedTextList[1] = processedTextList[1].replace(
      "};\n",
      entityFnTemplate + "};\n"
    );

    processedText = processedTextList
      .join(eOldStr)
      .split("$EntityName")
      .join(entity.entityName);
  }

  processedText += entityGeneralTemplate;
  //console.log(entityTemplateImports);
  return entityTemplateImports.toString() + processedText;
}

function updateTypescriptGenConfiguration(
  schemaFile,
  typescriptOutputPath = "./DataAggregator/generated/models",
  outputConfigGenFile = "./codegen.yml"
) {
  let outFile = typescriptOutputPath + "/models.ts";
  let outTestFile = typescriptOutputPath + "/queries.ts";
  //yaml.safeLoad(fs.readFileSync(schemaGenConfigTemplateFilePath));
  let scalars = { BigDecimal: "number", BigInt: "number" };
  let declarationKind = {
    type: "class",
    input: "type",
    query: "interface",
    mutation: "interface",
  };
  let typeScriptPlugins = [
    "typescript",
    "typescript-operations",
    "typed-document-node",
    //"typescript-react-apollo"
    //"typescript-graphql-request"
  ];

  let typeScriptTestPlugins = [
    "typescript",
    "typescript-operations",
    //"typescript-react-apollo"
    "typescript-graphql-request",
  ];

  let typeScriptConfig = {
    namingConvention: "keep",
    useImplementingTypes: true,
    noExport: false,
    //rawRequest: true,
    //documentMode: "documentNode",
    declarationKind: declarationKind,
    //scalars: scalars,
  };

  let typeScriptTestConfig = {
    namingConvention: "keep",
    useImplementingTypes: true,
    noExport: false,
    //rawRequest: true,
    //documentMode: "documentNode",
    declarationKind: declarationKind,
    //scalars: scalars,
  };

  let generateConfig = {};
  generateConfig[outFile] = {
    plugins: typeScriptPlugins,
    config: typeScriptConfig,
  };

  generateConfig[outTestFile] = {
    plugins: typeScriptTestPlugins,
    config: typeScriptTestConfig,
  };
  let schemaFolder =
    schemaFile.substring(0, schemaFile.lastIndexOf("/")) + "/*.graphql";
  let config = {
    schema: schemaFile,
    documents: schemaFolder,
    generates: generateConfig,
  };

  fs.outputFileSync(outputConfigGenFile, yaml.safeDump(config));
}

const schemaTypescriptGenerator = {
  updateSchemaTypescriptTypes,
  updateTypescriptGenConfiguration,
};
const ethTypescriptGenerator = { updateEthereumTypescriptTypes };

module.exports = {
  schemaTypescriptGenerator,
  ethTypescriptGenerator,
};
