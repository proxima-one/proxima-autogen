"use strict";
var fs = require("fs-extra");
const { parse, visit, print } = require("graphql/language");

async function updateGoModels(config, modelsFile) {
  let schema = fs.readFileSync(config.schema.file).toString();
  let modelText = fs.readFileSync(modelsFile).toString();

  let entities = parseSchema(schema);
  entities = checkEntities(entities);
  let entityDict = makeDict(entities);
  let entityModelStructs = generateEntityModelStructs(entities, entityDict);

  let newModelText = modelText;

  let proofStr = "*Proof";
  let newProofStr = "*Proof//";

  //
  //console.log(entities);
  //console.log(entityDict);
  //console.log(entityModelStructs);

  for (const [name, entityModelText] of Object.entries(entityModelStructs)) {
    //find struct name
    //let varFieldName = entity.name.value;
    let entityStr = "*" + name + "  ";
    let newEntityStr = "*" + name + "//";
    //console.log()
    let entity = entityDict[name];
    let oldStr = "type " + name + " struct {";
    //var regexStr = new RegExp(oldStr, "i");
    let newStr = oldStr + "\n" + entityModelText;
    //console.log(entity);
    //console.log(newStr);
    newModelText = newModelText.replace(oldStr, newStr);
    newModelText = newModelText.split(entityStr).join(newEntityStr);
  }

  newModelText = newModelText.split(proofStr).join(newProofStr);
  newModelText = addOmitEmptyJSON(newModelText.toString());
  //console.log(newModelText.toString());
  fs.outputFileSync(modelsFile, newModelText.toString()); //write the file
}

function generateEntityModelStructs(entities, entityDict = {}) {
  let entityModelStructs = {};

  for (const [name, entity] of Object.entries(entityDict)) {
    if (isEntity(name, entity)) {
      entityModelStructs[name] = generateEntityModelStruct(entity, entityDict);
    }
  }
  //console.log(entityModelStructs);
  return entityModelStructs;
}

function addOmitEmptyJSON(strings) {
  newContents = strings.Replace(newContents, '"`', ',omitempty"`', -1);
  return newContents;
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
  if (entityKind != "ObjectTypeDefinition") {
    return false;
  }

  return true;
}

//replace with proof, not being encoded in json

function generateEntityModelStruct(entity, entityDict = {}) {
  let structText = "";
  if (entity.fields) {
    for (const field of entity.fields) {
      let variableName = field.name.value;
      let isList,
        isRequired,
        variableType = processJSONFieldDefinition(field);

      if (variableType in entityDict) {
        structText += generateJSONLine(
          variableName,
          variableType,
          isList,
          isRequired,
          field
        );
      }
    }
  }
  return structText;
}

function generateJSONLine(name, varType, isList, isRequired, field = {}) {
  let listStr = "";
  let typStr = "string"; //[], or string
  //check list

  if (
    (field.kind && field.type.kind == "ListType") ||
    name.charAt(name.length - 1) == "s"
  ) {
    isList = true;
  }
  name = varType;
  if (isList) {
    listStr = "s";
    typStr = "[]" + typStr;
  }
  let nameLower = name.charAt(0).toLowerCase() + name.slice(1);
  let nameUpper = name.charAt(0).toUpperCase() + name.slice(1) + "ID" + listStr; //add on ids
  let jsonStr = '`json:"' + nameLower + "Id" + listStr + '"`'; //this is lowercase name + id/ids
  let returnV = "  " + nameUpper + `    ` + typStr + `    ` + jsonStr + "\n";
  //console.log(field);
  //console.log(returnV);
  return returnV;
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

function parseSchema(schema) {
  //console.log(schema);
  //, filter kind: 'DirectiveDefinition', //filter, and proof
  //kind: 'InputObjectTypeDefinition',
  //Query, Mutation
  return parse(schema).definitions;
}

function makeDict(entities) {
  let entityDict = {};
  for (const entity of entities) {
    if (isEntity(entity.name.value, entity)) {
      entityDict[entity.name.value] = entity;
    }
  }
  return entityDict;
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
  if (!entity.proof || entity.proof != "String") {
    entity.proof = "Proof";
  }
  return entity;
}

//json omitempty
//

function ensureEntityIsOptimized(entity) {
  //directives
  return entity;
}

function readSchema(fileName) {
  let schema = fs.readFileSync(fileName).toString();
  return schema;
}

module.exports = { updateGoModels };
