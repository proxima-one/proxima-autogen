//bind to the correct area ... (Class, add in function), where is the placeholder text
//export type $eventname = $function.$eventname;
import { Contract, ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
####
static bind(address: string, provider?: Signer | Provider): $entityName {
  if (!provider) {
    provider = ethers.getDefaultProvider("mainnet");
  }
  return new Contract(address, _abi, provider) as $entityName;
}
####
export {
  $name__factory as $name
} from "./factories/$name__factory";
####
export { $name }
####
export { $name__factory }
