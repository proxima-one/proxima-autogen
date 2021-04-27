"use strict";

const { parse, visit, print } = require("graphql/language");
const fs = require("fs-extra");
const schemaDirectivesFile = require.resolve("./schemaDirectives.graphql");

function processSchema(schemaFile) {
  let schema = fs.readFileSync(schemaFile).toString();
  let entities = parseSchema(schema);
  entities = checkEntities(entities); //
  let entityDict = makeDict(entities);
  let entityText = generateEntitiesText(entities, entityDict); //check entities
  let queryText = generateQueryText(entities, entityDict);
  let proofText = generateProofText();
  let scalarText = generateScalarText();
  let directivesText = generateDirectivesText();

  let schemaText =
    scalarText + queryText + entityText + directivesText + proofText;
  fs.outputFileSync(schemaFile, schemaText);
}

function getEntities(config, typeStr = "") {
  //console.log("Entity config for schema.file");
  //console.log(config);
  let schemaFile = config.schema.file;
  let schema = fs.readFileSync(schemaFile).toString();
  let entities = parseSchema(schema);
  entities = checkEntities(entities, typeStr);
  let entitiesDict = makeDict(entities);
  return entitiesDict;
}

function getEntityObjects(config, schemaFile = "", typeStr = "entity") {
  if (schemaFile == "" && len(schemaFile) == 0) {
    schemaFile = config.schema.file;
  }
  let schema = fs.readFileSync(schemaFile).toString();
  let entities = parseSchema(schema);
  entities = checkEntities(entities);
  let entitiesDict = makeDict(entities, typeStr);
  for (const [name, entity] of Object.entries(entitiesDict)) {
    if (entitiesDict[name] == {}) {
      delete entitiesDict[name];
      continue;
    } else {
      entitiesDict[name] = generateEntityTestStruct(entity);
    }
  }
  return entitiesDict;
}

function isEntityofType(entity, typeStr) {
  let entityType = getEntityType(entity);
  let isEntity = entityType == "entity";
  let isInput = entityType == "entityInput";
  let isFunction = entityType == "mutation" || entityType == "query";
  switch (typeStr) {
    case "object":
      return isEntity || isInput;
    case "entity":
      return isEntity && !isInput;
    case "input":
      return isInput && !isEntity;
    default:
      return true;
  }
}

//isEntity

//isInput

//isObject

//isFunction

function createTestEntities(inputSchemaFile, outputJSONFile) {
  let schema = fs.readFileSync(inputSchemaFile).toString();
  let entities = parseSchema(schema);
  entities = checkEntities(entities);
  let entityDict = makeDict(entities);
  let entityTestStructs = generateEntityTestStructs(entities);
  let outputText = JSON.stringify(entityTestStructs);
  fs.outputFileSync(outputJSONFile, outputText);
}

function generateDirectivesText(config = {}) {
  let directivesText = fs.readFileSync(schemaDirectivesFile).toString();
  return directivesText;
}

function generateScalarText(config = {}) {
  let scalars = "\n";
  scalars += "scalar BigDecimal\n";
  scalars += "scalar BigInt\n";
  return scalars;
}

function generateProofText() {
  let proofText = "";

  return proofText;
}

function createTestQueries(inputSchemaFile, outputJSONFile) {
  let schema = fs.readFileSync(inputSchemaFile).toString();
  let entities = parseSchema(schema);
  entities = checkEntities(entities);

  //dataloaders

  //add directives

  //add inputs

  //entities

  //queries

  //mutations

  //subscriptions

  //proof

  //entity resolvers

  //test query text

  let outputText = generateTestQueryText(entities);
  //let outputText = JSON.stringify(entityTestStructs)
  fs.outputFileSync(outputJSONFile, outputText);
}

function getEntityName(entity) {
  // let entityType = getEntityType(entity)
  // switch (entityType) {
  //   case "entity":
  //     return entity.name.value
  //   case "entityInput":
  //     return (entity.name.value).replace("Input", "")
  //   default:
  //     return entity.name.value
  // }
  return entity.name.value.replace("Input", "");
}

