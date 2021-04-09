//generate the entities

//graphql for the document node
"use strict";

const { parse, visit, print } = require("graphql/language");
const fs = require("fs-extra");
const schemaDocumentTemplatePath = require.resolve("./docTemplates.graphql");

function generateEntityGQLDocuments(schemaFile, outputFile = "") {
  let schema = fs.readFileSync(schemaFile).toString();
  let entities = parseSchema(schema);
  entities = checkEntities(entities); //
  let entityDict = makeDict(entities);

  let schemaText = generateDocuments(entities, entityDict);

  if (outputFile == "") {
    outputFile = schemaFile.replace(".graphql", "-operations.graphql");
  }

  fs.outputFileSync(outputFile, schemaText);
}

function getEntities(config) {
  //console.log("Entity config for schema.file");
  //console.log(config);
  let schemaFile = config.schema.file;
  let schema = fs.readFileSync(schemaFile).toString();
  let entities = parseSchema(schema);
  entities = checkEntities(entities);
  let entitiesDict = makeDict(entities);
  return entitiesDict;
}

function generateDocuments(entities, entitiesDict = {}) {
  let docText = "";
  let deep = false;
  for (const [name, entity] of Object.entries(entities)) {
    let name = entity.name.value;
    if (isEntity(name, entity)) {
      docText += generateDocument(name, entity, entitiesDict, deep);
    }
  }
  return docText;
}

function isEntity(name, entity) {
  if (
    name == "Proof" ||
    name == "Mutation" ||
    name == "Query" ||
    name == "Subscription"
  ) {
    return false;
  }

  let entityKind = entity.kind;
  if (entityKind != "ObjectTypeDefinition" || name.includes("Input")) {
    return false;
  }

  return true;
}

function generateDocument(name, entity, entitiesDict) {
  let docText = "";
  let schemaDocumentTemplates = fs
    .readFileSync(schemaDocumentTemplatePath)
    .toString()
    .split("####");
  let queryDocTemplate = schemaDocumentTemplates[0];
  let mutationDocTemplate = schemaDocumentTemplates[1];
  let entityName = name;
  let varId = "id";
  let varInput = "input";
  let body = generateDocumentBody(name, entity, entitiesDict);
  //query  gen
  let queryDoc = queryDocTemplate
    .split("$varName")
    .join(varId)
    .split("$body")
    .join(body)
    .split("$name")
    .join(entityName);

  let mutationDoc = mutationDocTemplate
    .split("$varName")
    .join(varInput)
    .split("$name")
    .join(entityName);
  docText = queryDoc + "\n\n" + mutationDoc;
  return docText;
}

function generateDocumentBody(name, entity, entityDict = {}, deep = false) {
  let docBody = "";
  let entityStruct = generateEntityModelStruct(entity);
  for (const [varName, varInfo] of Object.entries(entityStruct)) {
    if (varInfo.isRequired || !(varInfo.type in entityDict)) {
      docBody += "  " + varName + "\n";
    }
    if (varInfo.type in entityDict && varName != "prove" && deep) {
      docBody += "  " + varName + " {\n";
      docBody +=
        "  " +
        generateDocumentBody(
          varInfo.type,
          entityDict[varInfo.type],
          entityDict,
          (deep = false)
        );
      docBody += "\n   }\n";
    }
  }
  return docBody;
}

function generateEntityModelStruct(entity) {
  var variableName;
  let vars = {};
  if (entity && entity.fields) {
    for (const field of entity.fields) {
      variableName = field.name.value;
      let isList,
        isRequired,
        variableType = processJSONFieldDefinition(field);
      vars[variableName] = {
        name: variableName,
        type: variableType,
        isList: isList,
        required: isRequired
      };
    }
  }
  return vars;
}

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

function makeDict(entities) {
  let entityDict = {};
  for (const entity of entities) {
    entityDict[entity.name.value] = entity;
  }
  return entityDict;
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

// function generateGraphQuery(entity) {
//   let entitiyGraphQueryString = entity.name.value + "s(first: Int, last: Int, limit: Int, prove: Boolean): ["  + entity.name.value  + "]!\n"
//   return entitiyGetAllQueryString

// function generateTestGetAllQuery(entityName, entityText) {
//   let entityGetAllQueryString =
//     "query { " +
//     entityName +
//     "s(where: $whereText, order_by: $order_by, asc: $asc, first: $first, last: $last, limit: $limit, prove: $prove) {" +
//     entityText +
//     "}}";
//   return entityGetAllQueryString;
// }

// function generateTestSearchQuery(entityName, entityText) {
//   let entitySearchQueryString =
//     "query {" +
//     entityName +
//     "Search(queryText: $queryText, prove: $prove) {" +
//     entityText +
//     "  }}";
//   return entitySearchQueryString;
// }

module.exports = {
  generateEntityGQLDocuments
};
