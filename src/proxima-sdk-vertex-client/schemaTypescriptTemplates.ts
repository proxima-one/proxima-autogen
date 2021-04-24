import {useFetch} from "../../lib/DataVertexClient";
//import { TypedDocumentNode } from "@graphql-typed-document-node/core";
####
export type $EntityNameInput = {
  __typename?: "$EntityNameInput";
####
export function toDPoolListInput(pool: DPoolList): DPoolListInput {
  let dpoolListInput: DPoolListInput = {
    __typename: "DPoolListInput",
    id: pool.id,
    numActiveUsers: parseInt(pool.numActiveUsers),
    numPools: parseInt(pool.numPools), //int
    numUsers: parseInt(pool.numUsers), // convert to Int
    numFunders: parseInt(pool.numFunders),
    DPoolIDs: pool.poolIds
  };
  return dpoolListInput as DPoolListInput;
}
####
export function toDPoolList(poolInput: DPoolListInput): DPoolList {
  //pick args, and convert to the correct number
  let dpoolList: DPoolList = new DPoolList();
  //inputPoolList if isInput
  dpoolList.__typename = "DPoolList";
  dpoolList.id = poolInput.id;
  dpoolList.numActiveUsers = parseBigInt(poolInput.numActiveUsers);
  dpoolList.numUsers = parseBigInt(poolInput.numUsers);
  dpoolList.numFunders = parseBigInt(poolInput.numFunders);
  dpoolList.numPools = parseBigInt(poolInput.numFunders);
  dpoolList.poolIds = poolInput.DPoolIDs;

  //load
  //dpool.numActiveUsers = parseInt(poolInput, "load"),
  //dpool.numActiveDeposits = parseInt(poolInput, "load"),
  //"save"
  return dpoolList;
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
