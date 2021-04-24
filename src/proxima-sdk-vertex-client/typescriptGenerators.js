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
  let templates = templateFile.toString().split("####");
  let files = fs.readdirSync(typescriptOutputPath); //get files from typescriptOutputPath?
  var factories = [];
  var factoryPath = "";
  let indexText = "";
  let indexFile = "";

  for (const f of files) {
    let file = typescriptOutputPath + "/" + f.toString();

    if (file.toString().includes("factories")) {
      factoryPath = file.toString();
      factories = fs.readdirSync(file.toString());
    }
    if (fs.pathExistsSync(file) && file.toString().includes("index.ts")) {
      indexFile = file.toString();
      indexText = fs.readFileSync(file).toString();
    }
  }

  for (const f of factories) {
    let file = factoryPath + "/" + f.toString();
    if (fs.pathExistsSync(file) && file.toString().includes(".ts")) {
      let fileText = fs.readFileSync(file).toString();
      let newFileText = processEthereumTypescriptTemplate(
        file,
        templateFile,
        fileText
      );
      let temp = file.split("/");
      //let events = getEvents(fileText);
      let name = temp[temp.length - 1].replace(".ts", "").split("_")[0];

      indexText = processIndexFactoryExportText(name, indexText);
      fs.outputFileSync(file, newFileText);
    }
  }
  fs.outputFileSync(indexFile, indexText.toString());
}

function processEthereumTypescriptTemplate(
  file,
  templateString,
  fileText,
  events = []
) {
  // let oldStr = "attach(addressOrName: string): this;";
  //get the events, string
  let templateFile = ethereumTypescriptTemplate;
  let templates = templateFile.toString().split("####");
  let temp = file.split("/");
  //let events = getEvents(fileText);
  let name = temp[temp.length - 1].replace(".ts", "").split("_")[0];
  let additionalImports =
    'import { Contract, ethers, Signer } from "ethers";\n'; //templates
  let factoryFnsTemplate = templates[1]; //templates

  //add the imports
  let unwantedImports = 'import { Contract, Signer } from "ethers";\n';
  fileText = fileText.replace(unwantedImports, additionalImports);

  let constructorPlacementStr = "export class " + name + "__factory {\n"; //
  let factoryFnText = factoryFnsTemplate.split("$entityName").join(name);
  fileText = fileText.replace(
    constructorPlacementStr,
    constructorPlacementStr + "\n" + factoryFnText
  );

  //fileText = fileText.replace(unwantedImports, "//" + unwantedImports + "\n");

  return fileText; //fileText.split(placementString).join(newStr);
}

function processIndexFactoryExportText(name, indexText) {
  let templateFile = ethereumTypescriptTemplate;
  let templates = templateFile.toString().split("####");
  let templateEntityExportString = "export type { $name }"; //templates[3]; //templates[0];
  let templateFactoryExportString = "export { $name__factory }"; //templates[4];
  let templateNewFactoryExportString = templates[2];
  let newExportText = templateNewFactoryExportString.split("$name").join(name);
  let oldExportText = templateFactoryExportString.split("$name").join(name);
  let unwantedExports = [templateEntityExportString.split("$name").join(name)];

  for (const e of unwantedExports) {
    indexText = indexText.replace(e, "//" + e);
  }
  let newIndexText = indexText.replace(
    oldExportText,
    newExportText + "\n" + "//" + oldExportText
  );
  return newIndexText;
}

// function updateEthereumTypescriptIndex(file, templateString, fileText, events) {
//   //getFactory Files/fileNames
// }

//for each factory

//get the name of the factory
//get the replacement (for the name )
//get the replacement for the name

//correct imports

//correct placement of the bindings

// function updateEthereumTypescriptIndex(schemaFile, typescriptOutputPath) {
//   let templateFile = ethereumTypescriptTemplate;
//   let files = fs.readdirSync(typescriptOutputPath); //get files from typescriptOutputPath?
//
//   for (const f of files) {
//     let file = typescriptOutputPath + "/" + f.toString();
//     if (fs.pathExistsSync(file) && file.toString().includes(".d.ts")) {
//       let fileText = fs.readFileSync(file).toString();
//       let events = getEvents(fileText);
//       let newFileText = processEthereumTypescriptTemplate(
//         file,
//         templateFile,
//         fileText,
//         events
//       );
//       fs.outputFileSync(file, newFileText);
//     }
//   }
// }

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

function typeScriptMockGenConfig(
  typescriptOutputPath = "./DataAggregator/generated/models",
  outputConfigGenFile = "./codegen.yml"
) {
  //
  // overwrite: true
  // schema: schema.graphql
  // generates:
  let fileOut = "./DataAggregator/generated/models/generated-mocks.ts";

  let mockdata = {
    typesFile: "./models.ts",
    enumValues: "upper-case#upperCase",
    typenames: "keep",
    // scalars: {
    //   BigDecimal: "number",
    //   BigInt: "bigint",
    // },
  };

  let plugins = [{ "typescript-mock-data": mockdata }];
  //     plugins:
  //       - typescript-mock-data:
  //           typesFile:
  //           enumValues: upper-case#upperCase
  //           typenames: keep
  //           scalars:
  //             AWSTimestamp: unix_time # gets translated to casual.unix_times
  return plugins;
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

  // plugins:
  // {"typescript-mock-data":
  //     scalars:
  //       Date: # gets translated to casual.date('YYYY-MM-DD')
  //         generator: date
  //         arguments: 'YYYY-MM-DD'}

  let generateConfig = {};
  generateConfig[outFile] = {
    plugins: typeScriptPlugins,
    config: typeScriptConfig,
  };

  generateConfig[outTestFile] = {
    plugins: typeScriptTestPlugins,
    config: typeScriptTestConfig,
  };

  let outMocksFile = typescriptOutputPath + "/generated-mocks.ts";
  let typescriptMockPlugins = typeScriptMockGenConfig();
  generateConfig[outMocksFile] = {
    plugins: typescriptMockPlugins,
    config: typeScriptConfig,
  };
  let schemaFolder =
    schemaFile.substring(0, schemaFile.lastIndexOf("/")) + "/*.graphqls";
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
