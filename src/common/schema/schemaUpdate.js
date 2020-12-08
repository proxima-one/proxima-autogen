'use strict';

const { parse, visit, print } = require("graphql/language");



//function processEntity()

function processEntity(entity) {
  var returnedEntity;
  returnedEntity = ensureEntityIsCorrect(entity)
  entities[returnedEntity.name] = returnedEntity
  entityStrings[returnedEntity.name] = entityToGraphqlString(returnedEntity)
  mutations[returnedEntity.name] = entityMutations(returnedEntity)
  queries[returnedEntity.name] = entityQueries(returnedEntity)
  return {entity, input, queries}
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
  if (entity.proof != "Proof") {
    entity.proof = "Proof"
  }
  return entity
}

function ensureEntityIsOptimized(entity) {
  return entity
}

function generateMutation(entity) {
  let entityMutation = "put" + entity.name + "(input: " entity.name + "Input!)\n"
  return entityMutation
}

function entityInputs(entity) {
  let input = "input " + entity.name + "Input {\n"
  for (const [key, value] of Object.entries(entity.value)) {
    input += key + ": " + value + "\n"
  }
  return input + "}\n\n"
}

function generateGetQuery(entity) {
  let entitiyGetQueryString = entity.name + "(id: ID!): "  + entity.name  + "!\n"
  return entitiyGetQueryString
}

function generateGetAllQuery(entity) {
  let entitiyGetAllQueryString = entity.name + "s(first: Int, last: Int, limit: Int): ["  + entity.name  + "!]!\n"
  return entitiyGetAllQueryString
}

function generateSearchQuery(entity) {
  let entitiyGetAllQueryString = entity.name + "s(queryText: Text!): ["  + entity.name  + "!]!\n"
  return entitiySearchQueryString
}

module.exports = {processSchema}
