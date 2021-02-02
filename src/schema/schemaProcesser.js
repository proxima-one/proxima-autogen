'use strict';

const { parse, visit, print } = require("graphql/language");
const fs = require("fs-extra")

function processSchema(schemaFile) {
  let schema = (fs.readFileSync(schemaFile)).toString()
  let entities = parseSchema(schema)
  entities = checkEntities(entities)   //
  let entityDict = makeDict(entities)
  let entityText = generateEntitiesText(entities, entityDict) //check entities
  let queryText = generateQueryText(entities, entityDict)
  let schemaText = queryText + entityText
  fs.writeFileSync(schemaFile, schemaText)
}

function createTestStructs(inputSchemaFile, outputJSONFile) {
  let schema = (fs.readFileSync(inputSchemaFile)).toString()
  let entities = parseSchema(schema)
  entities = checkEntities(entities)
  let entityTestStructs = generateEntityTestStructs(entities)
  let outputText = json.stringify(entityTestStructs)
  fs.writeFileSync(outputJSONFile, outputText)
}

function getEntityName(entity) {
  //generate type, switch case for what to do
  return "type"
}

function getEntityType(entity) {

  return "type"
}

function generateEntityTestStructs(entities) {
  var entityTestStruct;
  var name;
  var entityTestStructs = {}

  for _, entity of entities {
    let entityType = getEntityType(entity)
    if (entityType == "mutation" || entityType == "query") {
      continue
    }
    let name = getEntityName(entity)
    if (!entityTestStructs[name]) {
      entityTestStructs[name] = {name: name, operations: generateOperations(entity, entityType, entityTestStructs) }
    }
    let entityTestStruct = entityTestStructs[name]
    entityTestStruct[entityType] = generateEntityTestStruct(entity)
    entityTestStructs[name] = entity
  }
  return entityTestStructs
}

function generateEntityTestStruct(entity) {
  var variableName;
  var variableType;
  var isRequired;

  vars = {}

for (const field of entity.fields) {
    //if it is a list, it goes empty
    variableName = field.name.value;
    variableType = field.name.value;
    required = 
    //if it is ID, it goes to string
    //otherwise use the type with a string
    vars[variableName] = {name: variableName, type: variableType, required: isRequired}

  }
  return vars
}

function generateOperations(entities) {

}

//generate operations

function generateEntitiesText(entities, entityDict = {}) {
  let entityText = ""
  for (const entity of entities) {
      if (entity.kind == 'ObjectTypeDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
      entityText += generateEntityText(entity, entityDict) + "\n"
      entityText += generateEntityInputText(entity, entityDict) + "\n"
      }
      if (entity.kind == 'ObjectInputDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
        entityText += generateEntityInputText(entity, entities) + "\n"
      }
  }
  return entityText
}

function makeDict(entities) {
  let entityDict = {}
  for (const entity of entities) {
    entityDict[entity.name.value] = entity
  }
  return entityDict
}

function readSchema(fileName) {
  let schema = fs.readFile(fileName)
  return schema
}

function parseSchema(schema) {
  return parse(schema).definitions
}

function checkEntities(entities) {
  for (const entity of entities) {
    checkEntity(entity)
  }
  return entities
}

function checkEntity(entity) {
  //if not input
  let newEntity = ensureEntityIsCorrect(entity)
  return ensureEntityIsOptimized(newEntity)
}

function ensureEntityIsCorrect(entity) {
  if (!entity) {
    entity = {}
  }
  if (!entity.id) {
    entity.id = "ID!"
  }
  if (entity.proof != "String") {
    entity.proof = "String"
  }
  return entity
}

function ensureEntityIsOptimized(entity) {
  return entity
}

function generateEntitiesText(entities, entityDict = {}) {
  let entityText = ""
  for (const entity of entities) {
      if (entity.kind == 'ObjectTypeDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
      entityText += generateEntityText(entity, entityDict) + "\n"
      entityText += generateEntityInputText(entity, entityDict) + "\n"
      }
      if (entity.kind == 'ObjectInputDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
        entityText += generateEntityInputText(entity, entities) + "\n"
      }
  }
  return entityText
}

function generateEntityText(entity, entityDict = {}) {
  let entityText = "type " + entity.name.value  + " {\n"
  //field.kind == 'NonNullableType'
  //List Type  [], then get the name of the
  for (const field of entity.fields) {
    entityText += processFieldDefinition(field, entityDict) + "\n"
  }
  return entityText + "} \n"
}

function processFieldDefinition(field, entityDict = {}, inputText = "") {
  let fieldText = field.name.value +  ": "
  let endText = ""
  field = field.type
  while (field.kind && field.kind != "NamedType") {
    if (field.kind == "NonNullableType") {
      endText = "!" + endText
    }
    if (field.kind == "ListType") {
      fieldText += "["
      endText = "]" + endText
    }
    field = field.type
  }
  let name = field.name.value
  if (entityDict[name]) {
    name = name + inputText
  }
  return fieldText +  name + endText
}

function generateEntityInputText(entity, entityDict = {}) {
  //console.log(entity)
  let inputText = "input " + entity.name.value + "Input {\n"
  for (const field of entity.fields) {
    inputText += processFieldDefinition(field, entityDict, "Input") + "\n"
  }
  return inputText + "}\n"
}

function generateQueryText(entities) {
  let queryText = "type Query {\n"
  let mutationText = "type Mutation {\n"
  for (const entity of entities) {
    if (entity.kind == 'ObjectTypeDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
      queryText += generateGetQuery(entity)
      queryText += generateGetAllQuery(entity)
      queryText += generateSearchQuery(entity)
      mutationText += generateMutation(entity)
    }
  }
  return queryText + "\n}\n\n" + mutationText + "\n}\n\n"
}

function generateMutation(entity) {
  let entityMutation = "put" + entity.name.value + "(input: " + entity.name.value + "Input!): Boolean \n"
  return entityMutation
}

function generateGetQuery(entity) {
  let entitiyGetQueryString = entity.name.value + "(id: ID!, prove: Boolean): "  + entity.name.value  + "!\n"
  return entitiyGetQueryString
}

function generateGetAllQuery(entity) {
  let entitiyGetAllQueryString = entity.name.value + "s(first: Int, last: Int, limit: Int, prove: Boolean): ["  + entity.name.value  + "!]!\n"
  return entitiyGetAllQueryString
}

function generateSearchQuery(entity) {
  let entitySearchQueryString = entity.name.value + "Search(queryText: String!, prove: Boolean): ["  + entity.name.value  + "!]!\n"
  return entitySearchQueryString
}

module.exports = {processSchema}
