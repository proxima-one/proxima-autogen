'use strict'


const vertex = require('./proximaClientGenerator.js');


function generateProximaSDKVertexClient(config) {
  let vertexConfig = {}
  vertexConfig.name = config.name
  vertexConfig.schemaFile = config.schema.file
  vertex.generateVertexClient(vertexConfig)
}

module.exports = {generateProximaSDKVertexClient}