function getEntityType(entity) {
  let objectType = entity.kind;
  let objectName = entity.name.value;
  if (
    objectName == "Query" ||
    objectName == "Mutation" ||
    objectName == "Proof"
  ) {
    return objectName.toLowerCase();
  }
  if (objectType == "InputObjectTypeDefinition") {
    return "entityInput";
  }
  return "entity";
}

//generateQueryTestStructs

function generateEntityTestStructs(entities) {
  var name;
  var entityTestFunctions;
  var completeTestStructs = {};
  //console.log(entities)
  for (const entity of entities) {
    let entityType = getEntityType(entity);
    //console.log(entityType)
    if (
      entityType == "mutation" ||
      entityType == "query" ||
      entityType == "proof"
    ) {
      continue;
    }
    let name = getEntityName(entity);
    let cTestStruct = { name: name };
    if (completeTestStructs[name]) {
      cTestStruct = completeTestStructs[name];
    }
    cTestStruct[entityType] = generateEntityTestStruct(entity);
    completeTestStructs[name] = cTestStruct;
    if (entityType == "entity") {
      let entityTestFns = generateEntityTestFunctions(entity);
      completeTestStructs[name].operations = entityTestFns;
    }
  }
  return completeTestStructs;
}

function generateEntityTestFunctions(entity) {
  let name = getEntityName(entity);
  let entityTestFunctions = {};
  let operations = ["get", "getAll", "search", "put"];

  for (const operation of operations) {
    entityTestFunctions[operation] = generateEntityTestFunction(
      name,
      entity,
      operation
    );
  }
  return entityTestFunctions;
}

function generateEntityTestFunction(name, entity, operation) {
  let variables = {};
  let outputs = {};

  let queryName = operation + name;
  let entityType = "query";
  switch (operation) {
    case "get":
      variables = { id: "ID", prove: "Boolean" };
      //single, error
      outputs = {};
      break;
    case "getAll":
      variables = {
        //from: "[String]",
        where: "String",
        order_by: "String",
        asc: "Boolean",
        first: "Int",
        last: "Int",
        limit: "Int",
        prove: "Boolean",
      };
      //list, error
      outputs = {};
      break;
    case "search":
      variables = { queryString: "String", prove: "Boolean" };
      //list, error
      outputs = {};
      break;
    case "put":
      entityType = "mutation";
      variables = { input: name + "Input" };
      //bool, error
      outputs = {};
      break;
  }

  return {
    name: queryName,
    type: entityType,
    variables: variables,
    outputs: outputs,
  };
}

function generateEntityTestStruct(entity) {
  var variableName;
  let vars = {};
  if (entity.fields) {
    for (const field of entity.fields) {
      variableName = field.name.value;
      let isList,
        isRequired,
        variableType = processJSONFieldDefinition(field);
      vars[variableName] = {
        name: variableName,
        type: variableType,
        isList: isList,
        required: isRequired,
      };
    }
  }
  return vars;
}

function generateEntitiesText(entities, entityDict = {}) {
  let entityText = "";
  for (const entity of entities) {
    if (
      entity.kind == "ObjectTypeDefinition" &&
      entity.kind != "Query" &&
      entity.kind != "Mutation" &&
      entity.name.value != "Query" &&
      entity.name.value != "Mutation" &&
      entity.name.value != "Proof"
    ) {
      entityText += generateEntityText(entity, entityDict) + "\n";
      entityText += generateEntityInputText(entity, entityDict) + "\n";
    }
    if (
      entity.kind == "InputObjectTypeDefinition" &&
      entity.kind != "Query" &&
      entity.kind != "Mutation" &&
      entity.name.value != "Query" &&
      entity.name.value != "Mutation" &&
      entity.name.value != "Proof"
    ) {
      entityText += generateEntityInputText(entity, entities) + "\n";
    }
  }
  return entityText;
}

function makeDict(entities, typeStr = "") {
  let entityDict = {};
  for (const entity of entities) {
    if (isEntityofType(entity, typeStr)) {
      entityDict[entity.name.value] = entity;
    }
  }
  return entityDict;
}

function readSchema(fileName) {
  let schema = fs.readFile(fileName);
  return schema;
}

function parseSchema(schema) {
  //console.log(schema);
  return parse(schema).definitions;
}

function checkEntities(entities) {
  for (const entity of entities) {
    checkEntity(entity);
  }
  return entities;
}

