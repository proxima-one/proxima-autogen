"use strict";
var fs = require("fs-extra");
const _ = require("lodash");

const proofResolverFileTemplatePath = require.resolve("./proofResolvers.go");

let str = "#####";

const resolverFnTemplatePath = require.resolve(
  "./resolverFunctionTemplates.go"
);

function buildResolvers(fileIn, fileOut, dataloaders = {}) {
  let resolverText = fs.readFileSync(fileIn).toString();

  let { head, resolverFns, resolverTypes } = parseFunctions(resolverText);
  let newResolverText = "package resolvers\n\n";
  newResolverText += "import ( \n";
  newResolverText +=
    'dataloader "github.com/proxima-one/proxima-data-vertex/pkg/dataloaders"\n';
  newResolverText +=
    'models "github.com/proxima-one/proxima-data-vertex/pkg/models"\n';
  newResolverText += 'json "github.com/json-iterator/go"\n';

  newResolverText +=
    'proximaIterables "github.com/proxima-one/proxima-db-client-go/pkg/iterables"\n';
  newResolverText += 'graphql "github.com/99designs/gqlgen/graphql"\n';

  //json encoding, prettify
  newResolverText += '"context"\n';
  newResolverText += ")\n\n";
  for (const functionText of resolverFns) {
    //filter
    if (functionText && functionText.includes("ctx context.Context,")) {
      let newFunctionText =
        createResolverFunction(functionText, dataloaders) + "\n";
      //console.log(newFunctionText)
      newResolverText += newFunctionText;
    }
  }
  let mainFile = fileOut.replace("_fns", "");
  updateResolverMain(mainFile, resolverTypes);

  //let mainFile = fileOut.replace("_fns", "");
  proofResolvers(
    proofResolverFileTemplatePath,
    mainFile.replace(".go", "_proof.go")
  );
  fs.outputFileSync(fileOut, newResolverText);
  fs.removeSync(fileIn);
}

function proofResolvers(resolverFileIn, resolverFileOut) {
  fs.copyFileSync(resolverFileIn, resolverFileOut);
}

function updateResolverMain(mainFile, resolverTypes) {
  let resolverMainText = fs.readFileSync(mainFile).toString();
  let resolverTypePlaceholderText = "//AUTOGEN RESOLVERS";
  let resolverTypeText = resolverTypes
    .join("")
    .replace("type mutationResolver", "//type mutationResolver")
    .replace("type queryResolver", "//type queryResolver");

  let resolverTypeFnText = "";
  for (var resolverType of resolverTypes) {
    //console.log(resolverType);
    let entityName = resolverType
      .split("Resolver")[0]
      .replace("type ", "")
      .split("\n")
      .join("");
    let upperName = _.upperFirst(entityName);
    if (upperName == "Mutation" || upperName == "Query") {
      continue;
    }
    let resolverTypeFn = "func (r *Resolver) $UpperEntityName() gql.$UpperEntityNameResolver {"
      .split("$UpperEntityName")
      .join(upperName);
    let lowerName = _.lowerFirst(entityName);
    resolverTypeFn += "return &$LowerEntityNameResolver{r}}\n".replace(
      "$LowerEntityName",
      lowerName
    );
    resolverTypeFnText += resolverTypeFn;
  }

  resolverTypeText += "\n" + resolverTypeFnText;
  resolverMainText = resolverMainText.replace(
    resolverTypePlaceholderText,
    resolverTypeText
  );

  fs.outputFileSync(mainFile, resolverMainText);
}

//fn names to entities
function parseFunctions(resolverText) {
  //resolver fns
  let resolvers = resolverText
    .split("func (r ")
    .join("%%%func (r ")
    .split("%%%");
  let head = resolvers[0];
  let resolverFns = resolvers.slice(1, resolvers.length - 2);
  let tail = resolvers[resolvers.length - 1]
    .split("\ntype ")
    .join("%%%\ntype ")
    .split("%%%");
  //console.log(tail);
  //entity resolvers
  resolverFns.push(tail[0]);
  let resolverTypes = tail.slice(1);
  return { head, resolverFns, resolverTypes };
}

function isEntityResolver(functionText) {
  let isMutation = functionText.includes("*mutationResolver");
  let isQuery = functionText.includes("*queryResolver");
  return !(isMutation || isQuery);
}

//dataloader fns, determine if is list
function createEntityResolverFunction(functionText, dataloaders = {}) {
  let loaderName = getDataloaderName(functionText);
  let dataloader = dataloaders[loaderName];
  let entityName = dataloader.entityName;
  let inputs = dataloader.objInput;
  //get templates

  if (functionText.includes("[]*models.")) {
    inputs += "s";
    //template  here
    let body = getResolverFnTemplates().entityResolverFn;
    body = body
      .split("$loaderName")
      .join(loaderName)
      .split("$input")
      .join(inputs)
      .split("$OutputEntity")
      .join(entityName);
    //body += "return entities, nil";
    return functionText.replace('panic(fmt.Errorf("not implemented"))', body);
  } else {
    let body =
      "result, err := dataloader.For(ctx).$loaderName.LoadThunk(obj.$input)()\n";
    body += "if err != nil { return nil, err}\n";
    body += "return result, nil";
    body = body
      .split("$loaderName")
      .join(loaderName)
      .split("$input")
      .join(inputs)
      .split("$OutputEntity")
      .join(entityName);
    return functionText.replace('panic(fmt.Errorf("not implemented"))', body);
  }
}

