import {useFetch} from "../../lib/DataVertexClient";
//import { TypedDocumentNode } from "@graphql-typed-document-node/core";
####
  constructor(id?: string) {
    if (id) {
      this.id = id
    }
  }
  static load(id: string, prove: boolean = false): Maybe<$EntityName> {
    var operationDocument = $EntityNameDocument
    const loadVariables = {id: id, prove: prove}
    var result = gqlFetch(operationDocument, loadVariables)
    if (result && result.data && result.data.$EntityName.__typename == "$EntityName") {
      return result.data.$EntityName as $EntityName;
    }
    return null
  }
  save(): void {
    var operationDocument = Update$EntityNameDocument;
    var saveVariables = {input: this._getSaveArgs()};
    gqlFetch(operationDocument, saveVariables)
    }

  _getSaveArgs(): $EntityNameInput { //input
      let saveArgs: $EntityNameInput = {}

      for (const [name, value] of Object.entries(this)) {
        let hasField = saveArgs.hasOwnProperty(name);
        let fieldIdName = lowercaseFirstLetter(name.replace("Id", ""));
        let hasFieldId = saveArgs.hasOwnProperty(name);

        if (!hasFieldId && !hasField) {
          continue;
        }
        let isList = value instanceof Array;
        if (hasFieldId && isList && value instanceof Array &&
        saveArgs.hasOwnProperty(fieldIdName)) {
          let valueIds: Array<any> = [];
          (value as Array<{ [x: string]: any; }>).map((v: { [x: string]: any; })  => {
            if ("id" in v) {
              valueIds.push(v["id"]);
            }});
            saveArgs[fieldIdName as keyof $EntityNameInput] = valueIds as any
        } else if (hasFieldId && !isList && value.hasOwnProperty("id") &&
        saveArgs.hasOwnProperty(fieldIdName)) {
          saveArgs[fieldIdName as keyof $EntityNameInput] = value.id;
        } else {
          saveArgs[name as keyof $EntityNameInput] = value;
        }
      }
      return saveArgs;
    }
####
type GqlFetchResult<TData = any> = {
  data?: TData;
  errors?: Error[];
};
function gqlFetch<TData = any, TVariables = Record<string, any>>(
  operation: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
): GqlFetchResult<TData>;
function gqlFetch<TData = any, TVariables = Record<string, any>>(
  operation: DocumentNode,
  variables?: TVariables
): GqlFetchResult<TData> {
  //return useGQLFetch(operation, variables);
  return useFetch<TData, TVariables>(operation, variables);
}
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // Inferred type is T[K]
}
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
  obj[key] = value;
}
function lowercaseFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