function checkEntity(entity) {
  //if not input
  let newEntity = ensureEntityIsCorrect(entity);
  return ensureEntityIsOptimized(newEntity);
}

function ensureEntityIsCorrect(entity) {
  if (!entity) {
    entity = {};
  }
  if (!entity.id) {
    entity.id = "ID!";
  }
  //
  if (!entity.proof || entity.proof != "Proof") {
    entity.proof = "Proof";
  }
  return entity;
}

function ensureEntityIsOptimized(entity) {
  //directives
  return entity;
}

function generateEntitiesText(entities, entityDict = {}) {
  let entityText = "";
  for (const entity of entities) {
    if (
      entity.kind == "ObjectTypeDefinition" &&
      entity.kind != "Query" &&
      entity.kind != "Mutation" &&
      entity.name.value != "Query" &&
      entity.name.value != "Mutation" &&
      entity.name.value != "Proof"
    ) {
      entityText += generateEntityText(entity, entityDict) + "\n";
      entityText += generateEntityInputText(entity, entityDict) + "\n";
    }
    if (
      entity.kind == "ObjectInputDefinition" &&
      entity.kind != "Query" &&
      entity.kind != "Mutation" &&
      entity.name.value != "Query" &&
      entity.name.value != "Mutation" &&
      entity.name.value != "Proof"
    ) {
      entityText += generateEntityInputText(entity, entities) + "\n";
    }
  }
  return entityText;
}

//here
//gen entity  loaders needed

//processfield

//then json + struct update

//struct get/update

function generateEntityText(entity, entityDict = {}) {
  let entityText = "type " + entity.name.value + " {\n";
  //field.kind == 'NonNullableType'
  //List Type  [], then get the name of the
  let hasProof = false;
  let pastFieldNames = {};
  for (const field of entity.fields) {
    if (field.name.value == "proof") {
      hasProof = true;
    }
    let fieldText = processFieldDefinition(
      field,
      entityDict,
      "",
      pastFieldNames
    );
    entityText = entityText.split(fieldText).join("");
    entityText += fieldText + "\n";
  }
  if (!hasProof && !entity.name.value.includes("Input")) {
    entityText += "proof: Proof \n";
  }
  return entityText + "} \n";
}

function processFieldDefinition(
  field,
  entityDict = {},
  inputText = "",
  pastFieldNames = {}
) {
  let fieldName = field.name.value;
  if (pastFieldNames[fieldName]) {
    return "";
  }
  let scalarsDict = "BigInt";
  let isList = "";
  let fieldText = ": ";
  let returnStr = "";
  let endText = "";
  field = field.type;
  while (field.kind && field.kind != "NamedType") {
    if (field.kind == "NonNullableType") {
      endText = "!" + endText;
    }
    if (field.kind == "ListType") {
      fieldText += "[";
      endText = "]" + endText;
      isList = "s";
    }
    field = field.type;
  }
  let name = field.name.value;

  if (
    entityDict[name] &&
    fieldName != "proof" &&
    name != "BigInt" &&
    name != "BigDecimal"
  ) {
    //
    if (inputText == "") {
      let entityName = name + inputText;
      let fieldResolver = "  @goField(forceResolver: true)";
      let entityEndText = endText + fieldResolver;
      returnStr += fieldName + fieldText + entityName + entityEndText + "\n";
      pastFieldNames[fieldName] = true;
    }

    fieldName = name + "ID" + isList;
    pastFieldNames[fieldName] = true;
    name = "String";
    //name
  }

  if (entityDict[name] && fieldName == "proof") {
    if (inputText == "Input") {
      return "";
    }
  }

  returnStr += fieldName + fieldText + name + endText;
  return returnStr;
}

//processInput
//remove field .value

function processJSONFieldDefinition(field) {
  var variableType;
  let isRequired = false;
  let isList = false;

  field = field.type;
  while (field.kind && field.kind != "NamedType") {
    if (field.kind == "NonNullableType") {
      isRequired = true;
    }
    if (field.kind == "ListType") {
      isList = true;
    }
    field = field.type;
  }
  variableType = field.name.value;
  return isList, isRequired, variableType;
}

