'use strict'
const {generateApplicationDatabase} = require("./database/index.js");
const {processSchema, createTestStructs} = require("./schema/index.js");
const {buildDataAggregator, generateHandlers} = require("./dapp-aggregator/index.js");
const {generateBlockchainClient} = require("./blockchain-client/index.js");
const {generateProximaSDKVertexClient} = require("./proxima-sdk-vertex-client/index.js")
const {buildDataVertex} = require("./data-vertex-node/index.js");

module.exports = {
  generateApplicationDatabase,
  buildDataVertex,
  generateBlockchainClient,
  generateProximaSDKVertexClient,
  processSchema,
  createTestStructs,
  buildDataAggregator,
  generateHandlers
}
