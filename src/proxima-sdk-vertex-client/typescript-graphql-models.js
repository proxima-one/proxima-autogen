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

export function to$EntityName(objInput: $EntityNameInput): $EntityName {
  let obj: $EntityName = new $EntityName();
  obj.__typename = "$EntityName";
  obj.id = objInput.id;
  $FNBODY;
  return obj;
}
