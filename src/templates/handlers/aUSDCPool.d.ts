import { ethereum } from "@graphprotocol/graph-ts";
import { EDeposit, EWithdraw, EFund, ESetParamUint, ESetParamAddress } from "../generated/contracts/DInterest";
export declare function handleEDeposit(event: EDeposit): void;
export declare function handleEWithdraw(event: EWithdraw): void;
export declare function handleEFund(event: EFund): void;
export declare function handleESetParamAddress(event: ESetParamAddress): void;
export declare function handleESetParamUint(event: ESetParamUint): void;
export declare function handleBlock(block: ethereum.Block): void;
