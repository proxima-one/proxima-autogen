var assert = require('assert')
//schema
//abi
//correct functions
//folder org
//app-config
//blockchain client fake
//handlers fake
//proxima vertex client fake

describe('Proxima Autogen', function() {
  describe('database gen', function() {
    //vars
    //db config
    //app config
    //folder org
    //schema

    //correct table and model creation given
    it('should have the correct file structure', function() {

      assert.equal(true, false);
    });
    //different models
    it('should create a table for each model', function() {
      assert.equal(true, false);
    });
    //should have the correct ordering and naming for the config
    it('should have the proper application config', function() {
      assert.equal(true, false);
    });
    //correct db init file
    it('should create the database init main file', function() {
      assert.equal(true, false);
    });
  });

  describe('blockchain client gen', function() {

    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //correct client package used
    it('should use the correct packages', function() {
      assert.equal(true, false);
    });
    //correct init and start-up
    it('should be able to be initialized', function() {
      assert.equal(true, false);
    });
  });

  describe('dapp aggregator gen', function() {

    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //finds the blockchain client (autogen) ? if not already there
    it('should have the blockchain client', function() {
      assert.equal(true, false);
    });
    //abi code import
    it('should import the abi code', function() {
      assert.equal(true, false);
    });
    //uses the interpreters for the smart contracts (autogen)
    it('should use interpreters for smart contracts', function() {
      assert.equal(true, false);
    });
    //creates function handlers for the smart contracts involved with name using abi file name
    it('should have the function handlers imported into the project', function() {
      assert.equal(true, false);
    });
    //contract creation files successfully
    it('should import/generate the proxima vertex client', function() {
      assert.equal(true, false);
    });
    //correctly adds
    it('should add the functions, listeners, and smart contracts', function() {
      assert.equal(true, false);
    });
    //creates the main file successfully (including imports of blockchain client, vertex client)
    it('should create the main server file for the DApp aggregator', function() {
      assert.equal(true, false);
    });
  });

  describe('data vertex gen', function() {

    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //resolvers in correct positioning
    it('should generate resolvers', function() {
      assert.equal(true, false);
    });
    //table db works
    it('should import the table database config', function() {
      assert.equal(true, false);
    });
    //main fn works
    it('should generate a correct main server function', function() {
      assert.equal(true, false);
    });
    //gqlgen works
    it('should correctly use gqlgen', function() {
      assert.equal(true, false);
    });
    //dockerfile builds
    it('should be able to build the correct docker container', function() {
      assert.equal(true, false);
    });
  });
  //////////////////////////////////////////////////////////////////////////////////////////////////

  describe('smart contract interpreter', function() {

    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //correctly gets abi files (multiple if necessary)
    it('should get abi smart contract files', function() {
      assert.equal(true, false);
    });
    //gets the name
    it('should ', function() {
      assert.equal(true, false);
    });
    //finds: all events and functions
    it('should get the events from the abi', function() {
      assert.equal(true, false);
    });
    //functions
    it('should get the functions from the abi', function() {
      assert.equal(true, false);
    });
    //returns handlers/information for these events and functions
    it('should return the handlers for the functions, and export', function() {
      assert.equal(true, false);
    });
  });


  describe('proxima vertex client gen', function() {

    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //creates main correctly
    it('should generate the main export file', function() {
      assert.equal(true, false);
    });
    //models done correctly
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //exports done correctly
    it('should export the vertex correctly', function() {
      assert.equal(true, false);
    });
    //generation from schema
    it('should generate functions and models from the given schema', function() {
      assert.equal(true, false);
    });
    //correct naming and functions
    it('should have the correct naming of functions and files', function() {
      assert.equal(true, false);
    });
    //initialized correctly
    it('should initialize correctly', function() {
      assert.equal(true, false);
    });
    //can make mutations, queries, get, get all for data vertex
    it('should make the mutations, queries for the data entities', function() {
      assert.equal(true, false);
    });
    //correct typing of vars
    it('should have the correct typing for the variables', function() {
      assert.equal(true, false);
    });
  });

  describe('schema processing', function() {

    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //inputs
    it('should generate input values from entities', function() {
      assert.equal(true, false);
    });
    //mutations
    it('should generate mutations from entities', function() {
      assert.equal(true, false);
    });
    //queries
    it('should generate correct queries from entities', function() {
      assert.equal(true, false);
    });
    //entity updates
    it('should update and check entities', function() {
      assert.equal(true, false);
    });
    //valid graphql
    it('should generate a valid graphql file', function() {
      assert.equal(true, false);
    });
  });
  });
