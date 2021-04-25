import {useFetch} from "../../lib/DataVertexClient";
//import { TypedDocumentNode } from "@graphql-typed-document-node/core";
####
$EntityNameInput = {
  __typename?: "$EntityNameInput";
####
export function to$EntityNameInput(obj: $EntityName): $EntityNameInput {
  let objInput: $EntityNameInput = {
    __typename: "$EntityNameInput",
    id: obj.id,
    $FNBODY,
  };
  return objInput;
}
####
export function to$EntityName(objInput: $EntityNameInput): $EntityName {
  let obj: $EntityName = new $EntityName();
  obj.__typename = "$EntityName";
  obj.id = objInput.id;
  $FNBODY;
  return obj;
}
####
  constructor(id?: string) {
    this.__typename = "$EntityName";
    if (id) {
      this.id = id
    }
  }
  static load(id: string, prove: boolean = false): Maybe<$EntityName> {
    var operationDocument = $EntityNameDocument
    const loadVariables = {id: id, prove: prove}
    var result = gqlFetch(operationDocument, loadVariables)
    if (result && result.data != undefined && result.data.$EntityName != undefined) {
      let value = result.data.$EntityName
      return to$EntityName(value);
    }
    return null
  }
  save(): void {
    var operationDocument = Update$EntityNameDocument;
    var saveVariables = { input: this._getSaveArgs() };
    gqlFetch(operationDocument, saveVariables);
  }
  _getSaveArgs(): $EntityNameInput {
    return to$EntityNameInput(this);
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