function getResolverFnTemplates() {
  let str = "####";
  let resolverTemplates = fs
    .readFileSync(resolverFnTemplatePath)
    .toString()
    .split(str);

  return {
    entityResolverFn: resolverTemplates[0],
    searchFnResolver: resolverTemplates[1],
    getAllFnResolver: resolverTemplates[1],
    getFnResolver: resolverTemplates[2],
    queryFnResolver: resolverTemplates[3],
    mutationFnResolver: resolverTemplates[4],
  };
}

function getDataloaderName(entityResolverFnText) {
  //"(ctx", indexOf
  //"Resolver)", indexOf
  let tableName = getTableName(entityResolverFnText);
  let name = tableName.substr(0, tableName.length - 1);
  let dataloaderName = name + "ById";

  return dataloaderName;
}
//loaderName

//inputs ([]string or string) is ends with an s

function createResolverFunction(functionText, dataloaders = {}) {
  //filter the function
  if (isEntityResolver(functionText)) {
    return createEntityResolverFunction(functionText, dataloaders);
  }
  let { type, isQuery } = getType(functionText);
  let body = ""; //generateDefaultInputText(functionText);
  body += generateResolverBodyText(functionText);

  body = functionText.replace('panic(fmt.Errorf("not implemented"))', body);
  return body;
}

function generateDefaultInputText(functionText) {
  let defaults = "args := DefaultInputs;\n";
  let defaultProofInput = 'if prove != nil { args["prove"] = *prove }\n';
  let defaultLimit =
    'if limit != nil {args["limit"] = *limit}\n' +
    'if first != nil {args["first"] = *first}\n' +
    'if last != nil {args["last"] = *last}\n';
  let { type, isQuery } = getType(functionText);
  let defaultText = defaults;
  switch (type) {
    case "get":
      defaultText += defaultProofInput;
      defaultText += 'args["id"] = id\n';
      break;
    case "query":
      defaultText += defaultProofInput;
      //defaultText += defaultLimit
      //defaultText += "args[\"query\"] = query\n"
      break;
    case "getAll":
      defaultText += defaultProofInput;
      //default query
      //proof
      defaultText += defaultLimit;
      break;
  }
  return defaultText;
}

function generateValueUnmarshallingText(tableName, dataName) {
  let proofStr =
    "var val models." +
    tableName.substr(0, tableName.length - 1) +
    ";\n" +
    "json.Unmarshal(" +
    dataName +
    ".GetValue(), &val)\n" +
    "val.Proof, _ = GenerateProof(data.GetProof())\n";
  return proofStr;
}

function generateResolverBodyText(functionString) {
  let body = "";
  let functionHead = functionString;
  var output;
  let { type, isQuery } = getType(functionString);
  //console.log(type)

  let tableName = getTableName(functionString);
  let entityName = tableName.substring(0, tableName.length - 1);

  //let  = functionString.includes("*queryResolver")
  // Resolver)
  // // (ctx context.Context,
  // body += 'table, _ := r.db.GetTable("' + tableName + '")\n';
  // let returnV = "return &value, nil\n";
  switch (type) {
    case "get":
      body = getResolverFnTemplates().getFnResolver;
      break;
    case "mutation":
      body = getResolverFnTemplates().mutationFnResolver;
      break;
    case "getAll":
      body = getResolverFnTemplates().getAllFnResolver;
      break;
    case "query":
      body = getResolverFnTemplates().queryFnResolver;
      break;
  }
  // if (isQuery) {
  //   body += "if err != nil {\n" + "  return nil, err\n" + "}\n";
  // }

  return body.split("$EntityName").join(entityName);
  //output = getOutput(type, tableName, functionString);
  // body += "data := result.GetValue();\n";
  // body += generateValueUnmarshallingText(tableName, "data") + "\n";
  //body += "var value " + output + ";\n" + "json.Unmarshal(data, &value)\n";
  //return body + returnV;
}

function getOutput(type, tableName, functionString) {
  let outputStr = "models." + tableName.substr(0, tableName.length - 1);
  let returnType = "";
  if (type == "getAll" || type == "query") {
    return "[]*" + outputStr;
  } else {
    return outputStr;
  }
}

function getType(head) {
  var isQuery = false;
  var type = "mutation";
  if (!head.includes("*queryResolver")) {
    return { type, isQuery };
  }
  isQuery = true;
  if (head.includes("Search(")) {
    type = "query";
    return { type, isQuery };
  }
  if (head.includes("[]*models.")) {
    //
    type = "getAll";
    return { type, isQuery };
  }
  type = "get";
  return { type, isQuery };
}

function getTableName(head) {
  let tempList = head.split(" ").join("").split("models.");
  let tableName = tempList[tempList.length - 1].split(")")[0];
  tableName = tableName.replace(",error", "").replace("Input", "");
  tableName += "s";
  return tableName;
}

//name and tail end (either pushing/unmarshalling from input, the other is to unmarshall response)

module.exports = { buildResolvers };
