//Update with typechain
//parsingInputs

//parsingOutputs

//updates for the autogeneration of the files
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: BigInt | BigNumberish,
  Float: number | BigNumber | BigNumberish,
  BigDecimal: BigNumberish,
  BigInt: BigInt,
};








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
