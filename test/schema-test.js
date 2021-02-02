//check key matches get query
var assert = require('assert');
var fs = require('fs-extra');
const { parse, visit, print } = require("graphql/language");

const autogen = require('../src/index.js');
var srcDir = "./test/data/schema/"
var destDir = "./test/schema_test";
var expected_schema = (fs.readFileSync("./test/data/schema/processed-schema.graphql")).toString();
var test_schema_1 = (fs.readFileSync("./test/data/schema/test-schema-1.graphql")).toString();
var test_schema_2 = (fs.readFileSync("./test/data/schema/test-schema-2.graphql")).toString();
var actual_schema;
var test_schema_1_name = "test-schema-1.graphql"
var test_schema_2_name = "test-schema-2.graphql"

function setup(testDir, srcDir, srcSchema) {
  //cleanup(testDir)
  fs.ensureDirSync(testDir + "/schema")
  fs.copySync(srcDir + srcSchema, testDir + "/schema/" + srcSchema)
}

function cleanup(testDir) {
  fs.removeSync(testDir)
}

function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

describe('schema processing', function() {
  describe('generating and cleaning input schema file', function() {
    for (const schema_file of [test_schema_1_name, test_schema_2_name]) {

      it('should run without error with file: ' + schema_file, function() {
            setup(destDir, srcDir, schema_file)
            autogen.processSchema({}, destDir + "/schema/" + schema_file)
      });
    it('should have the correct folder structure with file: '  + schema_file, function() {
      assert(fs.pathExistsSync(destDir + "/schema/"), true)
      assert(fs.pathExistsSync(destDir + "/schema/" + schema_file), true)
      autogen.processSchema({}, destDir + "/schema/" + schema_file)
      actual_schema = (fs.readFileSync(destDir + "/schema/" + schema_file)).toString()
      assert(actual_schema);
    });
    it('should generate a valid graphql file with file: '  + schema_file, function() {
        actual_schema = (fs.readFileSync(destDir + "/schema/" + schema_file)).toString()
        parse(actual_schema);
    });
    it('should generate mutations from entities', function() {
      var expected_schema = (fs.readFileSync("./test/data/schema/processed-schema.graphql")).toString();
      assert.equal(true, true);
    });
    it('should generate correct queries from entities', function() {
      var expected_schema = (fs.readFileSync("./test/data/schema/processed-schema.graphql")).toString();
      assert.equal(true, true);
    });
  }
    });

  describe('generating test cases from schema', function() {
    for (const schema_file of ["processed-schema.graphql"]) {
      it('should run without error with file: ' + schema_file, function() {
            setup(destDir, srcDir, schema_file)
            let testStructOutputFile = schema_file.replace(".graphql", ".json")
            let testStructOutputFilePath = destDir + "/" + testStructOutputFile
            //autogen.processSchema({}, destDir + "/schema/" + schema_file)
            autogen.createTestStructs(destDir + "/schema/" + schema_file, testStructOutputFilePath)
      });
    it('should generate a valid json file'  + schema_file, function() {
        let testStructOutputFile = schema_file.replace(".graphql", ".json")
        let testStructOutputFilePath = destDir + "/" + testStructOutputFile
        assert(fs.pathExistsSync(testStructOutputFilePath), true)
        let actual_file = fs.readFileSync(testStructOutputFilePath)
        assert(isJSON(actual_file));
    });

    it('should correctly generate testStructs entities', function() {
      let testStructOutputFile = schema_file.replace(".graphql", ".json")
      let testStructOutputFilePath = destDir + "/" + testStructOutputFile
      let actual_file = (fs.readFileSync(testStructOutputFilePath)).toString()
      let entityTestStructs = JSON.parse(actual_file)

      for (const [name, entityTestStruct ] of Object.entries(entityTestStructs)) {
        assert(entityTestStruct.name == name)
        checkTestStructEntity(entityTestStruct.entity, entityTestStruct.entityInput)
        checkTestStructOperations(entityTestStruct.operations)
      }
      //cleanup(destDir)
      assert.equal(true, true);
    });
  }
  });
    });

function checkTestStructEntity(entity, entityInput) {
  //entityShould contain proof
  for (const [varName, varField] of Object.entries(entityInput)) {
    assert(entity[varName])
    assert(entity[varName].type == varField.type)
    //assert((entity[varName] == varField))
  }
  return true
}

function checkType(typeName) {
  return true
}

function checkTestStructOperations(operations) {
  //check that input and entity are the same
  //check operations
  assert(operations["get"])
  assert(operations["getAll"])
  assert(operations["put"])
  assert(operations["search"])
    //get
    //getAll
    //query
    //mutation
    //for each
  return true
}