function generateEntityInputText(entity, entityDict = {}) {
  let inputText = "input " + entity.name.value + "Input {\n";
  for (const field of entity.fields) {
    //inputText += processFieldDefinition(field, entityDict, "Input") + "\n";

    let fieldText = processFieldDefinition(field, entityDict, "Input");
    inputText = inputText.split(fieldText).join("");
    inputText += fieldText + "\n";
  }
  return inputText + "}\n";
}

function generateQueryText(entities) {
  let queryText = "type Query {\n";
  let mutationText = "type Mutation {\n";
  for (const entity of entities) {
    if (
      entity.kind == "ObjectTypeDefinition" &&
      entity.kind != "Query" &&
      entity.kind != "Mutation" &&
      entity.name.value != "Query" &&
      entity.name.value != "Mutation" &&
      entity.name.value != "Proof"
    ) {
      queryText += generateGetQuery(entity);
      queryText += generateGetAllQuery(entity);
      queryText += generateSearchQuery(entity);
      mutationText += generateMutation(entity);
    }
  }
  return queryText + "\n}\n\n" + mutationText + "\n}\n\n";
}

function generateMutation(entity) {
  let entityMutation =
    "Update" +
    entity.name.value +
    "(input: " +
    entity.name.value +
    "Input!): Boolean \n";
  return entityMutation;
}

function generateGetQuery(entity) {
  let entitiyGetQueryString =
    entity.name.value +
    "(id: ID!, prove: Boolean): " +
    entity.name.value +
    "!\n";
  return entitiyGetQueryString;
}

// function generateGraphQuery(entity) {
//   let entitiyGraphQueryString = entity.name.value + "s(first: Int, last: Int, limit: Int, prove: Boolean): ["  + entity.name.value  + "]!\n"
//   return entitiyGetAllQueryString
// }

function generateGetAllQuery(entity) {
  let entitiyGetAllQueryString =
    entity.name.value +
    "s(where: String, order_by: String, asc: Boolean, first: Int, last: Int, limit: Int, prove: Boolean): [" +
    entity.name.value +
    "]!\n";
  return entitiyGetAllQueryString;
}

function generateSearchQuery(entity) {
  let entitySearchQueryString =
    entity.name.value +
    "Search(queryText: String!, prove: Boolean): [" +
    entity.name.value +
    "]!\n";
  return entitySearchQueryString;
}

function generateTestMutation(entityName, entityText) {
  let entityMutation = "mutation {update" + entityName + "(input: $input)}\n";
  return entityMutation;
}

function generateTestGetQuery(entityName, entityText) {
  let entityGetQueryString =
    "query { " +
    entityName +
    "(id: $id, prove: $prove) {" +
    entityText +
    "}}\n";
  return entityGetQueryString;
}

function generateTestGetAllQuery(entityName, entityText) {
  let entityGetAllQueryString =
    "query { " +
    entityName +
    "s(where: $whereText, order_by: $order_by, asc: $asc, first: $first, last: $last, limit: $limit, prove: $prove) {" +
    entityText +
    "}}";
  return entityGetAllQueryString;
}

function generateTestSearchQuery(entityName, entityText) {
  let entitySearchQueryString =
    "query {" +
    entityName +
    "Search(queryText: $queryText, prove: $prove) {" +
    entityText +
    "  }}";
  return entitySearchQueryString;
}

function generateTestQueryText(entities) {
  let app = {};
  for (const entity of entities) {
    let entityText = "id";
    let entityName = entity.name.value;
    //console.log(entityName)
    if (
      entity.kind == "ObjectTypeDefinition" &&
      entity.kind != "Query" &&
      entity.kind != "Mutation" &&
      entity.name.value != "Query" &&
      entity.name.value != "Mutation" &&
      entity.name.value != "Proof"
    ) {
      app[entityName + "s"] = {
        get: generateTestGetQuery(entityName, entityText),
        getAll: generateTestGetAllQuery(entityName, entityText),
        search: generateTestSearchQuery(entityName, entityText),
        put: generateTestMutation(entityName, entityText),
      };
    }
  }
  return JSON.stringify(app);
}

module.exports = {
  processSchema,
  createTestEntities,
  createTestQueries,
  getEntities,
  getEntityObjects,
};
